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

/**
 * Create an ethers Contract instance for the deployed BasicNft contract.
 *
 * @param provider - Provider used to interact with the blockchain for read operations
 * @param signer - Optional signer to enable transaction-sending methods; when omitted the contract is connected read-only via `provider`
 * @returns The `ethers.Contract` bound to the BasicNft address and ABI
 */
export function getBasicNftContract(provider: ethers.Provider, signer?: ethers.Signer) {
  const address = CONTRACT_ADDRESSES.basicNft;
  return new ethers.Contract(address, BasicNftABI, signer || provider);
}

/**
 * Create a Contract instance for the deployed MoodNft contract.
 *
 * @param signer - Optional signer used to send transactions; when omitted the contract is connected to the provider for read-only calls
 * @returns A Contract connected to the MoodNft address and ABI; writable if `signer` is provided, otherwise read-only via the provider
 */
export function getMoodNftContract(provider: ethers.Provider, signer?: ethers.Signer) {
  const address = CONTRACT_ADDRESSES.moodNft;
  return new ethers.Contract(address, MoodNftABI, signer || provider);
}

/**
 * Obtain the application's injected Ethereum provider from the browser wallet.
 *
 * @returns An ethers.BrowserProvider that wraps the injected `window.ethereum`
 * @throws Error if no injected Ethereum provider is present (e.g., MetaMask not installed)
 */
export async function getProvider(): Promise<ethers.BrowserProvider> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
}

/**
 * Retrieves the active account signer from the injected browser Ethereum provider.
 *
 * @returns The `ethers.Signer` associated with the currently selected wallet account.
 */
export async function getSigner(): Promise<ethers.Signer> {
  const provider = await getProvider();
  return provider.getSigner();
}

/**
 * Switches the user's wallet to the Local Anvil network (chainId 31337), adding the network to the wallet if it is not already configured.
 *
 * If no injected Ethereum provider is available (window.ethereum), the function does nothing.
 */
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

/**
 * Registers Ethereum wallet event listeners for account, chain, and disconnect events.
 *
 * @param onAccountsChanged - Callback invoked with the updated `accounts` array when the connected accounts change.
 * @param onChainChanged - Callback invoked with the new `chainId` string when the network chain changes.
 * @param onDisconnect - Callback invoked when the wallet disconnects.
 * @returns A function that removes the registered listeners when called, or `undefined` if no wallet provider (`window.ethereum`) was available.
 */
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

/**
 * Extracts the base64 portion of a data URI and decodes it to a string.
 *
 * @param dataUri - A data URI containing a base64 payload (e.g. "data:...;base64,<base64>").
 * @returns The decoded string from the base64 payload.
 */
export function decodeBase64DataUri(dataUri: string): string {
  const base64 = dataUri.split(',')[1];
  return atob(base64);
}

/**
 * Parses JSON metadata from a base64-encoded data URI.
 *
 * @param dataUri - A data URI whose payload is base64-encoded JSON (e.g., "data:application/json;base64,...").
 * @returns The parsed JavaScript value from the JSON payload, or `null` if parsing fails.
 */
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
