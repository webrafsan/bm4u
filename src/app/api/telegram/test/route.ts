import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage, getTelegramConfig } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { botToken, chatId } = body;

    const config = await getTelegramConfig();
    const tokenToUse = botToken?.trim() || config.botToken;
    const chatToUse = chatId?.trim() || config.chatId;

    if (!tokenToUse || !chatToUse) {
      return NextResponse.json({
        success: false,
        error: 'Please provide both Telegram Bot Token and Chat ID to send a test notification.',
      }, { status: 400 });
    }

    const testMessage =
      `🎉 <b>TELEGRAM NOTIFICATIONS CONNECTED! — BM SHOP</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✅ Your Telegram bot is active and communicating with your website.\n` +
      `📦 You will now receive instant live alerts for every new order and payment TXID confirmation.\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏰ <b>Tested At:</b> ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC`;

    const result = await sendTelegramMessage(testMessage, tokenToUse, chatToUse);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to send message via Telegram Bot API',
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Test message sent successfully to your Telegram!',
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Internal server error while sending test notification.',
    }, { status: 500 });
  }
}
