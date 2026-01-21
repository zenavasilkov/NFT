# Deployment Guide - Deploy Your NFT Contracts

This guide will help you deploy the BasicNft and MoodNft contracts to your local Anvil network.

## Prerequisites

1. **Anvil must be running** on `http://localhost:8545`
2. **Foundry/Forge** must be installed
3. **Contracts must be compiled** (`forge build`)

## Step-by-Step Deployment

### 1. Start Anvil (if not already running)

Open a terminal and run:

```bash
make anvil
```

Or manually:
```bash
anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1
```

**Keep this terminal open!** Anvil needs to be running.

### 2. Deploy BasicNft Contract

Open a **new terminal** (keep Anvil running) and run:

```bash
make deploy
```

**What to look for:**
- You should see output like:
  ```text
  Deploying BasicNft...
  BasicNft deployed to: 0x...
  ```

- **Copy the deployed address** - you'll need it for your `.env` file

### 3. Deploy MoodNft Contract

In the same terminal, run:

```bash
make deployMood
```

**Important:** Make sure you have the SVG files required by MoodNft:
- `./img/dynamicNft/happy.svg`
- `./img/dynamicNft/sad.svg`

**What to look for:**
- You should see output like:
  ```text
  Deploying MoodNft...
  MoodNft deployed to: 0x...
  ```

- **Copy the deployed address** - you'll need it for your `.env` file

### 4. Update Frontend `.env` File

1. Go to the `frontend/` directory
2. Create or edit the `.env` file:

```env
# Local development - Replace with YOUR deployed addresses
VITE_BASIC_NFT_ADDRESS=0xYourBasicNftAddressHere
VITE_MOOD_NFT_ADDRESS=0xYourMoodNftAddressHere

# RPC URL (optional, defaults to MetaMask)
VITE_RPC_URL=http://127.0.0.1:8545
```

3. **Replace** `0xYourBasicNftAddressHere` and `0xYourMoodNftAddressHere` with the addresses from steps 2 and 3

### 5. Restart Frontend Dev Server

If your frontend is running, restart it to pick up the new environment variables:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
make frontend-dev
```

Or manually:
```bash
cd frontend
npm run dev
```

## Verification

After deployment, you should be able to:

1. ✅ Open your frontend app
2. ✅ Connect your MetaMask wallet
3. ✅ Switch to local network (chain ID 31337)
4. ✅ See the contract addresses in the browser console (check the logs)
5. ✅ Mint NFTs without errors

## Troubleshooting

### Contract addresses are still wrong?

- Check the deployment output - the addresses are shown there
- Make sure your `.env` file is in the `frontend/` directory
- Restart the frontend dev server after updating `.env`
- Check browser console for the actual addresses being used

### Deployment fails?

- Make sure Anvil is running on `http://localhost:8545`
- Check that you have the correct private key (default Anvil key is used automatically)
- Verify contracts compiled successfully: `forge build`

### Frontend can't find contracts?

- Verify the contract addresses in `.env` match the deployed addresses
- Check browser console for contract address logs
- Make sure you're connected to the correct network (chain ID 31337)

## Quick Reference

```bash
# Terminal 1: Start Anvil
make anvil

# Terminal 2: Deploy contracts
make deploy      # Deploy BasicNft
make deployMood  # Deploy MoodNft

# Terminal 3: Start frontend
make frontend-dev
```

## Notes

- **Deterministic Addresses**: If you use the same deployer account and nonce, Anvil will deploy to the same addresses. The default addresses in the code are the first two addresses that Foundry deploys to.
- **Multiple Deployments**: Each time you restart Anvil, you start fresh. You'll need to redeploy contracts.
- **Contract Verification**: After deployment, check the browser console logs - they will show you which contract addresses are being used.

