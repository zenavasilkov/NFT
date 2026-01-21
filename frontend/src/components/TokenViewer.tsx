import { type NFT } from '../types';
import DOMPurify from 'dompurify';

interface TokenViewerProps {
  nft: NFT;
  onFlipMood?: (tokenId: number) => void;
  isFlipping?: boolean;
}

export function TokenViewer({ nft, onFlipMood, isFlipping }: TokenViewerProps) {
  const renderImage = () => {
    if (!nft.metadata?.image) return null;

    if (nft.metadata.image.startsWith('data:image/svg+xml;base64,')) {
      const base64Data = nft.metadata.image.split(',')[1];
      let svgString = atob(base64Data);
      
      const svgMatch = svgString.match(/<svg([^>]*)>/);
      if (svgMatch) {
        const attributes = svgMatch[1];
        let modifiedSvgTag = svgMatch[0];
        
        if (!attributes.includes('width') && !attributes.includes('viewBox')) {
          modifiedSvgTag = modifiedSvgTag.replace('>', ' width="128" height="128">');
        } else if (!attributes.includes('width') && attributes.includes('viewBox')) {
          modifiedSvgTag = modifiedSvgTag.replace('>', ' width="128" height="128">');
        }
        
        if (!attributes.includes('style')) {
          modifiedSvgTag = modifiedSvgTag.replace('>', ' style="max-width: 100%; max-height: 100%; width: auto; height: auto;">');
        }
        
        svgString = svgString.replace(svgMatch[0], modifiedSvgTag);
      }
      
      return (
        <div
          className="border rounded flex items-center justify-center overflow-hidden"
          style={{ 
            width: '128px', 
            height: '128px',
            minWidth: '128px',
            minHeight: '128px',
            maxWidth: '128px',
            maxHeight: '128px'
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svgString, { USE_PROFILES: { svg: true } }) }}
          />
        </div>
      );
    }

    if (nft.metadata.image.startsWith('http')) {
      return (
        <img
          src={nft.metadata.image}
          alt={nft.metadata.name}
          className="w-32 h-32 object-cover border rounded"
        />
      );
    }

    if (nft.metadata.image.startsWith('ipfs://')) {
      const ipfsGateway = 'https://ipfs.io/ipfs/';
      const ipfsHash = nft.metadata.image.replace('ipfs://', '');
      return (
        <img
          src={`${ipfsGateway}${ipfsHash}`}
          alt={nft.metadata.name}
          className="w-32 h-32 object-cover border rounded"
        />
      );
    }

    return (
      <div className="w-32 h-32 border rounded flex items-center justify-center text-gray-500 text-xs p-2">
        Image not available
      </div>
    );
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {renderImage()}
          </div>

          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {nft.metadata?.name || `Token #${nft.tokenId}`}
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              Token ID: {nft.tokenId}
            </p>

            <p className="text-sm text-gray-600">
              Owner: {formatAddress(nft.owner)}
            </p>

            {onFlipMood && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    console.log('Flip Mood button clicked for token:', nft.tokenId);
                    onFlipMood(nft.tokenId);
                  }}
                  disabled={isFlipping}
                  className="btn btn-primary"
                  type="button"
                  style={{ minWidth: '120px' }}
                >
                  {isFlipping ? 'Flipping...' : 'Flip Mood'}
                </button>
              </div>
            )}

            {nft.metadata?.description && (
              <p className="text-sm text-gray-700 mt-2">
                {nft.metadata.description}
              </p>
            )}

            {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold mb-1">Attributes:</h4>
                <div className="flex flex-wrap gap-1">
                  {nft.metadata.attributes.map((attr, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {attr.trait_type}: {attr.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <details className="mt-3">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                Token URI
              </summary>
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono break-all">
                {nft.tokenURI}
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
