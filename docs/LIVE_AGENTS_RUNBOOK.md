# Live Agents Runbook

This is the operational path for turning the B8X interface from a production demo into a live hackathon submission.

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

The BNB managed platform is a 48-hour testnet trial. Start it only when the submission evidence work is ready.

Current trial constraint: this account accepted three active BNB managed runtimes and rejected the fourth with `Agent quota reached (max 3)`. The current deployment path is:

- `b8xrebal`, `b8xgrid`, `b8xyield`: BNB Agent Studio managed trial
- `b8xhealth`: public Vercel API fallback until the BNB quota is raised or the agent is moved to owned AWS/Azure infrastructure

Do not put the health-factor burner private key into Vercel unless the team explicitly decides to make Vercel a signer host. The current Vercel fallback intentionally has no private key and does not claim to produce wallet-signed seller quotes.

`bag deploy verify --provider bnb` is the required command for ERC-8004 reconciliation on managed-platform projects. If it fails with `8004scan API request failed: 500`, retry later; direct `bag erc8004 register --no-paymaster` is blocked by the CLI for `destination = "platform"` projects.

## 6. Collect Evidence

```bash
./scripts/collect-agent-evidence.sh
```

Then update:

- `docs/LIVE_AGENT_EVIDENCE.md`
- `docs/AGENT_ADVANTAGE_REPORT.md`
- `index.html`, replacing demo `AGENTS` rows with live verifier output

Required evidence for the hackathon:

- agent wallet addresses
- ERC-8004 records
- ERC-8183 job or task links
- public endpoints
- transaction links
- raw agent outputs
- manual baseline notes for the Agent Advantage Report

## 7. Submission Timing

The deadline is **9 September 2026 at UTC+0**. Do not start the 48-hour managed-platform trial too early unless you are ready to submit evidence.
