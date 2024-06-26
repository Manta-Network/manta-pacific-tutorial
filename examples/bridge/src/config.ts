export default {
  mainnet: {
    l1Rpc:
      "https://eth-mainnet.g.alchemy.com/v2/XwmYp1OeVZuMiuy1YMjzgX3K4ru8_g__",
    l2Rpc: "https://pacific-rpc.manta.network/http",
    l1ChainId: 1,
    l2ChainId: 169,
    bedrock: true,
    contracts: {
      l1: {
        AddressManager: "0x3Ad319BB4872F8cB75a26Ac30CC4bD2d56b67b05",
        L1CrossDomainMessenger: "0x635ba609680c55C3bDd0B3627b4c5dB21b13c310",
        L1StandardBridge: "0x3B95bC951EE0f553ba487327278cAc44f29715E5",
        OptimismPortal: "0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622",
        L2OutputOracle: "0x30c789674ad3B458886BBC9abf42EEe19EA05C1D",
        StateCommitmentChain: "0x0000000000000000000000000000000000000000",
        CanonicalTransactionChain: "0x0000000000000000000000000000000000000000",
        BondManager: "0x0000000000000000000000000000000000000000",
      },
    },
  },
  sepoliaTestnet: {
    l1Rpc:
      "https://eth-sepolia.g.alchemy.com/v2/BQ43RWiHw-hqyM4NVLrzcYSm-ybT5tYN",
    l2Rpc: "https://pacific-rpc.sepolia-testnet.manta.network/http",
    l1ChainId: 11155111,
    l2ChainId: 3441006,
    bedrock: true,
    contracts: {
      l1: {
        AddressManager: "0x0691B7aaAc9B903c9a99B2371bCFB43601B45711",
        L1CrossDomainMessenger: "0xFe7cF31c4579bb1C578716e04E1Ae16Ac5549fF0",
        L1StandardBridge: "0xCAD25C95679839996F3162d8657B1CAe4517F78f",
        OptimismPortal: "0x80f86c5d3AE8cF84596FF22DB2829F1b7a9Fe83d",
        L2OutputOracle: "0x2dd44d1b04170C5623cCc55DD5ed43FAB08b0B46",
        StateCommitmentChain: "0x0000000000000000000000000000000000000000",
        CanonicalTransactionChain: "0x0000000000000000000000000000000000000000",
        BondManager: "0x0000000000000000000000000000000000000000",
      },
    },
  },
};
