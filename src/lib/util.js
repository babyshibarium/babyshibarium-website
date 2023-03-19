import { formatUnits } from "@ethersproject/units";

export function shortenHex(hex, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length
  )}`;
}

const SCAN_PREFIXES = {
  56: "bscscan.com",
  97: "testnet.bscscan.com",
};

export function formatEtherscanLink(
  type,
  data
) {
  switch (type) {
    case "Account": {
      const [chainId, address] = data;
      return `https://${SCAN_PREFIXES[chainId]}/address/${address}`;
    }
    case "Transaction": {
      const [chainId, hash] = data;
      return `https://${SCAN_PREFIXES[chainId]}/tx/${hash}`;
    }
  }
}

export const parseNumber = (
  value,
  decimals = 18,
  decimalsToDisplay = 3
) => {
  const num = parseFloat(formatUnits(value, decimals));
  if (num === parseInt(num)) return num;
  return num.toFixed(decimalsToDisplay);
};

export const getTransactionString = hash => {
  if (!hash) return '';
  const len = hash.length;
  return `0x${hash.slice(2, 4)}...${hash.slice(len - 4, len - 1)}`;
};

export const formatNumber = (amount, suffix = ',') => {
  if (Number(amount)) {
    let ar = amount.toString().split(".");
    let re = '\\d(?=(\\d{3})+$)';
    return ar[0].replace(new RegExp(re, 'g'), `$&${suffix}`) + (ar.length === 2 ? `.${ar[1]}`:'');
  }
  return 0
}


export const secondsToString = timestamp => {
  const date = new Date(timestamp * 1000);
  let utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return `${utc.getHours().toString().padStart(2, '0')}:${utc.getMinutes().toString().padStart(2, '0')}:${utc.getSeconds().toString().padStart(2, '0')}`;
}
