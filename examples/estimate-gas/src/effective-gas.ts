import BigNumber from "bignumber.js";
import { fetchTransactionReceipt } from "./utils";

function calcL1Fee(result: any, expectL1Fee: string) {
  let l1Fee: BigNumber;
  if (result.l1BlobBaseFee) {
    l1Fee = new BigNumber(result.l1GasPrice)
      .times(result.l1GasUsed)
      .plus(
        new BigNumber(result.l1BlobBaseFee).times(result.l1BlobBaseFeeScalar)
      )
      .times(result.l1BaseFeeScalar)
      .div(10 ** 6)
      .integerValue(BigNumber.ROUND_DOWN);
  } else {
    l1Fee = new BigNumber(result.l1GasPrice)
      .times(result.l1GasUsed)
      .times(result.l1FeeScalar)
      .integerValue(BigNumber.ROUND_DOWN);
  }
  if (expectL1Fee) {
    const formatExpectL1Fee = new BigNumber(expectL1Fee);
    if (!formatExpectL1Fee.isEqualTo(l1Fee)) {
      throw new Error(
        `Invalid l1 fee: ${
          result.transactionHash
        }, expect: ${formatExpectL1Fee.toFixed()} but got ${l1Fee.toFixed()}`
      );
    }
  }
  if (l1Fee.isNaN()) {
    throw new Error(`Invalid l1 fee: ${result.transactionHash}`);
  }
  return l1Fee;
}

function printFee(txHash: string, data: any) {
  const l1Fee = new BigNumber(data.l1Fee);
  const l2Fee = new BigNumber(data.gasUsed).times(data.effectiveGasPrice);
  const totalFee = l1Fee.plus(l2Fee);
  const result = {
    tx_hash: txHash,
    l1_fee: l1Fee.toFixed(),
    l2_fee: l2Fee.toFixed(),
    total_fee: totalFee.toFixed(),
  };
  console.table(result);
}

async function main() {
  // https://pacific-explorer.manta.network/tx/0xe38d0f744a2e99b7384e40b868cd685e9f47267cc7082fe8389052e8576642aa
  // https://pacific-explorer.manta.network/tx/0x166059a12d3e85b0edda2aec8660de3411d6c80b289a779a7ec8d740a0af371b
  const txHashList = [
    "0xe38d0f744a2e99b7384e40b868cd685e9f47267cc7082fe8389052e8576642aa",
    "0x166059a12d3e85b0edda2aec8660de3411d6c80b289a779a7ec8d740a0af371b",
  ];
  for (let i = 0, len = txHashList.length; i < len; i += 1) {
    const txHash = txHashList[i];
    const { result: txResult } = await fetchTransactionReceipt(txHash);
    calcL1Fee(txResult, txResult.l1Fee);
    printFee(txHash, txResult);
  }
}

main();
