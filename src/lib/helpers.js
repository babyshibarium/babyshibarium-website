import { toast } from 'react-toastify';
import { getAddress } from 'ethers/lib/utils';
import { chainUrls, defaultChain, nativeCurrencies, networkNames } from './constants'

export const getNativeCurrency = chainId => nativeCurrencies[chainId || 1];

export const logError = (...args) => {
  // eslint-disable-next-line no-console
  console.error(...args);
};

export const logDebug = (...args) => {
  if (process.env.REACT_APP_DEBUG_LOGS === 'true') {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

export const getNetworkName = chainId =>
  networkNames[chainId] || 'Unknown Network';

export const getWalletProviderName = provider =>
  provider?.connection?.url || null;

export const getAccountString = address => {
  const account = getAddress(address);
  const len = account.length;
  return `0x${account.substr(2, 4)}...${account.substr(len - 4, len - 1)}`;
};

const IMPOSSIBLE_ERROR =
  'Unable to perform the operation. Reload the application and try again.';

const TRANSACTION_REPLACED_ERROR =
  'Transaction was replaced by another. Reload the application and find the transaction in the history page.';

export const showError = error => toast.error(error, {
  position: "bottom-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
});

export const handleWalletError = (error, showError) => {
  if (error?.message && error?.message.length <= 120) {
    showError(error.message);
  } else if (
    error?.message &&
    error?.message.toLowerCase().includes('transaction was replaced')
  ) {
    showError(TRANSACTION_REPLACED_ERROR);
  } else {
    showError(IMPOSSIBLE_ERROR);
  }
};

export const getRPCUrl = (chainId, returnAsArray = false) =>
  returnAsArray ? chainUrls[chainId || defaultChain].rpc : chainUrls[chainId || defaultChain].rpc[0];

export const getTokenLogo = chainId => {
  const nativeCurrency = nativeCurrencies[chainId]
  if (!nativeCurrency) {
    return ''
  }
  return `/images/${nativeCurrency.symbol.toLowerCase()}.png`
}

export const getExplorerUrl = chainId => chainUrls[chainId]?.explorer
