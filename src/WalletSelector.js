import React, {useCallback} from 'react';
import { useWeb3Context } from './contexts/Web3Context';
import { useAppContext } from './contexts/AppContext';
import { getAccountString } from './lib/helpers';
import {formatNumber, parseNumber} from "./lib/util";
import Logo from './logo.svg';

export const WalletSelector = () => {
  const { invalidNetwork, account, chainId, connectWeb3, disconnect } = useWeb3Context();
  const { getTestToken, fetchBabyRBalance } = useAppContext();
  const { tokenBalance, logout } = useAppContext();
  const disconnectAll = useCallback(async () => {
    disconnect();
    logout();
  }, [disconnect, logout]);

  const runGetTestToken = useCallback(async()=>{
    if (account) {
      const oldBalance = await fetchBabyRBalance();
      const tx = await getTestToken();
      if (!tx) {
        alert("get test BabyR error");
        return
      }
      const newBalance = await fetchBabyRBalance();
      alert(`you got: ${formatNumber(parseNumber(newBalance.sub(oldBalance), 18, 6))} BabyR`);
    }
  },[account, fetchBabyRBalance, getTestToken]);

  if (invalidNetwork) return (
    <div className="menu d-flex justify-content-between align-items-center">
      <div className="menu__logo"><img src={Logo} alt="logo"/><span>BABYSHIBARIUM</span></div>
      <div className="menu__nav d-flex justify-content-center"></div>
      <div className="menu__info"><button className="menu__info__btn-connect button disabled">Wrong Network</button></div>
    </div>
  );
  if (!account || !chainId) return (
    <div className="menu d-flex justify-content-between align-items-center">
      <div className="menu__logo"><img src={Logo} alt="logo"/><span>BABYSHIBARIUM</span></div>
      <div className="menu__nav d-flex justify-content-center"></div>
      <div className="menu__info">
        <button onClick={connectWeb3} className="menu__info__btn-connect button">WALLET CONNECT</button>
      </div>
    </div>
  ); else return(
    <div className="menu d-flex justify-content-between align-items-center">
      <div className="menu__logo"><img src={Logo} alt="logo"/><span>BABYSHIBARIUM</span></div>
      <div className="menu__nav d-flex justify-content-center"></div>
      <div className="menu__info">
        <span className="menu__info__btn-connect">{getAccountString(account)}</span>
        {chainId === 97 &&
          <button onClick={runGetTestToken} className="menu__info__btn-test button">Get Test Token</button>
        }

      </div>
    </div>
  );
};
