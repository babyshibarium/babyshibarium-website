import React, {useCallback, useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import {formatNumber, parseNumber, secondsToString} from "../lib/util";
import {useAppContext} from "../contexts/AppContext";
import {useWeb3Context} from "../contexts/Web3Context";
import {BigNumber} from "ethers";

export const StakeBNB = () => {
  const {
    fetchBabyRBalance,
    ethBalance, fetchETHBalance,
    ethStakeInfo, fetchETHStakeInfo,
    claimETH, stakeETH, unStakeETH,
    blockNumber, blockTime, period,
  } = useAppContext();

  const {account} = useWeb3Context();

  const [nextClaimTxt, setNextClaimTxt] = useState("---");
  const [canClaim, setCanClaim] = useState(false);
  useEffect(() => {
    const interval = setInterval(()=>{
      if (period && blockNumber && blockTime) {
        const time = Math.floor(new Date().getTime()/1000);
        const currentBlock = blockNumber + Math.floor((time-blockTime)/3);

        if (ethStakeInfo["amount"].gt(0) && ethStakeInfo["lastClaim"].add(period).gt(currentBlock)) {
          const nextTimeInSecond = ethStakeInfo["lastClaim"].add(period).sub(currentBlock).toNumber() * 3;
          setNextClaimTxt(secondsToString(nextTimeInSecond));
          setCanClaim(false);
        } else {
          setNextClaimTxt("00:00:00");
          setCanClaim(ethStakeInfo["amount"].gt(0));
        }
      } else {
        setNextClaimTxt("---");
        setCanClaim(false);
      }
    }, 1000);

    return ()=>clearInterval(interval);
  }, [ethStakeInfo, blockNumber, blockTime, period, setNextClaimTxt]);

  const runClaim = useCallback(async()=>{
    if (period && blockNumber && blockTime) {
      const oldBalance = await fetchBabyRBalance();
      const tx = await claimETH();
      if(!tx) {
        alert("claim error");
        return
      }
      const newBalance = await fetchBabyRBalance();
      alert(`you got: ${formatNumber(parseNumber(newBalance.sub(oldBalance), 18, 6))} BabyR`);
      fetchETHStakeInfo();
      fetchETHBalance();
    }
  }, [blockNumber, blockTime, claimETH, fetchBabyRBalance, fetchETHBalance, fetchETHStakeInfo, period]);

  const [modalStakeShow, setModalStake] = useState(false);
  function openModalStake() {
    setModalStake(true);
  }
  function closeModalStake() {
    setModalStake(false);
  }

  const [amount, setAmount] = useState(BigNumber.from(0));
  function changeAmount(value) {
    setAmount(BigNumber.from(value*1e6).mul(1e3).mul(1e9));
  }

  const runStake = useCallback(async()=>{
    if (amount.gt(ethBalance)) {
      alert("not enough balance");
      return;
    }
    if (amount.gt(0) && account) {
      const tx = await stakeETH(amount);
      if (!tx) {
        alert("stake error");
        return;
      }
      closeModalStake();
      fetchETHStakeInfo();
    }
  }, [amount, ethBalance, account, stakeETH, fetchETHStakeInfo]);

  const [modalUnStakeShow, setModalUnStake] = useState(false);
  function openModalUnStake() {
    setModalUnStake(true);
  }
  function closeModalUnStake() {
    setModalUnStake(false);
  }

  const runUnStake = useCallback(async()=>{
    if(amount.gt(ethStakeInfo["amount"])) {
      alert("not enough staked amount");
      return
    }
    if(amount.gt(0) && account) {
      const tx = await unStakeETH(amount);
      if(!tx) {
        alert("unstake error");
        return
      }
      closeModalUnStake();
      fetchETHBalance();
      fetchETHStakeInfo();
    }
  }, [account, amount, ethStakeInfo, fetchETHBalance, fetchETHStakeInfo, unStakeETH]);

  return(
    <div className="main__body__item d-flex align-items-center">
      <div className="main__body__item__ava"><img src={process.env.PUBLIC_URL +"/svg/bnb.svg"} alt="bnb"/></div>
      <div className="main__body__item__info d-flex flex-column justify-content-center --name">
        <div className="main__body__item__info__name">STAKE</div>
        <div className="main__body__item__info__value">Stake BNB</div>
      </div>
      <div className="main__body__item__info d-flex flex-column justify-content-center">
        <div className="main__body__item__info__name">TOTAL STAKED</div>
        <div className="main__body__item__info__value">{formatNumber(parseNumber(ethStakeInfo["amount"]))} BNB</div>
      </div>
      <div className="main__body__item__info d-flex flex-column justify-content-center">
        <div className="main__body__item__info__name">EARNED</div>
        <div className="main__body__item__info__value">{formatNumber(parseNumber(ethStakeInfo["earned"], 18, 2))} BabyR</div>
      </div>
      <div className="main__body__item__info d-flex flex-column justify-content-center">
        <div className="main__body__item__info__name">ARP</div>
        <div className="main__body__item__info__value">999%</div>
      </div>
      <div className="main__body__item__info d-flex flex-column justify-content-center">
        <div className="main__body__item__info__name">END IN</div>
        <div className="main__body__item__info__value">{nextClaimTxt}</div>
      </div>

      <div className="main__body__item__btn">
        <button
          onClick={openModalStake}
          className={`main__body__item__btn__plus button ${ethStakeInfo["amount"].eq(0)?'disabled':''} d-flex justify-content-center align-items-center`}>+
        </button>
      </div>
      <div className="main__body__item__btn">
        {ethStakeInfo["amount"].gt(0) &&
          <button
            onClick={openModalUnStake}
            className="main__body__item__btn__unstake button d-flex justify-content-center align-items-center"
          >UNSTAKE</button>
        }
        {ethStakeInfo["amount"].eq(0) &&
          <button
            onClick={openModalStake}
            className="main__body__item__btn__stake button d-flex justify-content-center align-items-center"
          >STAKE</button>
        }
      </div>
      <div className="main__body__item__btn">
        <button
          onClick={runClaim}
          className={`main__body__item__btn__claim button ${canClaim?'':'disabled'} d-flex justify-content-center align-items-center`}>CLAIM
        </button>
      </div>

      <Modal
        className="modal modal-complete fade"
        show={modalStakeShow}
        onHide={closeModalStake}
        backdrop="static"
        keyboard={false}
        centered
        tabIndex="-1" aria-labelledby="modal-complete" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-content__header"></div>
            <div className="modal-content__body">
              <div className="modal-content__body__wrapper d-flex flex-column align-items-center text-center">
                <button className="btn-close-modal button" onClick={closeModalStake}>{'\u2715'}</button>
                <div className="modal-content__body__title">STAKE BNB</div>
                <div className="modal-content__body__msg d-flex justify-content-center">
                  <input
                    onChange={(e)=>changeAmount(e.target.value)}
                    autoFocus={true}
                    className="modal-content__body__msg__input"
                    type="number" min="0" placeholder="0"/>
                </div>
                <div className="modal-content__txt">TOTAL VALUE</div>
                <div className="modal-content__total"><span>{formatNumber(parseNumber(ethBalance, 18, 6))}</span> BNB</div>
                <button onClick={runStake} className="modal-content__body__btn-approve button">Stake</button>
              </div>
            </div>
            <div className="modal-content__footer"></div>
          </div>
        </div>
      </Modal>

      <Modal
        className="modal modal-complete fade"
        show={modalUnStakeShow}
        onHide={closeModalUnStake}
        backdrop="static"
        keyboard={false}
        centered
        tabIndex="-1" aria-labelledby="modal-complete" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-content__header"></div>
            <div className="modal-content__body">
              <div className="modal-content__body__wrapper d-flex flex-column align-items-center text-center">
                <button className="btn-close-modal button" onClick={closeModalUnStake}>{'\u2715'}</button>
                <div className="modal-content__body__title">UNSTAKE BabyR</div>
                <div className="modal-content__body__msg d-flex justify-content-center">
                  <input
                    onChange={(e)=>changeAmount(e.target.value)}
                    autoFocus={true}
                    className="modal-content__body__msg__input"
                    type="number" min="0" placeholder="0"/>
                </div>
                <div className="modal-content__txt">STAKED VALUE</div>
                <div className="modal-content__total"><span>{formatNumber(parseNumber(ethStakeInfo["amount"]))}</span> BNB</div>
                <button onClick={runUnStake} className="modal-content__body__btn-unstake button">UnStake</button>
              </div>
            </div>
            <div className="modal-content__footer"></div>
          </div>
        </div>
      </Modal>
    </div>
  );
}