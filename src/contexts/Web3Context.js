// import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import Web3Modal from "web3modal";
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import { allowChain } from '../lib/constants';
import {
  getRPCUrl,
  logError,
} from '../lib/helpers';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const Web3Context = React.createContext({});
export const useWeb3Context = () => useContext(Web3Context);

const rpc = {
  56: getRPCUrl(56),
  97: getRPCUrl(97),
};

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // infuraId: "",
      rpc,
    },
  },
};

let web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    cacheProvider: true,
    // cacheProvider: false,
    providerOptions,
  });
}

export const Web3Provider = ({ children }) => {
  const [{ chainId, provider, account }, setWeb3State] = useState(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [invalidNetwork, setInvalidNetwork] = useState(false);

  const setWeb3Provider = useCallback(async (prov, initialCall = false) => {
    try {
      if (prov) {
        const provider = new ethers.providers.Web3Provider(prov);
        const chainId = Number(prov.chainId);
        if (initialCall) {
          const signer = provider.getSigner();
          const gotAccount = await signer.getAddress();
          setWeb3State({
            account: gotAccount,
            provider: provider,
            chainId: chainId,
          });
        } else {
          setWeb3State(_provider => ({
            ..._provider,
            provider: provider,
            chainId: chainId,
          }));
        }
      }
    } catch (error) {
      logError({ web3ModalError: error });
    }
  }, []);

  useEffect(() => {
    if (chainId) {
      if (!allowChain.includes(chainId)) {
        setInvalidNetwork(true);
      }
      else {
        setInvalidNetwork(false);
      }
    }
  }, [chainId]);

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider();
    setWeb3State({});
  }, []);

  const connectWeb3 = useCallback(() => {
    try {
      let itv = setInterval(async () => {
        if (web3Modal) {
          clearInterval(itv);
          setLoading(true);

          const modalProvider = await web3Modal.connect();

          await setWeb3Provider(modalProvider, true);

          modalProvider.on('accountsChanged', accounts => {
            setWeb3State(_provider => ({
              ..._provider,
              account: accounts[0],
            }));
          });
          modalProvider.on('chainChanged', () => {
            setWeb3Provider(modalProvider);
          });

        }
      }, 300);
    } catch (error) {
      logError({ web3ModalError: error });
      disconnect();
    }
    setLoading(false);
  }, [setWeb3Provider, disconnect]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
    }
    (async function load() {
      if (web3Modal.cachedProvider) {
        connectWeb3();
      } else {
        setLoading(false);
      }
    })();
  }, [connectWeb3]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        connectWeb3,
        loading,
        disconnect,
        chainId,
        account,
        invalidNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
