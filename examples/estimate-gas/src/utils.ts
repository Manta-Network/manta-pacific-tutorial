export const defaultMantaPacificMainnetRpc = "https://pacific-rpc.manta.network/http";

export const fetchTransactionReceipt = async (
  txHash: string,
  rpcUrl = defaultMantaPacificMainnetRpc
) => {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      method: "eth_getTransactionReceipt",
      params: [txHash],
      id: 1,
      jsonrpc: "2.0",
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result;
};
