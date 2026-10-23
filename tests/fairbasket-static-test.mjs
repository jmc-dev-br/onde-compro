import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const home = readFileSync("index.html", "utf8");
const html = readFileSync("fairbasket.html", "utf8");
const search = readFileSync("functions/api/search.js", "utf8");
const chat = readFileSync("functions/api/chat.js", "utf8");
const contract = readFileSync("contracts/FairBasketRegistry.sol", "utf8");

const requiredIds = [
  "heroPlan", "heroVerified", "heroBudgetPercent", "heroBudgetBar",
  "planTotal", "linkedCount", "quoteSubtotal", "quoteDelta", "budgetText", "budgetBar",
  "needList", "offerSearchForm", "needSelect", "offerQuery", "searchBtn",
  "clearSearchBtn", "searchStatus", "offerResults", "snapshotBtn", "exportBtn",
  "auditList", "recordCountTag", "verifyBundleBtn", "exportAuditBtn", "auditStatus",
  "contractAddress", "deployRegistryBtn", "connectWalletBtn", "publishBtn", "chainStatus", "toggleChainHelp", "chainHelp",
  "loadDemoOffersBtn"
];
const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
for (const id of requiredIds) {
  assert.equal(ids.filter(candidate => candidate === id).length, 1, 'Expected exactly one HTML element with id="' + id + '"');
}

const referencedIds = [...html.matchAll(/\$\(["']([^"']+)["']\)/g)].map(match => match[1]);
for (const id of new Set(referencedIds)) {
  assert.ok(ids.includes(id), 'JavaScript references missing element id="' + id + '"');
}

assert.match(html, /ILLUSTRATIVE DATA|FICTIONAL PILOT/i, "The demo must label fictional data.");
assert.match(html, /not a real NGO|not a real nonprofit|not a real organisation/i, "The page must disclaim fictional organisation/impact data.");
assert.match(html, /No real funds held|never receives or moves donated funds/i, "The page must be clear that it does not hold donations.");
assert.match(html, /function confidenceOf\(item\)/, "Price confidence classifier must exist.");
assert.match(html, /priceSource==='listing'\|\|item\.priceSource==='page_live'/, "Only source-backed exact values may count as exact.");
assert.match(html, /function planEstimate\(\).*?item\.offer&&item\.offer\.confidence==='exact'/s, "Basket estimate must use exact-source offers when linked.");
assert.match(html, /const quoteSubtotal=/, "The basket should show a separate exact-source subtotal.");
assert.match(html, /Not realised savings/, "The delta versus fictional reference must not be called real savings.");
assert.match(html, /crypto\.subtle\.digest/, "Expected SHA-256 digest must be generated.");
assert.match(html, /await tx\.wait\(\)/, "UI must wait for transaction confirmation.");
assert.match(html, /record\.txHash=tx\.hash/, "A transaction hash must only be saved after confirmation.");
assert.match(html, /84532n/, "Writes must be limited to Base Sepolia chain ID 84532.");
assert.match(html, /safeHttps\(raw\)/, "Offer links must be constrained to HTTPS.");
assert.match(html, /function deployRegistry\(\)/, "A wallet-driven contract deployment action must exist.");
assert.match(html, /fetch\('\/fairbasket-contract\.json'/, "Deployment must retrieve the compiled contract artifact.");
assert.match(html, /new state\.ethers\.ContractFactory\(artifact\.abi,artifact\.bytecode,state\.signer\)/, "Contract deployment must use the published build artifact.");
assert.match(html, /function loadSimulatedOffers\(\)/, "A fallback demo walkthrough should exist when live search is unavailable.");
assert.match(html, /demoOnly:item\.demoOnly===true/, "Simulated offers must be persistently labelled in their evidence payload.");
assert.match(html, /item&&item\.demoOnly===true/, "Simulated offers must never be treated as exact-source prices.");
assert.match(html, /aria-live="polite"/, "Status updates should be announced to assistive technology.");

assert.match(search, /priceSource: "listing"/, "Marketplace listing price sources must be tagged.");
assert.match(search, /priceSource = "page_live"/, "Live page metadata prices must be tagged separately.");
assert.match(search, /priceSource: price \? \(price\.type === "range" \? "snippet_range" : "snippet"\)/, "Unverified snippet prices/ranges must be tagged separately.");
assert.match(chat, /Do not invent price|Não invente preço/i, "Assistant must not invent prices.");
assert.match(chat, /priceReasonSource/, "Chat should receive price evidence provenance.");

for (const fn of ["registerCampaign", "recordEvidence", "campaignExists", "campaignCreator"]) {
  assert.match(contract, new RegExp("\\bfunction\\s+" + fn + "\\b"), "Contract must implement " + fn + ".");
}
assert.match(contract, /if \(campaign\.creator != msg\.sender\) revert NotCampaignCreator\(\)/, "Only campaign creator should anchor evidence.");
assert.match(contract, /mapping\(bytes32 => mapping\(bytes32 => bool\)\) public evidenceRecorded/, "Contract should prevent duplicate evidence hashes.");
assert.match(contract, /This contract never holds donations|never holds donations/i, "Contract should not hold user funds.");

assert.match(home, /rel="canonical" href="https:\/\/onde-compro\.pages\.dev\/?"/, "Main site should declare its canonical URL.");
assert.match(home, /property="og:title"/, "Main site should have social sharing metadata.");
assert.match(home, /Compare ofertas\. <em>Compre com confiança\.<\/em>/, "Main-site headline should not promise the absolute lowest price.");
assert.match(html, /rel="canonical" href="https:\/\/onde-compro\.pages\.dev\/fairbasket\.html"/, "FairBasket should declare its canonical URL.");
assert.match(html, /property="og:title"/, "FairBasket should have social sharing metadata.");
const canonicalizer = html.match(/function canonicalizeUrl\(raw\)\{([\s\S]*?)\}\s*async function addRecord/);
assert.ok(canonicalizer, "A dedicated source-URL normalizer should exist.");
assert.match(canonicalizer[1], /return u\.href;/, "Evidence should retain the submitted HTTPS product URL.");
assert.doesNotMatch(canonicalizer[1], /u\.(?:search|hash)\s*=/, "Evidence URL normalization must not silently delete product-identifying parameters or fragments.");

console.log("FairBasket and main-site static checks passed: " + requiredIds.length + " required elements, " + new Set(referencedIds).size + " JS element references, price provenance, source safety, testnet guard, audit integrity, contract interface, metadata, and evidence URL retention.");
