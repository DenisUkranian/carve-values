# Carve Values

An independent Carve Wood value list and trade calculator. Normal and MEGA are variants of one catalog item. No installation is required to run the local copy: open `index.html` in a modern browser.

## Publish on GitHub Pages

For a free GitHub account, set this repository to **Public**. In **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/(root)**, then save. GitHub shows the live URL after deployment. Updates committed to `main` are published at the same address.

## Trade rules

- The comparison is from your perspective: your offer is what you give, their offer is what you receive.
- Equal values are always **Fair**.
- When your offer is worth strictly more than **50**, a difference up to **3% of your offer**, in either direction, is also **Fair**. The 3% boundary is inclusive.
- Other positive differences are **Win**; negative differences are **Loss**.
- At 50 or below, only exactly equal offers are **Fair**.
- Choose a quantity before adding an item. Existing offer rows retain their plus/minus buttons and editable quantities.
- The value list is for browsing only; it cannot add items to offers.

## Catalog

There are 34 items, including Tree of Terrors (**Super Secret**). Kelp, Poisonous Mushroom, Scorch Mushroom and Tree of Terrors each have Normal value **7,000** and MEGA value **40,000**. Bloop Kelp retains **10,000 / 70,000**.

29 item icons are taken from the supplied in-game screenshots. The five remaining placeholders are Bloop Kelp, Kelp, Poisonous Mushroom, Scorch Mushroom and Tree of Terrors.

Prices in `catalog.js` are stored as integer tenths of a value unit: `1` means 0.1, `15` means 1.5, and `70000` means 7,000. This keeps sums and the 3% comparison exact. The prices are the owner's reference list, not live market data.

This is a standalone static website. Offer state is held in memory and resets on reload. Optional external fonts fall back to system fonts when unavailable. Not affiliated with Roblox or the game creators.
