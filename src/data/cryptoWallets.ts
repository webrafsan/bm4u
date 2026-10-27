export interface CryptoWallet {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address: string;
  qrCode: string;
}

export const CRYPTO_WALLETS: CryptoWallet[] = [
  {
    id: 'wallet_0',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Mainnet',
    address: '12RxFgjDREneSWxeDnCWiUN1xyFioXVfaP',
    qrCode: '/crypto/bitcoin.png',
  },
  {
    id: 'wallet_1',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'ERC-20',
    address: '0x37465f2d240f15644aabf3333d797f4beb4dc80d',
    qrCode: '/crypto/etherium.png',
  },
  {
    id: 'wallet_2',
    name: 'Tether',
    symbol: 'USDT',
    network: 'TRC-20',
    address: 'TV5VbhBWKyvsBgtnZSay71iXyoRaSccsY7',
    qrCode: '/crypto/usdt.png',
  },
  {
    id: 'wallet_3',
    name: 'Solana',
    symbol: 'SOL',
    network: 'Solana Network',
    address: 'EzBXuhiZu4rU86e6uHGhVHHNHyrSzivy8KQ6oh371VXS',
    qrCode: '/crypto/sol.png',
  },
];
