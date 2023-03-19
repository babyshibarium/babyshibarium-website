import {WalletSelector} from "./WalletSelector";
import React, {useEffect} from "react";
import {useAppContext} from "./contexts/AppContext";
import {formatNumber, parseNumber} from "./lib/util";
import {StakeBabyR} from "./stakes/BabyR";
import {StakeBNB} from "./stakes/BNB";
import {StakeUSDT} from "./stakes/USDT";

export const App = () => {
  // const {} = useAppContext();

  // useEffect(()=>{
  //   const interval = setInterval(() => {
  //     (async()=>{
  //       console.log("fetch info");
  //     })();
  //   }, 15000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="body-bg staking">
      <div className="main">
        <WalletSelector/>

        <div className="main__body d-flex flex-column mx-auto justify-content-center">
          <div className="main__body__title d-flex">STAKE</div>
          <div className="main__body__title2 d-flex">Notice: Withdraw Fee 4%</div>

          <StakeBabyR/>

          <StakeBNB/>

          <StakeUSDT/>
        </div>

        <div className="main__footer text-center w-100">&#169; BABYSHIBARIUM 2023</div>
      </div>
    </div>
  );
}
