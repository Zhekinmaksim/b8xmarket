# Live Agent Evidence

The BNB managed trial expired on 2026-09-06. Balances, managed-runtime health and quote responses below are historical observations from 2026-09-04. The ERC-8004 registrations and public endpoint availability were reconciled again on 2026-09-09. Public endpoints run the deterministic analysis engine described in README.md and do not accept funded jobs.

## Current Registration Reconciliation

At `2026-09-09T04:34:49.324Z`, a read-only check at BSC testnet block `129959947` confirmed that IDs 2095-2098 are owned by the expected wallets, each registered A2A service URL matches the public agent card, and all four URLs returned HTTP 200. The full machine-readable record is [submission-verification.json](evidence/submission-verification.json). No transaction was sent. Registration and reachability do not establish strategy quality, paid hiring or autonomous execution.

Generated: 2026-09-04 10:33:05 UTC

This file records public wallet, endpoint and reconciliation evidence only. Secrets are excluded.

## Funding

| Transfer | Transaction |
| --- | --- |
| `b8xrebal -> b8xyield`, `0.05 tBNB` | `0xf4d6cc63937e8a74903a0dacb2d78155266da203e727bcdb347b963928242853` |
| `b8xgrid -> b8xhealth`, `0.05 tBNB` | `0xd881750be5331f7c5376a5e4d9017b563ed54905bf0fdc0760dc16a91abaa23a` |

## ERC-8004 Endpoint Updates

| Agent | Transaction | Registered endpoint |
| --- | --- | --- |
| `b8xrebal` | `0x65ad13c43ade32b50cca58dfb147b9b3fd7d7739e0649669151ec0fd13f9c7b8` | `https://b8xmarket-repo.vercel.app/api/agents/b8xrebal/.well-known/agent-card.json` |
| `b8xgrid` | `0x2ba3737d23ced9b4ec073067fb6931585d755798c1d637fe322b1e4c3771ab98` | `https://b8xmarket-repo.vercel.app/api/agents/b8xgrid/.well-known/agent-card.json` |
| `b8xyield` | `0x844b8f87261e265ae001152cfe3c6b5bf732e90cc5c5d9a1481bed7865bd6e37` | `https://b8xmarket-repo.vercel.app/api/agents/b8xyield/.well-known/agent-card.json` |

The public ERC-8004 endpoints are Vercel-hosted so the submission does not depend on the 48-hour BNB managed trial window. The BNB managed trial proof for the first three agents expires at `2026-09-06T04:25:17Z`.

## Live Endpoints

| Category | Agent | Runtime | Endpoint |
| --- | --- | --- | --- |
| Rebalancing | `b8xrebal` | Vercel public A2A + BNB managed proof | `https://b8xmarket-repo.vercel.app/api/agents/b8xrebal/.well-known/agent-card.json` |
| Grid trading | `b8xgrid` | Vercel public A2A + BNB managed proof | `https://b8xmarket-repo.vercel.app/api/agents/b8xgrid/.well-known/agent-card.json` |
| Yield optimisation | `b8xyield` | Vercel public A2A + BNB managed proof | `https://b8xmarket-repo.vercel.app/api/agents/b8xyield/.well-known/agent-card.json` |
| Health factor monitoring | `b8xhealth` | Vercel public A2A | `https://b8xmarket-repo.vercel.app/api/agents/b8xhealth/.well-known/agent-card.json` |

## Wallet And Registry Checks

### b8xrebal

```txt
address: 0xa2b4fB139150513872c68d51354e9f913A8c87a0
· free platform trial: ~41h52m left ·
Wallet:  0xa2b4fB139150513872c68d51354e9f913A8c87a0

Network                          BNB                  U                   
bsc-testnet                      0.050384775 tBNB       0 U
· free platform trial: ~41h52m left ·
agent_id:  2095
address:   0xa2b4fB139150513872c68d51354e9f913A8c87a0
agent_uri: data:application/json;base64,eyJkZXNjcmlwdGlvbiI6ImJuYmFnZW50LXN0dWRpbyBhZ2VudCIsImltYWdlIjoiIiwibmFtZSI6InN0dWRpby1hZ2VudCIsInJlZ2lzdHJhdGlvbnMiOlt7ImFnZW50SWQiOjIwOTUsImFnZW50UmVnaXN0cnkiOiJlaXAxNTU6OTc6MHg4MDA0QTgxOEJGQjkxMjIzM2M0OTE4NzFiM2Q4NGM4OUE0OTRCRDllIn1dLCJzZXJ2aWNlcyI6W3siZW5kcG9pbnQiOiJodHRwczovL2I4eG1hcmtldC1yZXBvLnZlcmNlbC5hcHAvYXBpL2FnZW50cy9iOHhyZWJhbC8ud2VsbC1rbm93bi9hZ2VudC1jYXJkLmpzb24iLCJuYW1lIjoiQTJBIiwidmVyc2lvbiI6IjAuMy4wIn1dLCJ0eXBlIjoiaHR0cHM6Ly9laXBzLmV0aGVyZXVtLm9yZy9FSVBTL2VpcC04MDA0I3JlZ2lzdHJhdGlvbi12MSJ9
metadata:  {}
```

### b8xgrid

```txt
address: 0x85aeD81F6d6e00dab442F1dd77aaE03c9cA11D89
· free platform trial: ~41h51m left ·
Wallet:  0x85aeD81F6d6e00dab442F1dd77aaE03c9cA11D89

Network                          BNB                  U                   
bsc-testnet                      0.050384775 tBNB       0 U
· free platform trial: ~41h51m left ·
agent_id:  2096
address:   0x85aeD81F6d6e00dab442F1dd77aaE03c9cA11D89
agent_uri: data:application/json;base64,eyJkZXNjcmlwdGlvbiI6ImJuYmFnZW50LXN0dWRpbyBhZ2VudCIsImltYWdlIjoiIiwibmFtZSI6InN0dWRpby1hZ2VudCIsInJlZ2lzdHJhdGlvbnMiOlt7ImFnZW50SWQiOjIwOTYsImFnZW50UmVnaXN0cnkiOiJlaXAxNTU6OTc6MHg4MDA0QTgxOEJGQjkxMjIzM2M0OTE4NzFiM2Q4NGM4OUE0OTRCRDllIn1dLCJzZXJ2aWNlcyI6W3siZW5kcG9pbnQiOiJodHRwczovL2I4eG1hcmtldC1yZXBvLnZlcmNlbC5hcHAvYXBpL2FnZW50cy9iOHhncmlkLy53ZWxsLWtub3duL2FnZW50LWNhcmQuanNvbiIsIm5hbWUiOiJBMkEiLCJ2ZXJzaW9uIjoiMC4zLjAifV0sInR5cGUiOiJodHRwczovL2VpcHMuZXRoZXJldW0ub3JnL0VJUFMvZWlwLTgwMDQjcmVnaXN0cmF0aW9uLXYxIn0=
metadata:  {}
```

### b8xyield

```txt
address: 0x9a27Cea90d0AcA683F4cAFc0C7ead0a57d7367c1
· free platform trial: ~41h51m left ·
Wallet:  0x9a27Cea90d0AcA683F4cAFc0C7ead0a57d7367c1

Network                          BNB                  U                   
bsc-testnet                      0.050386875 tBNB       0 U
· free platform trial: ~41h51m left ·
agent_id:  2098
address:   0x9a27Cea90d0AcA683F4cAFc0C7ead0a57d7367c1
agent_uri: data:application/json;base64,eyJkZXNjcmlwdGlvbiI6ImJuYmFnZW50LXN0dWRpbyBhZ2VudCIsImltYWdlIjoiIiwibmFtZSI6InN0dWRpby1hZ2VudCIsInJlZ2lzdHJhdGlvbnMiOlt7ImFnZW50SWQiOjIwOTgsImFnZW50UmVnaXN0cnkiOiJlaXAxNTU6OTc6MHg4MDA0QTgxOEJGQjkxMjIzM2M0OTE4NzFiM2Q4NGM4OUE0OTRCRDllIn1dLCJzZXJ2aWNlcyI6W3siZW5kcG9pbnQiOiJodHRwczovL2I4eG1hcmtldC1yZXBvLnZlcmNlbC5hcHAvYXBpL2FnZW50cy9iOHh5aWVsZC8ud2VsbC1rbm93bi9hZ2VudC1jYXJkLmpzb24iLCJuYW1lIjoiQTJBIiwidmVyc2lvbiI6IjAuMy4wIn1dLCJ0eXBlIjoiaHR0cHM6Ly9laXBzLmV0aGVyZXVtLm9yZy9FSVBTL2VpcC04MDA0I3JlZ2lzdHJhdGlvbi12MSJ9
metadata:  {}
```

### b8xhealth

```txt
address: 0x00CCc45a862eaCEa3d421AAf4521FBc4978C3499
Wallet:  0x00CCc45a862eaCEa3d421AAf4521FBc4978C3499

Network                          BNB                  U                   
bsc-testnet                      0.049583644 tBNB       0 U
agent_id:  2097
address:   0x00CCc45a862eaCEa3d421AAf4521FBc4978C3499
agent_uri: data:application/json;base64,eyJkZXNjcmlwdGlvbiI6IkJTQyBoZWFsdGgtZmFjdG9yIG1vbml0b3JpbmcgYWdlbnQgZm9yIEI4WC4gSXQgd2F0Y2hlcyBjb2xsYXRlcmFsLCBkZWJ0LCBib3Jyb3cgcmF0ZSBhbmQgbGlxdWlkYXRpb24gZGlzdGFuY2UsIHRoZW4gcmV0dXJucyBhIGJvdW5kZWQgYWN0aW9uIHBsYW4gYmVmb3JlIGEgcG9zaXRpb24gY3Jvc3NlcyBpdHMgY29uZmlndXJlZCBmbG9vci4iLCJpbWFnZSI6IiIsIm5hbWUiOiJCOFggSGVhbHRoIEZhY3RvciBBZ2VudCIsInJlZ2lzdHJhdGlvbnMiOlt7ImFnZW50SWQiOjIwOTcsImFnZW50UmVnaXN0cnkiOiJlaXAxNTU6OTc6MHg4MDA0QTgxOEJGQjkxMjIzM2M0OTE4NzFiM2Q4NGM4OUE0OTRCRDllIn1dLCJzZXJ2aWNlcyI6W3siZW5kcG9pbnQiOiJodHRwczovL2I4eG1hcmtldC1yZXBvLnZlcmNlbC5hcHAvYXBpL2FnZW50cy9iOHhoZWFsdGgvLndlbGwta25vd24vYWdlbnQtY2FyZC5qc29uIiwibmFtZSI6IkEyQSIsInZlcnNpb24iOiIwLjMuMCJ9XSwidHlwZSI6Imh0dHBzOi8vZWlwcy5ldGhlcmV1bS5vcmcvRUlQUy9laXAtODAwNCNyZWdpc3RyYXRpb24tdjEifQ==
metadata:  {}
```

## Managed Platform Note

- `b8xrebal`, `b8xgrid` and `b8xyield` were deployed to the BNB Agent Studio managed trial and reconciled with `bag deploy verify --provider bnb`.
- The managed trial account rejected the fourth active runtime with `Agent quota reached (max 3)`, so all four ERC-8004 service endpoints are kept on durable Vercel public A2A routes.
- No private wallet key is stored in Vercel. The public routes run in zero-price quote mode; signer-backed seller delivery should move to permanent BNB managed or owned AWS hosting before charging users.
