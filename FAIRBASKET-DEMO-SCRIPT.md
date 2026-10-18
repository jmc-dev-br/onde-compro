# FairBasket — 3-minute hackathon demo script

## Recording checklist
- Record at 1920×1080 if possible, browser zoom 90–100%, notifications off.
- Open the public FairBasket page in a fresh browser tab.
- Keep the main site search open in a second tab as a fallback.
- Use only test wallet funds on Base Sepolia. Do not show the wallet recovery phrase, private keys, real balances or personal information.
- The first screen must show “fictional pilot data” clearly.
- Prefer an actual product result for the live-search segment. If the provider is unavailable, use the button “Load simulated walkthrough” and explicitly say it is simulated. Never present the example numbers as real quotations.
- For the strongest Tech Track demo, finish a real Base Sepolia evidence transaction first, then show the transaction link and matching evidence digest.
- If the wallet transaction has not been completed, do not claim that an on-chain write has happened. Show local hash verification and describe on-chain anchoring as the next step, or consider Idea Track if allowed by the live rules.

## Timeline and narration (English)

### 0:00–0:20 — The problem
Screen: FairBasket hero and pilot summary.

Say:
“Community kitchens and small nonprofits have to stretch limited budgets for essential goods. Comparing product variants, sellers and delivery conditions takes time, while the evidence behind buying decisions often ends up scattered across screenshots and spreadsheets. FairBasket connects price comparison with an evidence trail a reviewer can inspect.”

### 0:20–0:42 — Explain the product
Screen: Scroll to “Build a transparent basket” and show the fictional-data disclaimer.

Say:
“This is a prototype, not a claim of an existing nonprofit partnership. The default basket is deliberately fictional so nobody mistakes planning figures for market prices or achieved savings. The organization remains in control of its own purchasing funds.”

### 0:42–1:15 — Compare a product
Screen: Select “Rice · 5 kg”, search “arroz tipo 1 pacote 5 kg”, and show the result source labels.

Say:
“FairBasket reuses the product search from Onde compro?. It distinguishes marketplace API prices, prices found in the product page, published ranges and unverified indexed references. A number from a search snippet is not treated as a guaranteed price. Freight, stock and checkout totals still need confirmation.”

If live search is unavailable, click “Load simulated walkthrough” and say:
“For this fallback only, I am using simulated examples to show the interface. They are not current offers, and they do not count as verified quotations.”

### 1:15–1:45 — Create an evidence record
Screen: Save a source or simulated example. Show the evidence log, SHA-256 digest, “Verify digest” and JSON export.

Say:
“Each decision can be preserved as a structured evidence record. The payload contains the product source and the captured price-source classification. FairBasket calculates a SHA-256 digest, checks that the saved payload reproduces the same hash, and exports a JSON bundle for independent review. A matching hash proves integrity of that payload, not that the underlying claim is true.”

### 1:45–2:25 — Show the Web3 layer
Preferred screen: Deploy the registry, select a record and publish. Show the confirmed BaseScan transaction.

Say:
“The Web3 layer is intentionally narrow. A public transaction anchors the digest and a declared evidence type on Base Sepolia, so a reviewer can check whether the record has changed since it was anchored. The contract never holds donations. A chain entry does not prove that a price was correct or that goods were delivered; those still require evidence.”

Only say “confirmed on Base Sepolia” after the interface shows a mined transaction and the BaseScan link opens successfully.

### 2:25–2:48 — Privacy and limits
Screen: Show the trust-by-design section and disclaimer.

Say:
“We keep names, addresses, donor information and unredacted receipts off-chain. Price sources can be stale or blocked, and the prototype does not claim savings or deliveries from fictional data. Those claims need a consented community pilot and comparable, documented measurements.”

### 2:48–3:00 — Close
Screen: FairBasket hero and public URL.

Say:
“Our next pilot measures time to compare a basket, quote coverage, like-for-like price variance and evidence completeness with a community partner. FairBasket aims to make small-scale community purchasing easier to compare and easier to audit.”

## Suggested on-screen captions
- “Direct product discovery”
- “Price-source confidence, not invented certainty”
- “Exportable evidence · SHA-256”
- “Base Sepolia testnet · no donation custody”
- “Pilot impact to be measured — not claimed”

## Exportable evidence and links
- Public prototype: https://onde-compro.pages.dev/fairbasket.html
- Repository: https://github.com/jmc-dev-br/onde-compro
- Contract source: https://github.com/jmc-dev-br/onde-compro/blob/main/contracts/FairBasketRegistry.sol
- Hackathon build page: https://dorahacks.io/hackathon/web3-social-good-2026/build
