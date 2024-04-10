import { ethers, Signer } from "ethers";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function approveToken(
  tokenContractAddress: string,
  signer: Signer,
  amount: string
) {
  const abi = [
    "function approve(address _spender, uint256 _value) public returns (bool success)",
  ];
  const tokenContract = new ethers.Contract(tokenContractAddress, abi, signer);
  const result = await tokenContract.approve(tokenContractAddress, amount);
  return result?.hash;
}
