import { useState } from 'react';
import { useMoodNft } from '../hooks/useMoodNft';
import { TokenViewer } from './TokenViewer';

interface MoodNftPanelProps {
  userAddress: string;
}

/**
 * Render a panel that lets a user mint new Mood NFTs and view or flip the mood of owned NFTs.
 *
 * @param userAddress - The user's wallet address whose Mood NFTs are displayed
 * @returns The Mood NFT panel element containing mint controls, the user's NFT list, and an informational footer
 */
export function MoodNftPanel({ userAddress }: MoodNftPanelProps) {
  const { nfts, isLoading, error, mintNft, flipMood } = useMoodNft(userAddress);
  const [isMinting, setIsMinting] = useState(false);
  const [flippingTokenId, setFlippingTokenId] = useState<number | null>(null);

  const handleMint = async () => {
    setIsMinting(true);
    try {
      await mintNft();
    } catch (error) {
      console.error('Mint failed:', error);
    } finally {
      setIsMinting(false);
    }
  };

  const handleFlipMood = async (tokenId: number) => {
    setFlippingTokenId(tokenId);
    try {
      await flipMood(tokenId);
    } catch (error) {
      console.error('Flip mood failed:', error);
    } finally {
      setFlippingTokenId(null);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="text-2xl font-bold mb-6">Mood NFT</h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Mint New Mood NFT</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleMint}
              disabled={isMinting}
              className="btn btn-secondary"
            >
              {isMinting ? 'Minting...' : 'Mint Mood NFT'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Mint an NFT that reflects your mood! Each Mood NFT starts happy and can be flipped between happy and sad.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Your Mood NFTs</h3>

          {error && (
            <div className="alert alert-error mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="spinner"></div>
              <p className="mt-2 text-gray-600">Loading your NFTs...</p>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>You don't own any Mood NFTs yet.</p>
              <p className="text-sm mt-1">Mint your first mood-changing NFT above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {nfts.map((nft) => (
                <TokenViewer
                  key={nft.tokenId}
                  nft={nft}
                  onFlipMood={handleFlipMood}
                  isFlipping={flippingTokenId === nft.tokenId}
                />
              ))}
            </div>
          )}
        </div>

        <div className="card-footer mt-8">
          <h4 className="font-semibold mb-2">About Mood NFTs</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Each Mood NFT contains an on-chain SVG image that changes based on mood</li>
            <li>• Mood NFTs start in a "Happy" state when minted</li>
            <li>• You can flip the mood between "Happy" and "Sad" at any time</li>
            <li>• The SVG image and metadata are stored entirely on-chain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
