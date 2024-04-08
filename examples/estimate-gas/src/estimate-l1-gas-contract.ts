import { Contract, ethers } from "ethers";
import { asL2Provider } from "@constellation-labs/bedrock-sdk";

async function main() {
  const l2RpcProvider = asL2Provider(
    new ethers.providers.JsonRpcProvider("https://manta-pacific.drpc.org")
  );

  const contractAddress = "0x420000000000000000000000000000000000000F";
  const abi = [
    {
      inputs: [{ internalType: "bytes", name: "_data", type: "bytes" }],
      name: "getL1Fee",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ];

  const contract = new Contract(contractAddress, abi, l2RpcProvider);

  const tx = {
    type: 2,
    from: "0xc9070fB1ef16f704dfb60d205aD33B27B2CdAC0A",
    to: "0xc9070fB1ef16f704dfb60d205aD33B27B2CdAC0A",
    value: ethers.utils.parseUnits("0.000001", "ether"),
  };

  const transactionData = ethers.utils.serializeTransaction(tx);
  const l1Fee = await contract.getL1Fee(transactionData);

  console.log(`Estimate L1 Fee: ${l1Fee.toString()} wei`);
}

main();
