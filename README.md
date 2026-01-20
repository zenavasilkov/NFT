# Foundry NFT

<br/>
<p align="center">
<img width="150" height="150" alt="image" src="https://github.com/user-attachments/assets/82888390-8123-4334-ab2a-d0b7f34c377a" />
<img width="150" height="150" alt="image" src="https://github.com/user-attachments/assets/a60555ee-b9a9-4036-8f2a-19792444934a" />
<img width="150" height="150" alt="image" src="https://github.com/user-attachments/assets/4033c9e8-a3f7-4e27-befe-e7ef03ec8d14" />
<img width="100" height="100" alt="image" src="https://github.com/user-attachments/assets/033cf334-55f9-489d-82c8-6d6cdd292cf4" />
<img width="100" height="100" alt="image" src="https://github.com/user-attachments/assets/5e0ba37b-b71d-46b3-b9d0-747960093491" />
</p>
<br/>

## Project Overview

This repository contains two example NFT contracts and supporting scripts that demonstrate two common NFT patterns:

- BasicNft — a traditional ERC-721 token that uses off-chain metadata (JSON + hosted image/SVG). See PR #1 for the original implementation and discussion.
- MoodNft — a dynamic, on-chain SVG NFT whose appearance (mood) can be flipped on-chain. The SVG and metadata are stored/constructed on-chain so the NFT can change state without relying on off-chain files. See PR #2 for the original implementation and discussion.

Both contracts are included with deployment and interaction scripts, tests, and a Makefile to automate common developer tasks.

> If you want the exact images currently displayed at the very top of the repo, fill free to copy them.

## Features

- BasicNft
  - ERC-721 compliant.
  - Uses off-chain metadata (standard tokenURI pointing to JSON on IPFS / HTTP).
  - Minting flow intended for familiarization and testing.
- MoodNft
  - Fully on-chain metadata and SVG generation.
  - Stores SVG ( base64-encoded SVG) on-chain and returns dynamic tokenURI.
  - Allows flipping state (e.g., happy ↔ sad) on-chain; tokenURI and image reflect the current mood.
  - Demonstrates dynamic NFTs without needing external metadata hosting.

## Contracts

- contracts/BasicNft.sol
  - Off-chain metadata pattern.
  - tokenURI returns a hosted JSON URL (or IPFS URI).
  - Typical for projects relying on off-chain asset hosting.

- contracts/MoodNft.sol
  - On-chain metadata + SVG encoded as data URIs.
  - Exposes a function to flip the mood for a token (e.g., flipMood or toggleMood).
  - tokenURI returns a JSON data URI (base64-encoded) that includes the SVG image corresponding to the current mood.

(See PR #1 for BasicNft and PR #2 for MoodNft for implementation details and discussion.)

## Quick Start / Setup

Prerequisites
- Node.js (v16+ recommended, v18+ preferred)
- npm or yarn
- A local Ethereum node or testnet RPC URL (e.g., Alchemy, Infura) for deployments
- An account private key for deploying to a network (for local development you can use Hardhat or Foundry local chains)
- Git (to clone the repo)

Install dependencies:
```bash
npm install
```

Compile the contracts:
```bash
forge compile
```

Run tests:
```bash)
forge test
```

## Environment / Configuration

Create a `.env` file in the project root (example):
```
RPC_URL=https://eth-goerli.example.rpc
PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=...
```

Keep secrets out of version control.

## Deployment

Example Foundry deployment (using Solidity scripts located in script/)

```bash
# Local deploy to Anvil (start anvil in a separate terminal)
forge script script/DeployBasicNft.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key <PRIVATE_KEY>

# Deploy to a testnet (example: Sepolia)
# Ensure your .env is loaded: source .env
forge script script/DeployMoodNft.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY
```

Example actions you might find in the repo:
- scripts/deploy-basicnft.js — deploys BasicNft
- scripts/deploy-moodnft.js — deploys MoodNft
- scripts/mint.js — sample script to mint tokens
- scripts/flipMood.js — flip a MoodNft's mood on-chain

After deployment, copy the deployed contract addresses into README or release notes for convenience.

## Usage

Minting BasicNft (off-chain metadata)
1. Deploy BasicNft.
2. Call the mint function (e.g., safeMint or mintNFT).
3. tokenURI(tokenId) returns the hosted JSON metadata (pointing to image hosted on IPFS).

Minting MoodNft (on-chain SVG)
1. Deploy MoodNft.
2. Call mint to create a token.
3. The tokenURI(tokenId) returns a base64 data URI JSON which includes an SVG image that is generated from the token's current mood.
4. To change the appearance, call the flip/toggle function (e.g., flipMood(tokenId)) and read tokenURI again — the SVG will reflect the new mood.

Example (JavaScript ethers.js snippet):
```js
const MoodNft = await ethers.getContractAt("MoodNft", deployedAddress);
const tx = await MoodNft.mint();
await tx.wait();

const tokenURI = await MoodNft.tokenURI(0);
console.log("tokenURI:", tokenURI);

// Flip mood
const flipTx = await MoodNft.flipMood(0);
await flipTx.wait();

const newTokenURI = await MoodNft.tokenURI(0);
console.log("new tokenURI:", newTokenURI);
```

Adjust the function names to match the implementation in the repository (names above are illustrative).

## Makefile Commands Reference

This project includes a Makefile with common developer targets. Typical targets you may find:

- make install
  - Installs project dependencies.
- make build
  - Compiles contracts.
- make test
  - Runs the test suite.
- make lint
  - Runs linters and formatters.
- make deploy
  - Deploys contracts to a configured network (require env vars).
- make deploy-local
  - Deploys to a local development node.
- make clean
  - Cleans build artifacts.
- make format
  - Formats code (prettier, prettier-plugin-solidity, etc).

Run the Makefile help target (if available) to list exact targets:
```bash
make help
# or
make
```

## Testing & CI

- Unit tests are located under the test/ folder.
- To run tests locally: `forge test`.

CI will run formatting check, build, and tests on PRs. Check `.github/workflows` for workflow definitions.

## Contributing

- Fork the repo
- Create a feature branch
- Add tests for new behavior
- Open a PR referencing the relevant issue/PR

For style and guidelines, follow the repository's existing conventions.

## Troubleshooting

- If tokenURI returns a data URI, use a decoder (base64) to inspect the embedded JSON and SVG.
- For on-chain SVGs, ensure the generated SVG is under the size limits of your target providers and explorers.

## References

- [PR #1](https://github.com/zenavasilkov/NFT/pull/1) — BasicNft (off-chain metadata)
- [PR #2](https://github.com/zenavasilkov/NFT/pull/2) — MoodNft (on-chain dynamic NFT)

---

## Poem

````
I nibble lines of code with glee,
I stitch sad SVG to happy spree,
Deploy a MoodNft, hop and spin,
Flip a mood, let smiles begin!
````

