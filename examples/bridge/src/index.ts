import "dotenv/config";
import { ethers } from "ethers";
import {
  CrossChainMessenger,
  ETHBridgeAdapter,
  MessageStatus,
  StandardBridgeAdapter,
} from "@constellation-labs/bedrock-sdk";
import { predeploys } from "@constellation-labs/contracts";
import config from "./config";
import { approveToken, sleep } from "./utils";
import BigNumber from "bignumber.js";

// const networkConfig = config.mainnet;
const networkConfig = config.sepoliaTestnet;

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("Invalid env PRIVATE_KEY");
}

const l1Wallet = new ethers.Wallet(
  privateKey,
  new ethers.providers.JsonRpcProvider(networkConfig.l1Rpc)
);
const l2Wallet = new ethers.Wallet(
  privateKey,
  new ethers.providers.JsonRpcProvider(networkConfig.l2Rpc)
);

const messenger = new CrossChainMessenger({
  l1SignerOrProvider: l1Wallet,
  l2SignerOrProvider: l2Wallet,
  bridges: {
    Standard: {
      Adapter: StandardBridgeAdapter,
      l1Bridge: networkConfig.contracts.l1.L1StandardBridge,
      l2Bridge: predeploys.L2StandardBridge,
    },
    ETH: {
      Adapter: ETHBridgeAdapter,
      l1Bridge: networkConfig.contracts.l1.L1StandardBridge,
      l2Bridge: predeploys.L2StandardBridge,
    },
  },
  depositConfirmationBlocks: 0,
  ...networkConfig,
});

const erc20Token = {
  l1Address: "",
  l2Address: "",
  decimals: 18,
};

export async function depositETH() {
  const tx = await messenger.depositETH(ethers.utils.parseEther("0.001"));
  console.log(`depositETH txHash: ${tx?.hash}`);
  await tx.wait();
  await sleep(1000 * 120);
  await messenger.waitForMessageStatus(tx, MessageStatus.RELAYED);
  console.log("Deposit ETH complete");
}

export async function depositERC20() {
  const amount = new BigNumber("0.1")
    .times(10 ** erc20Token.decimals)
    .toFixed(0);
  await approveToken(erc20Token.l1Address, l1Wallet, amount);
  const tx = await messenger.depositERC20(
    erc20Token.l1Address,
    erc20Token.l2Address,
    amount
  );
  console.log(`depositERC20 txHash: ${tx?.hash}`);
  await tx.wait();
  await sleep(1000 * 120);
  await messenger.waitForMessageStatus(tx, MessageStatus.RELAYED);
  console.log("Deposit ERC20 token complete");
}

export async function withdrawETH() {
  const tx = await messenger.withdrawETH(ethers.utils.parseEther("0.0001"));
  console.log(`withdrawETH txHash: ${tx?.hash}`);
  await tx.wait();
  await sleep(1000 * 120);
  await messenger.waitForMessageStatus(tx, MessageStatus.READY_TO_PROVE);
  console.log("Withdraw ETH initialized");
  return tx.hash;
}

export async function withdrawERC20() {
  const amount = new BigNumber("0.1")
    .times(10 ** erc20Token.decimals)
    .toFixed(0);
  const tx = await messenger.withdrawERC20(
    erc20Token.l1Address,
    erc20Token.l2Address,
    amount
  );
  console.log(`withdrawERC20 txHash: ${tx?.hash}`);
  await tx.wait();
  await sleep(1000 * 120);
  await messenger.waitForMessageStatus(tx, MessageStatus.READY_TO_PROVE);
  console.log("Deposit ERC20 token initialized");
  return tx.hash;
}

export async function proveWithdrawMessage(txHash: string) {
  const messageStatus = await messenger.getMessageStatus(txHash);
  if (messageStatus !== MessageStatus.READY_TO_PROVE) {
    throw "Message not ready to prove";
  }
  const response = await messenger.proveMessage(txHash, {
    signer: l1Wallet,
  });
  await response?.wait();
  console.log("Prove withdraw message complete");
}

export async function finalizeWithdrawMessage(txHash: string) {
  const messageStatus = await messenger.getMessageStatus(txHash);
  if (messageStatus !== MessageStatus.READY_FOR_RELAY) {
    throw "Message not ready for relay";
  }
  const response = await messenger.finalizeMessage(txHash, {
    signer: l1Wallet,
  });
  await response?.wait();
  console.log("Finalize withdraw message complete");
}

async function main() {
  // await depositETH();

  // await depositERC20();

  // const withdrawTxhash = await withdrawETH();

  // await proveWithdrawMessage(withdrawTxhash);

  // await finalizeWithdrawMessage(withdrawTxhash);
}

main().catch((ex) => {
  console.error(ex);
  process.exit(1);
});
