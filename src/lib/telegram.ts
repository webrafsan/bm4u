import { getSettingsCollection } from './db';
import { OrderRecord } from '@/types';

interface TelegramConfig {
  botToken?: string;
  chatId?: string;
}

/**
 * Retrieve Telegram Bot Token and Chat ID from either:
 * 1. Environment variables (.env.local)
 * 2. MongoDB site_config settings
 */
const DEFAULT_TELEGRAM_BOT_TOKEN = '9165886419:AAHs4EnRqLZWtY5G__Ms83jkOM7PZtvU6y8';
const DEFAULT_TELEGRAM_CHAT_ID = '-5583839789';

export async function getTelegramConfig(): Promise<TelegramConfig> {
  const envToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || DEFAULT_TELEGRAM_BOT_TOKEN;
  const envChatId = process.env.TELEGRAM_CHAT_ID?.trim() || DEFAULT_TELEGRAM_CHAT_ID;

  if (envToken && envChatId) {
    return { botToken: envToken, chatId: envChatId };
  }

  try {
    const settingsCol = await getSettingsCollection();
    const settings = await settingsCol.findOne({ key: 'site_config' });

    return {
      botToken: envToken || settings?.telegramBotToken?.trim(),
      chatId: envChatId || settings?.telegramChatId?.trim(),
    };
  } catch (err) {
    console.error('Error fetching Telegram settings from DB:', err);
    return { botToken: envToken, chatId: envChatId };
  }
}

/**
 * Send an HTML formatted Telegram message via official Bot API
 */
export async function sendTelegramMessage(
  htmlText: string,
  overrideToken?: string,
  overrideChatId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getTelegramConfig();
    const botToken = (overrideToken || config.botToken || DEFAULT_TELEGRAM_BOT_TOKEN).trim();
    const chatId = (overrideChatId || config.chatId || DEFAULT_TELEGRAM_CHAT_ID).trim();

    if (!botToken || !chatId) {
      console.warn('⚠️ Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.');
      return { success: false, error: 'Telegram bot token or chat ID is not configured.' };
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error('Telegram Bot API error:', data);
      return { success: false, error: data.description || 'Telegram API rejected message.' };
    }

    console.log('[BM4U] Telegram message delivered successfully to chat:', chatId);
    return { success: true };
  } catch (err: any) {
    console.error('Failed to send Telegram notification:', err);
    return { success: false, error: err.message || 'Network error reaching Telegram API' };
  }
}

/**
 * Format and trigger automated notification when a customer places an order
 */
export async function notifyNewOrder(order: OrderRecord): Promise<void> {
  try {
    const itemsList = order.items
      .map(
        (it, idx) =>
          `  ${idx + 1}. <b>${it.product?.title || 'Meta Asset'}</b>\n` +
          `     ├ Qty: <code>${it.quantity}</code> × $${(it.product?.price || 0).toFixed(2)}\n` +
          `     └ Format: <i>${it.product?.format || 'Direct Delivery'}</i>`
      )
      .join('\n');

    const walletInfo = order.cryptoWallet
      ? `${order.cryptoWallet.name} (${order.cryptoWallet.symbol} - ${order.cryptoWallet.network})`
      : order.customer?.selectedCrypto || 'Crypto';

    const txidDisplay = order.txid ? `<code>${order.txid}</code>` : '<i>Awaiting payment hash...</i>';
    const notesDisplay = order.customer?.orderNotes ? `\n📝 <b>Customer Notes:</b> <i>${order.customer.orderNotes}</i>` : '';

    const text = 
      `🚨 <b>NEW ORDER RECEIVED! — BM 4 U</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 <b>Order ID:</b> <code>#${order.orderId}</code>\n` +
      `👤 <b>Customer Name:</b> ${order.customer?.fullName || 'Anonymous'}\n` +
      `✉️ <b>Email:</b> <code>${order.customer?.email || 'N/A'}</code>\n` +
      `💬 <b>Telegram:</b> <b>${order.customer?.telegram || 'N/A'}</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🛒 <b>Purchased Items:</b>\n${itemsList}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 <b>Total Amount:</b> <b>$${(order.total || 0).toFixed(2)} USD</b>\n` +
      `💳 <b>Payment Wallet:</b> ${walletInfo}\n` +
      `🧾 <b>TXID Hash:</b> ${txidDisplay}\n` +
      `📊 <b>Status:</b> <b>${order.status}</b>` +
      `${notesDisplay}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ <b>Time:</b> ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC\n` +
      `⚡ <a href="https://bm4u.net/drafsan">Open Admin Dashboard</a>`;

    await sendTelegramMessage(text);
  } catch (err) {
    console.error('Error formatting order notification:', err);
  }
}

/**
 * Format and trigger notification when a customer submits or updates their TXID payment hash
 */
export async function notifyTxidSubmitted(
  orderId: string,
  txid: string,
  customerTelegram?: string
): Promise<void> {
  try {
    const text =
      `💰 <b>PAYMENT TXID SUBMITTED! — BM 4 U</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 <b>Order ID:</b> <code>#${orderId}</code>\n` +
      `💬 <b>Customer Telegram:</b> <b>${customerTelegram || 'N/A'}</b>\n` +
      `🧾 <b>Submitted TXID Hash:</b>\n` +
      `<code>${txid}</code>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⚡ <b>Action Required:</b> Verify transaction on blockchain explorer and dispatch credentials in the admin dashboard.\n` +
      `🔗 <a href="https://bm4u.net/drafsan">Fulfill Order in Dashboard</a>`;

    await sendTelegramMessage(text);
  } catch (err) {
    console.error('Error formatting TXID notification:', err);
  }
}
