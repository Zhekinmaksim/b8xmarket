# Live Agents Runbook

This is the operational path for maintaining the B8X live hackathon submission.

## 1. Use Burner Wallets

Use new wallets only. Do not use a personal or treasury wallet.

Create `.env.local` locally:

```bash
cp .env.example .env.local
chmod 600 .env.local
```

Fill the four private-key variables with burner keys and set `WALLET_PASSWORD`.

The import script reads private keys from `.env.local` and passes them to `bag wallet new --private-key -` through stdin. The keys are not passed as command arguments.

```bash
./scripts/import-agent-wallets.sh
```

Alternative: do not put private keys in `.env.local`; create encrypted keystores directly with `bag`:

```bash
cd agents/b8xgrid/app/agent
bag wallet new
bag wallet show
```

Repeat for `b8xrebal`, `b8xyield` and `b8xhealth`.

## 2. Fund The Wallets

For BNB managed-platform testnet deploys, fund each burner wallet with testnet BNB.

Use mainnet only with small balances and only after the testnet path works.

## 3. Build And Diagnose

```bash
./scripts/build-agents.sh
./scripts/doctor-agents.sh
```

Fix every `FAIL` before deploying.

## 4. Log In To The BNB Managed Platform

```bash
bag platform login
```

Complete the device-code flow in your browser.

## 5. Deploy And Verify

```bash
./scripts/deploy-agents-bnb.sh
```

The BNB managed platform is a 48-hour testnet trial. Use it as managed-platform proof, but do not make the public submission depend on that temporary endpoint.

Current trial constraint: this account accepted three active BNB managed runtimes and rejected the fourth with `Agent quota reached (max 3)`. The current deployment path is:

- `b8xrebal`, `b8xgrid`, `b8xyield`: BNB Agent Studio managed-trial proof plus durable Vercel public A2A endpoint.
- `b8xhealth`: durable Vercel public A2A endpoint.

All four ERC-8004 service endpoints point at Vercel `.well-known/agent-card.json` URLs so the submission does not expire with the managed trial.

Do not put burner private keys into Vercel unless the team explicitly decides to make Vercel a signer host. The current Vercel endpoints intentionally have no private keys and do not claim wallet-signed seller quotes.

`bag deploy verify --provider bnb` is the required command for ERC-8004 reconciliation on managed-platform projects. `bag erc8004 update-endpoint --no-paymaster` is used afterward to point the registered service to the durable Vercel endpoint.

## 6. Collect Evidence

```bash
./scripts/collect-agent-evidence.sh
```

Then update:

- `docs/LIVE_AGENT_EVIDENCE.md`
- `docs/AGENT_ADVANTAGE_REPORT.md`
- `index.html`, replacing the seed `AGENTS` rows with newer verifier output

Required evidence for the hackathon:

- agent wallet addresses
- ERC-8004 records
- ERC-8183 job or task links
- public endpoints
- transaction links
- raw agent outputs
- manual baseline notes for the Agent Advantage Report

## 7. Submission Timing

The deadline is **9 September 2026 at UTC+0**. Keep the Vercel site and ERC-8004 endpoints alive through judging. Refresh the managed trial only if you want fresh BNB managed runtime evidence on the submission day.
