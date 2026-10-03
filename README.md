# Carve Values

An independent Carve Wood value list and trade calculator. Normal and MEGA are variants of one catalog item. No installation is required to run the local copy: open `index.html` in a modern browser.

## Publish on GitHub Pages

Live website: https://denisukranian.github.io/carve-values/

For a free GitHub account, set this repository to **Public**. In **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/(root)**, then save. GitHub shows the live URL after deployment. Updates committed to `main` are published at the same address.

## Site analytics

The live site uses GoatCounter. The owner created the account manually and supplied the integration endpoint: `https://vortoxfuga.goatcounter.com/count`. The private dashboard is https://vortoxfuga.goatcounter.com/ and requires the owner's login. Confirm the account email using GoatCounter's verification email if the dashboard requests it.

`analytics.js` loads the counter asynchronously on the production GitHub Pages domain and this project's path. It counts page visits with GoatCounter's default session handling. It sends a constant page path and title, omits referral data and query strings, and disables automatic click events. It does not read calculator offers. Browsers that block the tracker will not be counted. Tracking starts after activation; earlier visits cannot be reconstructed by this integration.

To disable analytics, set `goatCounterEndpoint` to an empty string. To change accounts, use the verified `/count` endpoint from the owner's account and update the `analytics.js` cache version in `index.html`. Never put passwords or API tokens in the repository. Keep the dashboard private unless the owner asks to share its statistics.

This dashboard measures the live website. GitHub Insights → Traffic measures the repository and is a separate metric.

## Trade rules

- The comparison is from your perspective: your offer is what you give, their offer is what you receive.
- Equal values are always **Fair**.
- When your offer is worth strictly more than **50**, a difference up to **3% of your offer**, in either direction, is also **Fair**. The 3% boundary is inclusive.
- Other positive differences are **Win**; negative differences are **Loss**.
- At 50 or below, only exactly equal offers are **Fair**.
- Choose a quantity before adding an item. Existing offer rows retain their plus/minus buttons and editable quantities.
- The value list is for browsing only; it cannot add items to offers.

## Catalog

There are 34 items, including Tree of Terrors (**Super Secret**). Current reference values:

| Item | Rarity | Normal | MEGA |
| --- | --- | ---: | ---: |
| Kelp | Super Secret | 5,000 | 20,000 |
| Poisonous Mushroom | Transcendent | 7,000 | 17,000 |
| Alien, Hyperwave, Voidstar | Transcendent | 10 | 7,000 |
| Scorch Mushroom, Tree of Terrors | Super Secret | 7,000 | 40,000 |
| Bloop Kelp | Super Secret | 10,000 | 70,000 |

29 item icons have been reconstructed at higher clarity from the supplied in-game screenshots. The transparent `assets/trees-hd-v1.webp` atlas is used across the catalog, offer rows and picker. These are enhanced reference illustrations, not original game asset exports. The original screenshot crops remain in `assets/`. The five remaining placeholders are Bloop Kelp, Kelp, Poisonous Mushroom, Scorch Mushroom and Tree of Terrors.

Prices in `catalog.js` are stored as integer tenths of a value unit: `1` means 0.1, `15` means 1.5, and `70000` means 7,000. This keeps sums and the 3% comparison exact. The prices are the owner's reference list, not live market data.

This is a standalone static website. Offer state is held in memory and resets on reload. Optional external fonts fall back to system fonts when unavailable. Not affiliated with Roblox or the game creators.
