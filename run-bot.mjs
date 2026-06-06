import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

console.log('Full Claude key length:', process.env.ANTHROPIC_API_KEY?.length);
console.log('Claude key:', process.env.ANTHROPIC_API_KEY);
console.log('Claude key starts with:', process.env.ANTHROPIC_API_KEY?.slice(0, 10));

import('./bot.js');