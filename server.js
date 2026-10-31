const fs = require('fs');
const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Auto-load .env.local if present
const candidateEnvFiles = [
  path.join(__dirname, '.env.local'),
  path.join(process.cwd(), '.env.local'),
  path.join(__dirname, '.env')
];
for (const envPath of candidateEnvFiles) {
  if (fs.existsSync(envPath)) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim();
          if (key) {
            process.env[key] = val;
          }
        }
      });
      console.error('[BM4U] Loaded environment variables from:', envPath);
      break;
    } catch (e) {
      console.error('[BM4U] Error reading env file:', e);
    }
  }
}

// Fallback & sanitization for MongoDB URI
const DIRECT_REPLICA_URI = 'mongodb://hirafsan1_db_user:qN8Xp5iY9Z0eflD2@ac-wzh7atb-shard-00-00.vfhwhh0.mongodb.net:27017,ac-wzh7atb-shard-00-01.vfhwhh0.mongodb.net:27017,ac-wzh7atb-shard-00-02.vfhwhh0.mongodb.net:27017/bm4u?ssl=true&replicaSet=atlas-qzp4vq-shard-0&authSource=admin&retryWrites=true&w=majority';
if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes(' ') || process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
  process.env.MONGODB_URI = DIRECT_REPLICA_URI;
} else {
  process.env.MONGODB_URI = process.env.MONGODB_URI.replace(/ac\s+wzh7atb/g, 'ac-wzh7atb').replace(/\s+/g, '');
}

// Telegram fallback
if (!process.env.TELEGRAM_BOT_TOKEN) {
  process.env.TELEGRAM_BOT_TOKEN = '9165886419:AAHs4EnRqLZWtY5G__Ms83jkOM7PZtvU6y8';
}
if (!process.env.TELEGRAM_CHAT_ID) {
  process.env.TELEGRAM_CHAT_ID = '-5583839789';
}

console.error('[BM4U] __dirname:', __dirname);
console.error('[BM4U] process.cwd():', process.cwd());
try {
  console.error('[BM4U] Files in __dirname:', fs.readdirSync(__dirname));
} catch (e) {
  console.error('[BM4U] Readdir error:', e);
}

// Search for .next directory
let appDir = __dirname;
const candidateDirs = [
  __dirname,
  path.join(__dirname, 'buybm-deploy'),
  path.join(__dirname, 'bm4u'),
  path.join(__dirname, 'bm4'),
  path.join(__dirname, 'app'),
  process.cwd()
];

for (const dir of candidateDirs) {
  if (fs.existsSync(path.join(dir, '.next', 'BUILD_ID'))) {
    appDir = dir;
    console.error('[BM4U] Found valid .next in:', dir);
    break;
  }
}

console.error('[BM4U] Final appDir:', appDir);
console.error('[BM4U] BUILD_ID exists?:', fs.existsSync(path.join(appDir, '.next', 'BUILD_ID')));

const dev = false;
const app = next({ 
  dev, 
  dir: appDir 
});
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error handling request:', req.url, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end(`Internal Server Error: ${err && err.message ? err.message : String(err)}`);
        }
      }
    });

    server.once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });

    if (typeof PhusionPassenger !== 'undefined') {
      server.listen('passenger');
    } else {
      server.listen(port, () => {
        console.log(`> Server ready on port ${port}`);
      });
    }
  })
  .catch((err) => {
    console.error('Failed to prepare Next.js app:', err);
    process.exit(1);
  });
