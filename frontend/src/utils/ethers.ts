import { ethers } from 'ethers';
import { BasicNftABI } from '../contracts/BasicNft';
import { MoodNftABI } from '../contracts/MoodNft';

export const CONTRACT_ADDRESSES = {
  basicNft: import.meta.env.VITE_BASIC_NFT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  moodNft: import.meta.env.VITE_MOOD_NFT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
};

console.log('📋 Contract Addresses:', {
  basicNft: CONTRACT_ADDRESSES.basicNft,
  moodNft: CONTRACT_ADDRESSES.moodNft,
  fromEnv: {
    basicNft: !!import.meta.env.VITE_BASIC_NFT_ADDRESS,
    moodNft: !!import.meta.env.VITE_MOOD_NFT_ADDRESS,
  },
});

export const NETWORKS = {
  local: {
    name: 'Local Anvil',
    chainId: 31337,
    rpcUrl: import.meta.env.VITE_RPC_URL || 'http://127.0.0.1:8545',
  },
  sepolia: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL,
  },
};

export function getBasicNftContract(provider: ethers.Provider, signer?: ethers.Signer) {
  const address = CONTRACT_ADDRESSES.basicNft;
  return new ethers.Contract(address, BasicNftABI, signer || provider);
}

export function getMoodNftContract(provider: ethers.Provider, signer?: ethers.Signer) {
  const address = CONTRACT_ADDRESSES.moodNft;
  return new ethers.Contract(address, MoodNftABI, signer || provider);
}

export async function getProvider(): Promise<ethers.BrowserProvider> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner(): Promise<ethers.Signer> {
  const provider = await getProvider();
  return provider.getSigner();
}

export async function switchToLocalNetwork(): Promise<void> {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x7A69' }], // 31337 in hex (Anvil default)
    });
  } catch (error: any) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x7A69',
          chainName: 'Local Anvil',
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['http://127.0.0.1:8545'],
          blockExplorerUrls: [],
        }],
      });
    }
  }
}

export function setupWalletListeners(
  onAccountsChanged: (accounts: any[]) => void,
  onChainChanged: (chainId: string) => void,
  onDisconnect: () => void
) {
  if (!window.ethereum) return;

  window.ethereum.on('accountsChanged', onAccountsChanged);
  window.ethereum.on('chainChanged', onChainChanged);
  window.ethereum.on('disconnect', onDisconnect);

  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', onAccountsChanged);
      window.ethereum.removeListener('chainChanged', onChainChanged);
      window.ethereum.removeListener('disconnect', onDisconnect);
    }
  };
}

export function decodeBase64DataUri(dataUri: string): string {
  const base64 = dataUri.split(',')[1];
  return atob(base64);
}

export function parseMetadataFromBase64(dataUri: string) {
  try {
    const jsonString = decodeBase64DataUri(dataUri);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse metadata:', error);
    return null;
  }
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
