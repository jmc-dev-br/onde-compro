# FairBasket — Base Sepolia deployment checklist

This prototype does not deploy a contract automatically. The owner deploys the source and approves transactions using their own wallet. Never share a seed phrase or private key in chat, source control, or the website.

## 1. Wallet and test network
- Use a dedicated test wallet if possible.
- Base Sepolia: chain ID 84532 / hex 0x14a34.
- RPC: https://sepolia.base.org
- Explorer: https://sepolia.basescan.org
- Get Base Sepolia test ETH only from a faucet linked by official Base documentation. Testnet ETH is not real purchasing funds.

Official chain ID documentation: https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_chainId

## 2. Deploy in Remix
1. Open https://remix.ethereum.org/.
2. Create FairBasketRegistry.sol and copy contracts/FairBasketRegistry.sol from this repository.
3. Compile with Solidity 0.8.24 or later, but below 0.9.0.
4. In Deploy & Run, select Injected Provider, approve wallet connection, and confirm Base Sepolia is selected.
5. Select FairBasketRegistry and click Deploy. Confirm the testnet transaction in your wallet.
6. Copy the deployed contract address.

## 3. Publish a prototype record
1. Open https://onde-compro.pages.dev/fairbasket.html.
2. Search for an actual product offer and save its evidence record; do not present fictional planning values as real quotations.
3. In “Anchor a digest on Base Sepolia”, paste the contract address and connect the same wallet that deployed the contract.
4. Select the evidence record and click “Publish on Base Sepolia”. Review the transaction and approve it in the wallet.
5. Wait until the UI shows a confirmed block number and a “View testnet transaction” link. Check the transaction on BaseScan.

The browser app calls:
- registerCampaign(bytes32,bytes32,uint256,uint32) if the fixed demo campaign does not yet exist.
- recordEvidence(bytes32,bytes32,uint8,uint256) for the selected digest.

The campaign-creator wallet is allowed to anchor evidence. If another wallet created the same campaign key in this registry, deploy a fresh test contract for a clean demo or use the original creator wallet.

## Evidence types
- 0 = quote / price-source record.
- 1 = budget-plan snapshot.
- 2 = purchase evidence.
- 3 = delivery evidence.

The contract does not verify that an amount is the amount actually paid, and it does not verify the truth of the payload. Anchor only records you can explain. Never put names, home addresses, donor data or unredacted receipts on-chain.

## Before entering Tech Track
- At least one successful registry deployment.
- At least one confirmed record transaction linked from the public FairBasket page.
- The exported audit bundle opens and each payload digest can be reproduced.
- Demo claims are labelled; fictional planning values are never described as real prices or measured savings.
- Prepare screenshots or a demo video so the project remains understandable if a reviewer does not connect a wallet.
- Keep a deadline buffer. The DoraHacks page in the owner's browser displays a submission deadline of 24 October 2026 at 21:00. Verify the time shown on the live submission form before uploading.
