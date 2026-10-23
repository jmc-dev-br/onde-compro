# FairBasket — Hackathon Submission Pack

## One-line pitch
FairBasket helps small community organisations stretch essential-goods budgets by comparing direct offers and preserving verifiable evidence for every buying decision — without taking custody of donations.

## Final submission checklist
- Open both public pages in a fresh browser session: [Onde compro?](https://onde-compro.pages.dev/) and [FairBasket](https://onde-compro.pages.dev/fairbasket.html).
- Test at least one live product search. Include only prices and offer links actually returned by the page; availability and checkout totals can change.
- If live search is unavailable, use the simulated walkthrough only as a clearly labelled UI fallback. It is not a real quotation.
- Save a record, run **Verify digest**, and export the JSON audit bundle so the reviewer can inspect a reproducible evidence payload.
- **Tech Track integrity gate:** only describe an on-chain build as demonstrated after a registry deployment and evidence transaction have both been confirmed on Base Sepolia and the transaction link can be opened. Otherwise, choose a track allowed by the live rules and state that the chain write is still pending.
- Do not claim a real partner, donation, purchase, delivery, or measured savings from the fictional pilot scenario.

## The problem
Community kitchens, mutual-aid groups and small nonprofits often buy the same essentials with limited staff time and tight budgets. Comparing pack sizes, sellers, delivery terms and changing prices is tedious. Receipts and screenshots end up scattered across chat threads and spreadsheets, making decisions harder to review later. Donors want transparency, but small teams cannot afford enterprise procurement tooling.

We do not claim that every nonprofit faces the same problem or that measured savings already exist. The first stage is a clearly scoped pilot with one community buyer, using consented and redacted evidence.

## The solution
FairBasket combines:
1. A needs-and-budget plan for essential goods.
2. Direct offer discovery using the Onde compro? search foundation.
3. Explicit price-source labels: marketplace listing/API, price metadata from a product page, published range, or unverified indexed reference.
4. Evidence records containing a public product URL, selected price, source and timestamp, hashed with SHA-256.
5. An optional Base Sepolia smart contract that anchors the digest in a wallet-signed transaction. The contract never holds donation money.
6. An exportable JSON audit bundle so reviewers can reproduce each digest and inspect the original evidence payload.

## Why Web3 is necessary
A spreadsheet can store a hash, but the organisation controlling the spreadsheet can silently rewrite both its data and hash. A public chain adds an independently verifiable timestamped anchor. The contract emits a campaign identifier, evidence digest, declared evidence type, amount in cents, recorder and timestamp.

Web3 is intentionally narrow: it is used for tamper-evident evidence anchoring, not speculative tokens or payments. An on-chain record does not prove that a quoted price is correct, a purchase happened or goods arrived. Those claims still require source evidence and accountable review.

## Current prototype
- Live offer search reuses the existing Onde compro? Cloudflare Pages Function.
- The browser demo uses a fictional “Community Kitchen Esperança” scenario with eight essential-goods line items and a R$ 2,400 budget ceiling.
- Fictional planning values are explicitly labelled; they are never presented as current market prices.
- A quote can be linked to a need, hashed, displayed in an evidence log and exported as JSON.
- If live search is unavailable, a separate simulated walkthrough lets a reviewer exercise the evidence/hash/export flow; those entries are explicitly marked simulated and never count as exact-source quotations.
- The build publishes its compiled contract artifact, so the UI can deploy FairBasketRegistry directly to Base Sepolia with an injected wallet; the user still approves every transaction.
- A local digest remains labelled local until the wallet transaction is confirmed and mined.
- No donations, balances, tokens or purchase funds are held by the app.

## Intended impact and evaluation plan
We will measure:
- Verified quote coverage: line items with a direct source and price-source label divided by all line items.
- Comparison time: minutes required to assemble a documented comparison for a standard basket.
- Price variance: like-for-like offer total versus the organisation’s previous baseline, normalising freight, quantity and product variants.
- Audit completeness: share of quote, decision, purchase and delivery records with retrievable evidence and reproducible digests.
- Accessibility: task completion and usability feedback from a small community organisation, with informed consent.

We will not claim percentage savings, beneficiary reach, partner endorsement or successful delivery until those measurements exist. The default prototype dataset is fictional and visibly marked.

## Architecture
- Frontend: static HTML/CSS/JavaScript on Cloudflare Pages.
- Search: existing Onde compro? Cloudflare Pages Function and Tavily Search; optional marketplace source when configured.
- Integrity: Web Crypto SHA-256 in the browser and JSON audit-bundle export.
- On-chain anchor: Solidity FairBasketRegistry on Base Sepolia, chain ID 84532, with campaign-creator access control for evidence writes.
- Wallet: injected EIP-1193 wallet through ethers v6; users approve transactions. The app never asks for seed phrases or private keys.

## Limitations and safeguards
- Search snippets and structured price metadata can be stale, dynamic or blocked by anti-bot protection.
- A detected price can still exclude freight, coupons, stock and checkout variation.
- The chain stores a digest, declared evidence type and amount in cents; the contract does not validate the truth of the evidence.
- Personal details, home addresses, donor information and unredacted receipts must never be put on-chain.
- The first release is a prototype; partner workflow, consent, evidence retention and operating governance still need validation.
- Any production deployment would need contract review, stronger role administration, provenance policy and privacy/legal review.

## 60-second pitch
“Small community kitchens have to turn every donated real into meals and essential-goods kits, but comparing offers and keeping a defensible purchase trail takes time. FairBasket turns a needs list into a direct-offer comparison, labels what each price source actually proves, and preserves a reviewable evidence bundle. We then anchor the bundle’s digest on Base, so a later auditor can see whether that evidence was changed after it was recorded. We do not move donations or claim a blockchain transaction proves delivery; we keep money and procurement with the organisation and use Web3 only where it adds independent verification. Our next step is a consented pilot measuring quote coverage, comparison time, like-for-like cost variance and audit completeness.”

## Recommended demo flow
1. Open the FairBasket page and point out that the default scenario is fictional, not a claimed partner.
2. Select “Rice · 5 kg” and attempt a live search for “arroz tipo 1 pacote 5 kg”.
3. Compare source labels. Save a live result as evidence; explain why an indexed snippet does not count as a confirmed price. If live search fails, use “Load simulated walkthrough” only to demonstrate the UI and label it as simulated.
4. Create a plan snapshot, download the JSON audit bundle and use “Verify digest” to show that the payload reproduces the SHA-256 hash.
5. Use “Deploy test registry” to deploy the compiled contract to Base Sepolia, approve the wallet transaction, select a record and publish it. Only claim a chain write after the interface shows a confirmed transaction and the BaseScan link opens.
6. Explain the metrics for a real pilot and the limits of the current demo.

## Track recommendation
Submit to Tech Track only after at least one real Base Sepolia transaction is confirmed and the public page shows the transaction link. Before that, the browser demo shows meaningful implementation, but the on-chain transaction remains a setup task. If a contract cannot be deployed before the submission cutoff, choose Idea Track if the current DoraHacks rules allow that conversion, and be transparent about what works now versus what remains planned.

## Draft project summary for DoraHacks
FairBasket is a transparent community-procurement pilot that helps small nonprofits compare essential-goods offers and preserve verifiable evidence for purchase decisions. The prototype combines direct product discovery, explicit price-source confidence, exportable SHA-256 evidence bundles and an optional Base Sepolia anchoring contract. It never holds donation funds; Web3 makes evidence integrity independently checkable, rather than claiming that a price or delivery is automatically true. The demo uses clearly labelled fictional planning data, and the next validation step is a consented pilot measured by quote coverage, comparison time, like-for-like cost variance and audit completeness.

## Demo video script
- Timed 3-minute English narration and on-screen actions: FAIRBASKET-DEMO-SCRIPT.md

## Links
- Prototype: https://onde-compro.pages.dev/fairbasket.html
- Main product foundation: https://onde-compro.pages.dev/
- Repository: https://github.com/jmc-dev-br/onde-compro
- Source contract: contracts/FairBasketRegistry.sol
- Hackathon build page: https://dorahacks.io/hackathon/web3-social-good-2026/build
