import { ethers } from "ethers";
import { asL2Provider } from "@constellation-labs/bedrock-sdk";
import BigNumber from "bignumber.js";

async function main() {
  const l2RpcProvider = asL2Provider(
    new ethers.providers.JsonRpcProvider("https://manta-pacific.drpc.org")
  );

  // https://pacific-explorer.manta.network/tx/0xe38d0f744a2e99b7384e40b868cd685e9f47267cc7082fe8389052e8576642aa
  const result = await l2RpcProvider.getTransactionReceipt(
    "0xe38d0f744a2e99b7384e40b868cd685e9f47267cc7082fe8389052e8576642aa"
  );
  // @ts-ignore
  const l1Fee = new BigNumber(result.l1Fee.toString());
  // or
  // const l1Fee = new BigNumber(result.l1GasUsed.toString()).times(result.l1GasPrice.toString()).times(result.l1FeeScalar.toString());

  const l2Fee = new BigNumber(result.gasUsed.toString()).times(
    result.effectiveGasPrice.toString()
  );

  const totalFee = l1Fee.plus(l2Fee);

  console.log(`Total Fee: ${totalFee.toFixed(0)} wei`);
  console.log(`L1 Fee: ${l1Fee.toFixed(0)} wei`);
  console.log(`L2 Fee: ${l2Fee.toFixed(0)} wei`);
}

main();
