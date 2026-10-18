# FairBasket — Base Sepolia deployment checklist

This prototype does not deploy a contract automatically. The owner deploys the source and approves transactions using their own wallet. Never share a seed phrase or private key in chat, source control, or the website.

## 1. Wallet and test network
- Use a dedicated test wallet if possible.
- Base Sepolia: chain ID 84532 / hex 0x14a34.
- RPC: https://sepolia.base.org
- Explorer: https://sepolia.basescan.org
- Get Base Sepolia test ETH only from a faucet linked by official Base documentation. Testnet ETH is not real purchasing funds.

Official chain ID documentation: https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_chainId

## 2. Deploy from the public FairBasket page (recommended)

1. Wait for the latest successful Cloudflare Pages deployment. The build publishes /fairbasket-contract.json, which contains the compiled contract ABI and bytecode produced from the repository source.
2. Open https://onde-compro.pages.dev/fairbasket.html.
3. Scroll to “Anchor a digest on Base Sepolia” and click **Deploy test registry**.
4. Approve the wallet connection and switch to Base Sepolia if requested. Review the deployment transaction, then approve it. Use a dedicated test wallet only.
5. Wait for the UI to show the deployed contract address. The address is saved in this browser; copy it as a backup.
6. Create a plan snapshot or save an offer evidence record. Select the record in the evidence log, then click **Publish on Base Sepolia**.
7. On first use, the app may request two more transactions: register the demo campaign, then anchor the selected evidence digest. Approve them separately, then wait for the confirmed block and BaseScan transaction link.

If the compiled artifact is unavailable, use the manual fallback below.

## Manual deployment fallback in Remix

1. Open https://remix.ethereum.org/.
2. Create FairBasketRegistry.sol and copy contracts/FairBasketRegistry.sol from this repository.
3. Compile with Solidity 0.8.24 or later, but below 0.9.0.
4. In Deploy & Run, select Injected Provider, approve wallet connection, and confirm Base Sepolia is selected.
5. Select FairBasketRegistry and deploy. Confirm the testnet transaction in your wallet.
6. Copy the deployed contract address into the “Deployed FairBasketRegistry address” field in the FairBasket page.
7. Continue with step 6 in the recommended browser flow above.

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
