import type { Faq } from '@/lib/seoContent';

export type ToolContent = {
  heading: string;
  sections: { title: string; paragraphs?: string[]; bullets?: string[] }[];
  howToName: string;
  howToSteps: { name: string; text: string }[];
  faqs: Faq[];
};

export const TWO_FA_CONTENT: ToolContent = {
  heading: 'How the Facebook 2FA code generator works',
  sections: [
    {
      title: 'What is a 2FA (TOTP) code?',
      paragraphs: [
        'Two-factor authentication adds a second step after your password. Authenticator apps use the time-based one-time password standard (TOTP, RFC 6238): a shared secret key and the current time are combined with an HMAC to produce a short numeric code that changes every 30 seconds. Facebook accepts these codes as a login check for personal profiles and Business Manager admins.',
        'This tool does the same calculation as an authenticator app. You paste the Base32 secret key, and it shows the current six-digit code with a live 30-second countdown and a one-click copy button. The calculation runs in your browser with the Web Crypto API, so the secret is not sent to our server.',
      ],
    },
    {
      title: 'Where to find the secret key',
      paragraphs: [
        'When you turn on an authenticator app in Facebook security settings, Facebook shows a QR code and, next to it, a text setup key. That text key is the Base32 secret this tool needs. Accounts delivered by BM 4 U include the 2FA secret in the login kit, usually in the third field of the credential line.',
      ],
      bullets: [
        'Secrets use the letters A-Z and the digits 2-7; spaces and lowercase letters are ignored.',
        'Treat the secret like a password: anyone who has it can generate valid codes.',
      ],
    },
    {
      title: 'If your code is rejected',
      bullets: [
        'Check that the secret was copied completely, with no missing or swapped characters.',
        'Make sure your device clock is accurate; TOTP depends on the current time, so a clock that is a minute off produces the wrong code.',
        'Enter the code before the countdown reaches zero, or wait for the next code.',
        'If a delivered account still fails, contact support within the 24-hour guarantee window.',
      ],
    },
  ],
  howToName: 'How to generate a Facebook 2FA code from a secret key',
  howToSteps: [
    { name: 'Copy the secret key', text: 'Copy the Base32 2FA secret from your account details or from the Facebook authenticator setup screen.' },
    { name: 'Paste it into the tool', text: 'Paste the secret into the input field. Spaces and lowercase letters are cleaned up automatically.' },
    { name: 'Read the six-digit code', text: 'The current code appears with a 30-second countdown. Use the copy button to copy it.' },
    { name: 'Enter it on Facebook', text: 'Type the code into the Facebook two-factor prompt before the countdown ends. If it expires, use the next code.' },
    { name: 'Use bulk mode for many accounts', text: 'Switch to bulk mode and paste several secrets to generate codes for all of them at once.' },
  ],
  faqs: [
    { question: 'Is it safe to paste my 2FA secret here?', answer: 'The code is generated in your browser using the Web Crypto API, and the secret is not sent to our server. As a general rule, only enter secrets on tools you trust and never share them with anyone.' },
    { question: 'Why does the code change every 30 seconds?', answer: 'TOTP codes are derived from the current time divided into 30-second windows, so each window has a different code. This limits how long a stolen code stays valid.' },
    { question: 'Does this work for accounts other than Facebook?', answer: 'Any service that uses the standard TOTP authenticator method with a Base32 secret and six-digit codes will produce a matching code, though this page is built for Facebook workflows.' },
    { question: 'Can I generate codes for many accounts at once?', answer: 'Yes. Bulk mode accepts multiple secrets and returns a code for each one, which helps agencies managing many profiles.' },
    { question: 'My code is wrong. What should I check?', answer: 'Verify the secret has no typos and that your device time is correct. Also make sure you enter the code before the 30-second countdown ends.' },
  ],
};

export const UID_CHECKER_CONTENT: ToolContent = {
  heading: 'How the Facebook live UID checker works',
  sections: [
    {
      title: 'What is a Facebook UID?',
      paragraphs: [
        'A UID is the numeric ID of a Facebook profile or page. It stays the same even when the name or username changes, which makes it the most reliable way to refer to an account. Resellers and media buyers use UIDs to confirm that a profile still exists before they log in or import it into an anti-detect browser.',
      ],
    },
    {
      title: 'What LIVE, DIE and UNKNOWN mean',
      bullets: [
        'LIVE: the profile resolves normally and returns its public profile picture, so it appears to be active.',
        'DIE: the profile resolves to the default silhouette or does not resolve, which usually means it is restricted, disabled or removed.',
        'UNKNOWN: the UID format is invalid or the check could not be completed. Try again or check the format.',
      ],
      paragraphs: [
        'The checker sends a request to the public Facebook picture endpoint and reads how it responds. This makes it fast and lets it run in bulk, but it is an indicator, not a guarantee: a LIVE result does not promise that login or 2FA will succeed.',
      ],
    },
    {
      title: 'When to use it',
      bullets: [
        'Right after you receive purchased accounts, to confirm each UID before the 24-hour guarantee window closes.',
        'Before you invite a profile as a Business Manager admin or assign it to a Page.',
        'To clean a long list of profiles and keep only the ones that are still active.',
      ],
    },
  ],
  howToName: 'How to check if a Facebook UID is live or dead',
  howToSteps: [
    { name: 'Find the UID', text: 'Copy the numeric UID from your account details. It is usually the first field of the credential line.' },
    { name: 'Paste it into the checker', text: 'Paste a single UID, or switch to bulk mode and paste one UID per line.' },
    { name: 'Run the check', text: 'Start the check and wait a moment while each UID is tested.' },
    { name: 'Read the result', text: 'LIVE means the profile appears active, DIE means it is restricted or removed, and UNKNOWN means the check could not complete.' },
    { name: 'Report problems quickly', text: 'If a purchased account shows DIE, contact support on Telegram within 24 hours of delivery.' },
  ],
  faqs: [
    { question: 'Is the UID checker free?', answer: 'Yes. Both single and bulk checks are free to use and do not need an account.' },
    { question: 'How accurate is the result?', answer: 'It is a fast indicator based on the public profile picture response. It tells you whether a profile appears active, but it cannot confirm that login credentials or 2FA are correct.' },
    { question: 'Can I check many UIDs at once?', answer: 'Yes. Switch to bulk mode and paste one UID per line to check a whole list in one run.' },
    { question: 'What does DIE mean?', answer: 'DIE means the profile did not return a normal public picture, which usually points to a restricted, disabled or deleted profile.' },
    { question: 'What should I do if a purchased account shows DIE?', answer: 'Contact our Telegram support desk within 24 hours of delivery with the UID, and read the replacement rules to see what is covered.' },
  ],
};
