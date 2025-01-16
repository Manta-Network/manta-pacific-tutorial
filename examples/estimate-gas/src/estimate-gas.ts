import { ethers } from "ethers";
import { asL2Provider } from "@constellation-labs/bedrock-sdk";
import { defaultMantaPacificMainnetRpc } from "./utils";

async function main() {
  const l2RpcProvider = asL2Provider(
    new ethers.providers.JsonRpcProvider(defaultMantaPacificMainnetRpc)
  );

  const tx = {
    type: 2,
    from: "0xc9070fB1ef16f704dfb60d205aD33B27B2CdAC0A",
    to: "0xc9070fB1ef16f704dfb60d205aD33B27B2CdAC0A",
    value: ethers.utils.parseUnits("0.000001", "ether"),
  };

  const totalGasCost = await l2RpcProvider.estimateTotalGasCost(tx);
  const l1GasCost = await l2RpcProvider.estimateL1GasCost(tx);
  const l2GasCost = await l2RpcProvider.estimateL2GasCost(tx);

  console.log(`Total Gas Cost: ${totalGasCost.toString()} wei`);
  console.log(`L1 Gas Cost: ${l1GasCost.toString()} wei`);
  console.log(`L2 Gas Cost: ${l2GasCost.toString()} wei`);
}

main();
