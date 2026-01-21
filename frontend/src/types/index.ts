export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface NFT {
  tokenId: number;
  tokenURI: string;
  metadata?: TokenMetadata;
  owner: string;
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
}

export interface ContractAddresses {
  basicNft: string;
  moodNft: string;
}
