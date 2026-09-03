# Secret Handling

Use only new burner wallets for this project.

Do not put a private key, seed phrase, wallet password or keystore file in chat, GitHub, Vercel public environment variables, screenshots or demo text.

## Local Files

Create a local file from the example:

```bash
cp .env.example .env.local
```

Fill `.env.local` on your machine. The file is ignored by Git.

Use one burner wallet per agent if possible:

- `B8X_REBALANCER_PRIVATE_KEY`
- `B8X_GRID_PRIVATE_KEY`
- `B8X_YIELD_PRIVATE_KEY`
- `B8X_HEALTH_PRIVATE_KEY`

Fund each wallet with only the amount needed for gas and test execution. For testnet, use faucet BNB. For mainnet, keep balances small.

## BNB Agent Studio Wallets

BNB Agent Studio can create encrypted keystores under `.studio/wallets/`. That directory is ignored by Git.

The wallet password should be typed locally, through a hidden prompt or local env file. Do not pass it as a command argument and do not paste it into chat.

## Before Every Commit

Run:

```bash
git status --short
git diff --cached --name-only
rg -n "PRIVATE_KEY|WALLET_PASSWORD|seed phrase|mnemonic|0x[a-fA-F0-9]{64}" .
```

If any real secret appears in command output, stop and remove it before committing.
