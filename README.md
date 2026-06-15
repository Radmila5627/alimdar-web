# ALIMDAR Web App

Static HTML/CSS/JS website for ALIMDAR membership, MetaMask connection and BNB payment flow.

## What this version does

- Shows ALIMDAR membership packages.
- Connects MetaMask on BNB Smart Chain.
- Calculates BNB amount based on manually set BNB/USDC rate.
- Sends BNB membership payment to the configured wallet.
- Prepares an email membership application with wallet and TX hash.
- ATU is assigned manually after payment confirmation.

## Important

This version does **not** automatically transfer ATU from your MetaMask. A website must never hold your private key or seed phrase.

For the first public launch, use this flow:

1. User chooses membership.
2. User connects MetaMask.
3. User pays BNB.
4. User sends email application with TX hash.
5. You verify payment and manually send ATU from MetaMask.

## Files

```text
alimdar-web/
├── index.html
├── css/style.css
├── js/app.js
├── vercel.json
├── contracts/README_AUTOMATIC_ATU.md
└── assets/
```

## Edit before deployment

Open `js/app.js` and verify:

```js
contactEmail: "radmilatorovic@gmail.com"
paymentWallet: "0xAAE931b63Be266D44e0Be5d66fedE0c1c3b53379"
atuContract: "0x73c711b9567049c810Bb65920ED74606BB9Ae697"
bnbUsdcRate: 650
```

If your BNB payment wallet is different, change `paymentWallet` before deploying.

## Deploy to GitHub + Vercel

1. Create a new GitHub repository, for example `alimdar-web`.
2. Upload all files from this folder.
3. In Vercel, choose **Add New Project**.
4. Import the GitHub repository.
5. Framework preset: **Other** / static site.
6. Deploy.

## Security

Never upload or paste:

- seed phrase
- private key
- wallet password
- `.env` file with secrets

Only public wallet addresses and public contract addresses belong in this frontend.
