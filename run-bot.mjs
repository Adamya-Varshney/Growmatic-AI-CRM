import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

console.log('ANTHROPIC_API_KEY set:', !!process.env.ANTHROPIC_API_KEY);

import('./bot.js');