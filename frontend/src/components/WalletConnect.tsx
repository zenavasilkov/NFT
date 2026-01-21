import { useWallet } from '../hooks/useWallet';

export function WalletConnect() {
  const {
    address,
    chainId,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    reconnectWallet,
    switchNetwork,
  } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 31337:
        return 'Local Anvil';
      case 1:
        return 'Ethereum Mainnet';
      case 11155111:
        return 'Sepolia';
      default:
        return `Chain ${chainId}`;
    }
  };

  if (!window.ethereum) {
    return (
      <div className="alert alert-warning">
        <p>Please install MetaMask to use this application.</p>
        <a
          href="https://metamask.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  if (isConnected && address && chainId) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          <div className="font-semibold">
            {formatAddress(address)}
          </div>
          <div className="text-gray-500">
            {getNetworkName(chainId)}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            {chainId !== 31337 && (
              <button
                onClick={switchNetwork}
                className="btn btn-outline"
              >
                Switch to Local
              </button>
            )}

            <button
              onClick={reconnectWallet}
              disabled={isConnecting}
              className="btn btn-primary"
              title="Reconnect wallet (shows MetaMask popup)"
            >
              {isConnecting ? 'Connecting...' : 'Reconnect'}
            </button>

            <button
              onClick={disconnectWallet}
              className="btn btn-danger"
              title="Disconnect from app (MetaMask stays connected)"
            >
              Disconnect App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => connectWallet(true)}
      disabled={isConnecting}
      className="btn btn-primary"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
