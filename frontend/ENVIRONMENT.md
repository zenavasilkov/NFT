# Environment Configuration Guide

## Contract Addresses Setup

The NFT DApp now uses environment variables for contract addresses instead of hardcoded values. This makes it flexible for different deployments (local, testnet, mainnet).

### How to Set Up Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the contract addresses in `.env`:**
   ```env
   # Local development (default)
   VITE_BASIC_NFT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
   VITE_MOOD_NFT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

   # Testnet (when deployed)
   # VITE_BASIC_NFT_ADDRESS=0x1234567890123456789012345678901234567890
   # VITE_MOOD_NFT_ADDRESS=0x0987654321098765432109876543210987654321
   ```

### Where Contract Addresses Come From

#### Local Development (Anvil)
The default addresses are **deterministic** - they're always the same when deploying with Foundry's default accounts:

```bash
# Deploy contracts
make deploy      # Deploys BasicNft
make deployMood  # Deploys MoodNft

# Check deployment output for addresses
# Or look in broadcast/ directory
```

#### Testnet/Mainnet Deployment
When you deploy to testnets or mainnet, you'll get different addresses:

```bash
# Deploy to Sepolia (requires SEPOLIA_RPC_URL and PRIVATE_KEY)
make deploy

# Copy the deployed address from console output
# Update your .env file with the real address
```

### Environment Variable Priority

The app uses this priority:
1. **Environment variables** (from `.env` file)
2. **Fallback defaults** (local development addresses)

```typescript
// In ethers.ts
export const CONTRACT_ADDRESSES = {
  basicNft: import.meta.env.VITE_BASIC_NFT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  moodNft: import.meta.env.VITE_MOOD_NFT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
};
```

### Why Environment Variables?

- **Flexibility**: Different addresses for dev/test/prod
- **CI/CD**: Easy to configure for different environments
- **Team collaboration**: Each developer can use their own addresses

### Network Configuration

You can also configure RPC URLs:

```env
# Custom RPC endpoints
VITE_RPC_URL=http://127.0.0.1:8545
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

The app will automatically detect the network and use the appropriate addresses!
