import { BigNumber, Contract, utils as etherUtils, constants as etherConstants } from "ethers";
import React, { useContext, useEffect, useState, useCallback, createContext } from "react";
import TOKEN_ABI from "../contracts/token.abi.json";
import ERC20_ABI from "../contracts/erc20.abi.json";
import STAKE_ABI from "../contracts/stake.abi.json";
import TEST_ABI from "../contracts/test.abi.json";
import { useWeb3Context } from "./Web3Context";
import {TOKEN_ADDRESS, STAKE_ADDRESS, USDT_ADDRESS, WETH_ADDRESS} from "../lib/constants";
import {logError} from "../lib/helpers";

export const AppContext = createContext({})
export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const { provider, account, chainId } = useWeb3Context();
  const [babyRContract, setBabyRContract] = useState();
  const [stakeContract, setStakeContract] = useState();
  const [usdtContract, setUSDTContract] = useState();

  const [blockNumber, setBlockNumber] = useState();
  const [blockTime, setBlockTime] = useState();
  const [period, setPeriod] = useState(28800);

  const [txHash, setTxHash] = useState();
  const [loading, setLoading] = useState(false);
  const [babyRBalance, setBabyRBalance] = useState(BigNumber.from(0));
  const [ethBalance, setETHBalance] = useState(BigNumber.from(0));
  const [usdtBalance, setUSDTBalance] = useState(BigNumber.from(0));

  const [babyRStakeInfo, setBabyRStakeInfo] = useState({
    amount: etherConstants.Zero,
    lastClaim: etherConstants.Zero,
    earned: etherConstants.Zero,
  });
  const [ethStakeInfo, setETHStakeInfo] = useState({
    amount: etherConstants.Zero,
    lastClaim: etherConstants.Zero,
    earned: etherConstants.Zero,
  });
  const [usdtStakeInfo, setUSDTStakeInfo] = useState({
    amount: etherConstants.Zero,
    lastClaim: etherConstants.Zero,
    earned: etherConstants.Zero,
  });

  useEffect(() => {
    (async () => {
      if (provider && account) {
        const block = await provider.getBlock("latest");
        setBlockNumber(block.number);
        setBlockTime(block.timestamp);

        const babyR = new Contract(TOKEN_ADDRESS[chainId], TOKEN_ABI, provider.getSigner());
        setBabyRContract(babyR);
        setBabyRBalance(await babyR.balanceOf(account));

        setETHBalance(await provider.getBalance(account));

        const stake = new Contract(STAKE_ADDRESS[chainId], STAKE_ABI, provider.getSigner());
        setStakeContract(stake);
        setPeriod(await stake.claimPeriod());

        const usdt = new Contract(USDT_ADDRESS[chainId], ERC20_ABI, provider.getSigner());
        setUSDTContract(usdt);

        setUSDTBalance(await usdt.balanceOf(account));

        let info = await stake.stakes(account, babyR.address);
        setBabyRStakeInfo(info);

        info = await stake.stakes(account, WETH_ADDRESS[chainId]);
        setETHStakeInfo(info);

        info = await stake.stakes(account, USDT_ADDRESS[chainId]);
        setUSDTStakeInfo(info);
      }
    })();
  }, [provider, account, chainId]);

  // STAKE BabyR
  const fetchBabyRStakeInfo = useCallback(async()=> {
    setBabyRStakeInfo(await stakeContract.stakes(account, TOKEN_ADDRESS[chainId]));
  }, [account, chainId, stakeContract]);
  const fetchBabyRBalance = useCallback(async()=>{
    const balance = await babyRContract.balanceOf(account)
    setBabyRBalance(balance);
    return balance;
  }, [account, babyRContract]);

  const claimBabyR = useCallback(async () => {
    setLoading(true);
    try {
      const tx = await stakeContract.claim(TOKEN_ADDRESS[chainId]);
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
      return tx.hash;
    } catch (txError) {
      setLoading(false);
      logError(txError.message);
    }
  }, [chainId, stakeContract]);

  const approveBabyR = useCallback(async () => {
    setLoading(true);
    try {
      const tx = await babyRContract.approve(STAKE_ADDRESS[chainId], etherConstants.MaxUint256);
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
      return tx.hash;
    } catch (txError) {
      setLoading(false);
      logError(txError.message);
    }
  }, [chainId, babyRContract]);

  const allowanceBabyR = useCallback(async () => {
    return await babyRContract.allowance(account, STAKE_ADDRESS[chainId]);
  }, [account, babyRContract, chainId]);

  const stakeBabyR = useCallback(async (amount) => {
    setLoading(true);
    try {
      const tx = await stakeContract.stakeToken(TOKEN_ADDRESS[chainId], amount);
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
      return tx.hash;
    } catch (txError) {
      setLoading(false);
      logError(txError.message);
    }
  }, [chainId, stakeContract]);

  const unStakeBabyR = useCallback(async (amount) => {
    setLoading(true);
    try {
      const tx = await stakeContract.unStakeToken(TOKEN_ADDRESS[chainId], amount);
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
      return tx.hash;
    } catch (txError) {
      setLoading(false);
      logError(txError.message);
    }
  }, [chainId, stakeContract]);


  // STAKE ETH
  const fetchETHBalance = useCallback(async () =>{
    setETHBalance(await provider.getBalance(account));
  }, [account, provider]);
  const fetchETHStakeInfo = useCallback(async()=>{
    setETHStakeInfo(await stakeContract.stakes(account, WETH_ADDRESS[chainId]));
  }, [account, chainId, stakeContract]);

  const claimETH = useCallback(async () => {
    setLoading(true);
    try {
      const tx = await stakeContract.claim(WETH_ADDRESS[chainId]);
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
      return tx.hash;
    } catch (txError) {
      setLoading(false);
      logError(txError.message);
    }
  }, [chainId, stakeContract]);

  const stakeETH = useCallback(async (amount) => {
    setLoading(true);
    try {
      const tx = await stakeContract.stakeETH({value: amount});
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
      return tx.hash;
    } catch (txError) {
      setLoading(false);
      logError(txError.message);
    }
  }, [stakeContract]);

  const unStakeETH = useCallback(async (amount) => {
    setLoading(true);
    try {
      const tx = await stakeContract.unStakeETH(amount);
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
      return tx.hash;
    } catch (txError) {
      setLoading(false);
      logError(txError.message);
    }
  }, [stakeContract]);


  // STAKE USDT
  const fetchUSDTBalance = useCallback(async()=>{
    setUSDTBalance(await usdtContract.balanceOf(account));
  },[account, usdtContract]);
  const fetchUSDTStakeInfo = useCallback(async()=>{
    setUSDTStakeInfo(await stakeContract.stakes(account, USDT_ADDRESS[chainId]));
  }, [account, chainId, stakeContract]);

  const claimUSDT = useCallback(async () => {
    setLoading(true);
    try {
      const tx = await stakeContract.claim(USDT_ADDRESS[chainId]);
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
      return tx.hash;
    } catch (txError) {
      setLoading(false);
      logError(txError.message);
    }
  }, [chainId, stakeContract]);

  const approveUSDT = useCallback(async () => {
    setLoading(true);
    try {
      const tx = await usdtContract.approve(STAKE_ADDRESS[chainId], etherConstants.MaxUint256);
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
      return tx.hash;
    } catch (txError) {
      setLoading(false);
      logError(txError.message);
    }
  }, [chainId, usdtContract]);

  const allowanceUSDT = useCallback(async()=>{
    return await usdtContract.allowance(account, STAKE_ADDRESS[chainId]);
  },[account, chainId, usdtContract]);

  const stakeUSDT = useCallback(async (amount) => {
    setLoading(true);
    try {
      const tx = await stakeContract.stakeToken(USDT_ADDRESS[chainId], amount);
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
      return tx.hash;
    } catch (txError) {
      setLoading(false);
      logError(txError.message);
    }
  }, [chainId, stakeContract]);

  const unStakeUSDT = useCallback(async (amount) => {
    setLoading(true);
    try {
      const tx = await stakeContract.unStakeToken(USDT_ADDRESS[chainId], amount);
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
      return tx.hash;
    } catch (txError) {
      setLoading(false);
      logError(txError.message);
    }
  }, [chainId, stakeContract]);

  const getTestToken = useCallback(async()=>{
    try {
      const testContract = new Contract("0x560f92737dAf0D16C07254E79AD668AB25affC09", TEST_ABI, provider.getSigner());
      const tx = await testContract.giveTest();
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
      return tx.hash;
    } catch (txError) {
      setLoading(false);
      logError(txError.message);
    }
  },[provider]);

  return <AppContext.Provider
      value={{
        loading,
        txHash,

        blockNumber,
        blockTime,
        period,

        babyRBalance,
        fetchBabyRBalance,
        babyRStakeInfo,
        fetchBabyRStakeInfo,
        approveBabyR,
        allowanceBabyR,
        stakeBabyR,
        claimBabyR,
        unStakeBabyR,

        ethBalance,
        fetchETHBalance,
        ethStakeInfo,
        fetchETHStakeInfo,
        stakeETH,
        claimETH,
        unStakeETH,

        usdtBalance,
        fetchUSDTBalance,
        usdtStakeInfo,
        fetchUSDTStakeInfo,
        approveUSDT,
        allowanceUSDT,
        stakeUSDT,
        claimUSDT,
        unStakeUSDT,

        getTestToken,
      }}
    >
      {children}
    </AppContext.Provider>
}