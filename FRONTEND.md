# NFT DApp Frontend

A React + TypeScript frontend for interacting with BasicNft and MoodNft smart contracts.

## Features

- **Wallet Connection**: Connect MetaMask wallet and switch to local network
- **BasicNft**: Mint NFTs with custom token URIs, view owned NFTs
- **MoodNft**: Mint mood-changing NFTs, flip between happy/sad states
- **Token Viewer**: Display NFT metadata, images, and attributes
- **Responsive Design**: Built with custom CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Local blockchain running (Anvil/Fork)

### Installation

```bash
# From the root directory
make frontend-install

# Or manually
cd frontend
npm install
```

### Development

```bash
# From the root directory
make frontend-dev

# Or manually
cd frontend
npm run dev
```

The development server will start on `http://localhost:5173`

### Build for Production

```bash
# From the root directory
make frontend-build

# Or manually
cd frontend
npm run build
```

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve the MetaMask connection
2. **Switch Network**: If not on local network, click "Switch to Local" to connect to Anvil
3. **Mint NFTs**:
   - **BasicNft**: Enter a token URI and click "Mint NFT"
   - **MoodNft**: Click "Mint Mood NFT" (no URI needed, generates on-chain)
4. **Flip Mood**: For Mood NFTs, click "Flip Mood" to toggle between happy/sad states

## Contract Addresses

### Default Local Addresses
The app comes pre-configured with local Anvil addresses:
- **BasicNft**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **MoodNft**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

### Environment Variables
For flexibility, the app uses environment variables. Create a `.env` file:

```env
VITE_BASIC_NFT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_MOOD_NFT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

See [`ENVIRONMENT.md`](ENVIRONMENT.md) for detailed setup instructions.

## Architecture

### Components

- `WalletConnect`: Handles wallet connection and network switching
- `BasicNftPanel`: Mint and display Basic NFTs
- `MoodNftPanel`: Mint and display Mood NFTs with mood flipping
- `TokenViewer`: Display individual NFT metadata and images

### Hooks

- `useWallet`: Manages wallet connection state
- `useBasicNft`: Handles BasicNft contract interactions
- `useMoodNft`: Handles MoodNft contract interactions

### Utils

- `ethers.ts`: Contract instances, provider setup, network utilities
- Contract ABIs in `contracts/` directory

## Technologies Used

- **React**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Custom CSS**: Styling with CSS variables
- **ethers.js**: Blockchain interaction
- **MetaMask**: Wallet integration
