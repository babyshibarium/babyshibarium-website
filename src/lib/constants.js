export const networkNames = {
  56: 'Binance',
  97: 'Binance Testnet',
};

export const chainUrls = {
  56: {
    rpc: ['https://bsc-dataseed.binance.org'],
    explorer: 'https://bscscan.com/',
    chainId: 56,
    name: "Binance",
  },
  97: {
    rpc: ['https://data-seed-prebsc-1-s3.binance.org:8545'],
    explorer: 'https://testnet.bscscan.com/',
    chainId: 97,
    name: "Binance Testnet",
  },
};

export const nativeCurrencies = {
  56: {
    chainId: 56,
    decimals: 18,
    name: 'Binance Coin',
    symbol: 'BNB',
    mode: 'NATIVE',
  },
  97: {
    chainId: 97,
    decimals: 18,
    name: 'Binance Coin',
    symbol: 'BNB',
    mode: 'NATIVE',
  },
};

export const allowChain = [56, 97]
export const defaultChain = 56

export const TOKEN_ADDRESS = {
  56: "0xccE6c2B30270518fCA8e64C8E97c1fC45d644494",
  97: "0xccE6c2B30270518fCA8e64C8E97c1fC45d644494",
};

export const STAKE_ADDRESS = {
  56: "0xd95BCa7af0E8A0715B1EcCBB0F866Ad721b41bfA",
  97: "0x6c09D5578ac471a40d0f2e5c9b9c79A05Eef244A",
}

export const USDT_ADDRESS = {
  56: "0x55d398326f99059ff775485246999027b3197955",
  97: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
}

export const WETH_ADDRESS = {
  56: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
  97: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
}