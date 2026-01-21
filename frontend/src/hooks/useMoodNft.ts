import { useState, useCallback, useEffect } from 'react';
import { type NFT, type TokenMetadata } from '../types';
import { getMoodNftContract, getProvider, parseMetadataFromBase64 } from '../utils/ethers';

export function useMoodNft(userAddress?: string) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserNFTs = useCallback(async () => {
    if (!userAddress) {
      console.log('🔍 loadUserNFTs (MoodNft): No user address provided');
      return;
    }

    console.log('🔍 loadUserNFTs (MoodNft): Starting to load NFTs for address:', userAddress);
    setIsLoading(true);
    setError(null);

    try {
      const provider = await getProvider();
      const contract = getMoodNftContract(provider);
      const contractAddress = contract.target;
      console.log('📄 Using MoodNft contract at:', contractAddress);
      
      const userNFTs: NFT[] = [];

      const maxTokenIdToCheck = 100;
      console.log(`🔍 Checking tokens 0 to ${maxTokenIdToCheck - 1}...`);
      let foundCount = 0;

      for (let tokenId = 0; tokenId < maxTokenIdToCheck; tokenId++) {
        try {
          const owner = await contract.ownerOf(tokenId);
          const ownerLower = owner.toLowerCase();
          const userLower = userAddress.toLowerCase();
          
          console.log(`🔍 Token #${tokenId}: owner=${owner}, checking against ${userAddress}`);
          
          if (ownerLower === userLower) {
            console.log(`✅ Found Mood NFT #${tokenId} owned by ${userAddress}`);
            const tokenURI = await contract.tokenURI(tokenId);
            let metadata: TokenMetadata | undefined;

            if (tokenURI.startsWith('data:application/json;base64,')) {
              metadata = parseMetadataFromBase64(tokenURI);
            }

            userNFTs.push({
              tokenId,
              tokenURI,
              metadata,
              owner,
            });
            foundCount++;
          } else {
            console.log(`⚠️ Token #${tokenId} owned by ${owner}, not by ${userAddress}`);
          }
        } catch (err: any) {
          if (tokenId < 10) {
            console.log(`ℹ️ Token #${tokenId} doesn't exist yet (${err.message || 'no owner'})`);
          }
          continue;
        }
      }

      console.log(`✅ loadUserNFTs (MoodNft) complete: Found ${foundCount} NFTs for ${userAddress}`);
      console.log('📦 Mood NFTs:', userNFTs.map(nft => `#${nft.tokenId}`).join(', ') || 'none');
      setNfts(userNFTs);
    } catch (err: any) {
      console.error('❌ loadUserNFTs (MoodNft) error:', err);
      setError(err.message || 'Failed to load NFTs');
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  const mintNft = useCallback(async () => {
    if (!userAddress) {
      console.log('❌ mintNft (MoodNft): No user address provided');
      return;
    }

    console.log('🎨 mintNft (MoodNft): Starting mint for address:', userAddress);
    setIsLoading(true);
    setError(null);

    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = getMoodNftContract(provider, signer);
      const contractAddress = contract.target;
      console.log('📄 Using MoodNft contract at:', contractAddress);

      try {
        const code = await provider.getCode(contractAddress as string);
        if (code === '0x' || code.length <= 2) {
          const errorMsg = `❌ ERROR: No contract code found at address ${contractAddress}! Please verify the contract is deployed.`;
          console.error(errorMsg);
          setError(errorMsg);
          return;
        }
        console.log('✅ Contract code verified, contract is deployed');
      } catch (err) {
        console.error('❌ Failed to verify contract code:', err);
      }

      console.log('📤 Sending mint transaction...');
      const tx = await contract.mintNft();
      console.log('⏳ Transaction sent, hash:', tx.hash);
      console.log('⏳ Waiting for confirmation...');
      
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed! Block:', receipt.blockNumber);
      console.log('📋 Receipt:', receipt);
      console.log('📋 Receipt logs:', receipt.logs);
      console.log('📋 Receipt logs length:', receipt.logs?.length || 0);
      
      if (receipt.logs && receipt.logs.length === 0) {
        console.warn('⚠️ WARNING: Transaction succeeded but no logs found! This might mean:');
        console.warn('   - Contract address might be wrong');
        console.warn('   - Contract might not be an ERC721 contract');
        console.warn('   - Transaction might not have actually minted an NFT');
      }
      
      try {
        const code = await provider.getCode(contractAddress as string);
        console.log('📦 Contract code exists:', code !== '0x' && code.length > 2);
        if (code === '0x' || code.length <= 2) {
          console.error('❌ ERROR: Contract has no code at this address! Contract might not be deployed.');
        }
      } catch (err) {
        console.error('❌ Failed to check contract code:', err);
      }

      console.log('🔄 Refreshing Mood NFT list...');
      await loadUserNFTs();
    } catch (err: any) {
      console.error('❌ mintNft (MoodNft) error:', err);
      setError(err.message || 'Failed to mint NFT');
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, loadUserNFTs]);

  const flipMood = useCallback(async (tokenId: number) => {
    if (!userAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = getMoodNftContract(provider, signer);

      console.log(`🔄 flipMood: Flipping mood for token #${tokenId}`);
      const tx = await contract.flipMood(tokenId);
      console.log(`⏳ Transaction sent, hash: ${tx.hash}`);
      await tx.wait();
      console.log(`✅ Mood flipped for token #${tokenId}`);

      loadUserNFTs().catch(err => {
        console.error('Failed to refresh NFTs after flip:', err);
      });
    } catch (err: any) {
      console.error('❌ flipMood error:', err);
      setError(err.message || 'Failed to flip mood');
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, loadUserNFTs]);

  useEffect(() => {
    if (userAddress) {
      loadUserNFTs();
    }
  }, [userAddress, loadUserNFTs]);

  return {
    nfts,
    isLoading,
    error,
    mintNft,
    flipMood,
    loadUserNFTs,
  };
}
