import { useState } from 'react';
import { useBasicNft } from '../hooks/useBasicNft';
import { TokenViewer } from './TokenViewer';

interface BasicNftPanelProps {
  userAddress: string;
}

/**
 * Renders a card-style panel that lets a specified user view their Basic NFTs and mint a new one.
 *
 * The panel includes a token URI input and mint button, displays loading and error states, shows an empty-state message when the user has no NFTs, and renders a responsive grid of owned NFTs.
 *
 * @param userAddress - The wallet address whose Basic NFTs are displayed and to which newly minted NFTs will be attributed
 * @returns The component's JSX element: a card containing mint controls and the user's Basic NFT list or status views
 */
export function BasicNftPanel({ userAddress }: BasicNftPanelProps) {
  const { nfts, isLoading, error, mintNft } = useBasicNft(userAddress);
  const [tokenUri, setTokenUri] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    const trimmedUri = tokenUri.trim();
    if (!trimmedUri) {
      alert('Please enter a token URI');
      return;
    }

    setIsMinting(true);
    try {
      await mintNft(trimmedUri);
      setTokenUri('');
    } catch (error) {
      console.error('Mint failed:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="text-2xl font-bold mb-6">Basic NFT</h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Mint New NFT</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              value={tokenUri}
              onChange={(e) => setTokenUri(e.target.value)}
              placeholder="Enter token URI (e.g., ipfs://... or http://...)"
              className="form-input flex-grow"
              disabled={isMinting}
            />
            <button
              onClick={handleMint}
              disabled={isMinting || !tokenUri.trim()}
              className="btn btn-secondary"
            >
              {isMinting ? 'Minting...' : 'Mint NFT'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Enter a URI pointing to your NFT metadata (JSON file with name, description, image, etc.)
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Your Basic NFTs</h3>

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
              <p>You don't own any Basic NFTs yet.</p>
              <p className="text-sm mt-1">Mint your first NFT above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {nfts.map((nft) => (
                <TokenViewer key={nft.tokenId} nft={nft} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}