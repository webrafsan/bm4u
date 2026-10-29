import { NextRequest, NextResponse } from 'next/server';
import { getSettingsCollection } from '@/lib/db';
import { CRYPTO_WALLETS } from '@/data/cryptoWallets';

const DEFAULT_SETTINGS = {
  key: 'site_config',
  heroTitle: 'Scale Your Meta & TikTok Campaigns With High-Limit Business Managers',
  heroSubtitle: 'Premium verified Business Managers, 2-line & 3-line reinstated accounts, BM2500, and TikTok agency accounts designed for media buyers, agencies, and performance advertisers with instant 24H replacement.',
  announcementText: '⚡ Instant Auto Delivery & 24H Full Replacement Guarantee Active',
  telegramUsername: 'bybm4u',
  telegramLink: 'https://t.me/bybm4u',
  telegramBotToken: '',
  telegramChatId: '',
  supportEmail: 'support@bm4u.net',
  replaceWarrantyHours: '24',
  replacePolicyTitle: 'Strict 24-Hour Technical Warranty',
  replacePolicyDesc: 'All accounts and Business Managers carry a 24-hour guarantee starting from the exact timestamp of delivery. Any technical problem must be reported to our Telegram support team within this window.',
  cryptoWallets: CRYPTO_WALLETS,
  updatedAt: new Date().toISOString(),
};

export async function GET() {
  try {
    const settingsCol = await getSettingsCollection();
    let settings = await settingsCol.findOne({ key: 'site_config' });

    if (!settings) {
      await settingsCol.insertOne(DEFAULT_SETTINGS);
      settings = await settingsCol.findOne({ key: 'site_config' });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (err: any) {
    console.error('Fetch settings error:', err);
    return NextResponse.json(
      { success: false, error: err.message, data: DEFAULT_SETTINGS },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const settingsCol = await getSettingsCollection();

    const updateData = {
      ...body,
      key: 'site_config',
      updatedAt: new Date().toISOString(),
    };
    delete updateData._id;

    const result = await settingsCol.findOneAndUpdate(
      { key: 'site_config' },
      { $set: updateData },
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({
      success: true,
      message: 'Site settings updated successfully',
      data: result,
    });
  } catch (err: any) {
    console.error('Update settings error:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
