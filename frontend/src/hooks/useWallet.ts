import { useState, useEffect, useCallback } from 'react';
import { type WalletState } from '../types';
import {
  getProvider,
  getSigner,
  switchToLocalNetwork,
  setupWalletListeners
} from '../utils/ethers';

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
  });

  const connectWallet = useCallback(async (forcePopup = false) => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this application');
      return;
    }

    if (!forcePopup) {
      try {
        const provider = await getProvider();
        const accounts = await provider.listAccounts();

        if (accounts.length > 0 && walletState.isConnected && walletState.address) {
          const network = await provider.getNetwork();
          const chainId = Number(network.chainId);
          const address = await accounts[0].getAddress();

          setWalletState({
            address,
            chainId,
            isConnected: true,
            isConnecting: false,
          });
          return;
        }
      } catch (error) {
      }
    }

    setWalletState(prev => ({ ...prev, isConnecting: true }));

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = await getProvider();
      const signer = await getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      setWalletState({
        address,
        chainId,
        isConnected: true,
        isConnecting: false,
      });

      if (chainId !== 31337) {
        await switchToLocalNetwork();
      }

    } catch (error) { 
      setWalletState(prev => ({ ...prev, isConnecting: false }));
    }
  }, [walletState.isConnected, walletState.address]);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
    });
  }, []);

  const reconnectWallet = useCallback(async () => {
    disconnectWallet();

    setTimeout(() => {
      connectWallet(true);
    }, 100);
  }, [disconnectWallet, connectWallet]);

  const switchNetwork = useCallback(async () => {
    await switchToLocalNetwork();
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = await getProvider();
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            const network = await provider.getNetwork();
            const chainId = Number(network.chainId);
            const address = await accounts[0].getAddress();

            setWalletState({
              address,
              chainId,
              isConnected: true,
              isConnecting: false,
            });
          }
        } catch (error) {
          console.error('Failed to check connection:', error);
        }
      }
    };

    checkConnection();

    const cleanup = setupWalletListeners(
      async (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          try {
            let address: string;
            if (typeof accounts[0] === 'string') {
              address = accounts[0];
            } else {
              address = await accounts[0].getAddress();
            }

            const provider = await getProvider();
            const network = await provider.getNetwork();
            const chainId = Number(network.chainId);

            setWalletState({
              address,
              chainId,
              isConnected: true,
              isConnecting: false,
            });

          } catch (error) {
            console.error('Failed to update account:', error);
          }
        }
      },
      async (chainId) => {
        try {
          const newChainId = parseInt(chainId, 16);
          
          const provider = await getProvider();
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const address = await accounts[0].getAddress();
            setWalletState(prev => ({
              ...prev,
              address,
              chainId: newChainId,
            }));
          } else {
            setWalletState(prev => ({
              ...prev,
              chainId: newChainId,
            }));
          }
        } catch (error) {
          console.error('Failed to update chain:', error);
        }
      },
      () => {
        disconnectWallet();
      }
    );

    return cleanup;
  }, [disconnectWallet]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    reconnectWallet,
    switchNetwork,
  };
}
