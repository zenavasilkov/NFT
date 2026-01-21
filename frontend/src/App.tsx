import { WalletConnect } from './components/WalletConnect';
import { BasicNftPanel } from './components/BasicNftPanel';
import { MoodNftPanel } from './components/MoodNftPanel';
import { useWallet } from './hooks/useWallet';

function App() {
  const { address, isConnected } = useWallet();

  return (
    <div className="min-h-screen">
      <header className="card border-b rounded-none shadow">
        <div className="container">
          <div className="flex justify-between items-center py-4">
      <div>
              <h1 className="text-2xl font-bold">NFT DApp</h1>
              <p className="text-sm text-gray-600">Interact with Basic and Mood NFTs</p>
            </div>
            <WalletConnect />
          </div>
      </div>
      </header>

      <main className="container py-8">
        {!isConnected ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-8">
                Connect your MetaMask wallet to interact with the NFT smart contracts.
                Make sure you're connected to the local Anvil network.
              </p>
              <div className="alert alert-info">
                <h3 className="font-semibold mb-2">Local Development Setup</h3>
                <p className="text-sm">
                  This app is configured to work with local Anvil network (Chain ID: 31337).
                  Make sure your local blockchain is running.
        </p>
      </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <BasicNftPanel userAddress={address!} />

            <MoodNftPanel userAddress={address!} />
          </div>
        )}
      </main>

      <footer className="card border-t rounded-none shadow mt-16">
        <div className="container py-6">
          <div className="text-center text-sm text-gray-500">
            <p>NFT DApp built with React, TypeScript, and ethers.js</p>
            <p className="mt-1">Smart contracts deployed on local Anvil network</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
