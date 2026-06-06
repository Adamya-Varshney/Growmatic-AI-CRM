import { createClient } from '@supabase/supabase-js';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const CLAUDE_KEY = process.env.ANTHROPIC_API_KEY;

if (!TELEGRAM_TOKEN || !SUPABASE_URL || !SUPABASE_KEY || !CLAUDE_KEY) {
  console.error('Missing environment variables:');
  console.error('TELEGRAM_BOT_TOKEN:', !!TELEGRAM_TOKEN);
  console.error('SUPABASE_URL:', !!SUPABASE_URL);
  console.error('SUPABASE_SERVICE_KEY:', !!SUPABASE_KEY);
  console.error('ANTHROPIC_API_KEY:', !!CLAUDE_KEY);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// Store conversation state in memory
const conversations = {};

// Telegram API helper
const telegramApi = async (method, body) => {
  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/${method}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  );
  return response.json();
};

// Send message to Telegram
const sendMessage = async (chatId, text) => {
  return telegramApi('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML'
  });
};

// Score lead intent using Claude
const scoreLead = async (conversation, leadData) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: `You are a lead scoring assistant for IDALS an online dance education platform.

Based on this conversation score the lead intent as High Medium or Low.

Conversation: ${JSON.stringify(conversation)}

Lead data: ${JSON.stringify(leadData)}

Rules:
- High: Responded quickly, specific interest, clear city, asked about enrollment
- Medium: Responded but vague answers, uncertain about batch or style  
- Low: One word answers, no response to questions, seems uninterested

Reply with ONLY one word: High, Medium, or Low`
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Claude API error:', data.error);
      return 'Medium';
    }

    const score = data.content?.[0]?.text?.trim();
    console.log('Claude raw score:', score);

    if (['High', 'Medium', 'Low'].includes(score)) return score;
    return 'Medium';

  } catch (err) {
    console.error('Claude scoring error:', err.message);
    return 'Medium';
  }
};

// Process incoming Telegram message
const processMessage = async (message) => {
  const chatId = message.chat.id;
  const text = message.text || '';
  const firstName = message.from?.first_name || 'there';

  console.log(`Message from ${chatId}: ${text}`);

  // Initialize conversation if new
  if (!conversations[chatId]) {
    conversations[chatId] = {
      step: 0,
      name: firstName,
      phone: '',
      interest: '',
      batchPreference: '',
      city: '',
      transcript: []
    };
  }

  const conv = conversations[chatId];

  // Add user message to transcript
  if (conv.step > 0) {
    conv.transcript.push({ from: 'user', text });
  }

  // Conversation flow
  if (conv.step === 0) {
    // Welcome message
    const welcomeMsg = `Hi ${firstName}! Welcome to IDALS — India's premier online dance education platform 🎉

I will help connect you with the right batch. This takes just 2 minutes.

Which dance style are you most excited to learn? (Hip-hop, House Dance, Locking, Bollywood)`;

    await sendMessage(chatId, welcomeMsg);
    conv.transcript.push({ from: 'bot', text: welcomeMsg });
    conv.step = 1;

  } else if (conv.step === 1) {
    // Captured dance style
    conv.interest = text;

    const batchMsg = `Great choice! 🔥

Are you looking for <b>weekday</b> or <b>weekend</b> batches?`;

    await sendMessage(chatId, batchMsg);
    conv.transcript.push({ from: 'bot', text: `Are you looking for weekday or weekend batches?` });
    conv.step = 2;

  } else if (conv.step === 2) {
    // Captured batch preference
    conv.batchPreference = text;

    const cityMsg = `Perfect! Which city are you in?`;

    await sendMessage(chatId, cityMsg);
    conv.transcript.push({ from: 'bot', text: cityMsg });
    conv.step = 3;

  } else if (conv.step === 3) {
    // Captured city — now score and save
    conv.city = text;

    // Score the lead
    const intentScore = await scoreLead(conv.transcript, {
      interest: conv.interest,
      batchPreference: conv.batchPreference,
      city: conv.city
    });

    console.log(`Lead scored: ${intentScore} for ${firstName}`);

    // Save to Supabase
    // Note: We save without user_id for Telegram leads
    // They will appear in the demo account's leads
    // For production each business would have their own bot token

    // Get the demo user to attach leads to
    const { data: users } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    const userId = users?.[0]?.id || null;

    const { data: savedLead, error } = await supabase
      .from('leads')
      .insert({
        user_id: userId,
        name: firstName,
        phone: '',
        city: conv.city,
        interest: conv.interest,
        batch_preference: conv.batchPreference,
        intent_score: intentScore,
        status: intentScore === 'Low' ? 'archived' : 'inquired',
        source: 'Telegram',
        telegram_chat_id: chatId.toString(),
        conversation_transcript: conv.transcript
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
    } else {
      console.log('Lead saved to Supabase:', savedLead?.id);
    }

    // Send confirmation to user
    const confirmMsg = `Thank you! 🎉

The IDALS team will reach out to you shortly with batch details and fee information.

Meanwhile check our YouTube channel for a preview of the sessions:
👉 youtube.com/@theidals`;

    await sendMessage(chatId, confirmMsg);
    conv.transcript.push({ from: 'bot', text: confirmMsg });

    // Reset conversation
    delete conversations[chatId];
  }
};

// Poll for updates from Telegram
let offset = 0;

const pollUpdates = async () => {
  try {
    const response = await telegramApi('getUpdates', {
      offset,
      timeout: 30,
      limit: 10
    });

    if (response.ok && response.result?.length > 0) {
      for (const update of response.result) {
        offset = update.update_id + 1;

        if (update.message) {
          await processMessage(update.message);
        }
      }
    }
  } catch (err) {
    console.error('Polling error:', err);
  }

  // Poll again after short delay
  setTimeout(pollUpdates, 1000);
};

console.log('Growmatic Telegram bot starting...');
console.log('Waiting for messages...');
console.log('Send a message to your bot to test');

// Start polling
pollUpdates();