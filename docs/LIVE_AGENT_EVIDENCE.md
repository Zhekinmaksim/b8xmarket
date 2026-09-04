# Live Agent Evidence

Generated: 2026-09-04 04:42:07 UTC

This file records public wallet, endpoint and reconciliation evidence only. Secrets are excluded.

## Funding

| Transfer | Transaction |
| --- | --- |
| `b8xrebal -> b8xyield`, `0.05 tBNB` | `0xf4d6cc63937e8a74903a0dacb2d78155266da203e727bcdb347b963928242853` |
| `b8xgrid -> b8xhealth`, `0.05 tBNB` | `0xd881750be5331f7c5376a5e4d9017b563ed54905bf0fdc0760dc16a91abaa23a` |

The BNB managed trial expires at `2026-09-06T04:25:17Z`.

## Live Endpoints

| Category | Agent | Runtime | Endpoint |
| --- | --- | --- | --- |
| Rebalancing | `b8xrebal` | BNB Agent Studio managed trial | `https://bnbagent-api.bnbchain.world/v1/rt/01M1NAJVWYHJ8KK6XR11GA3F8P/.well-known/agent-card.json` |
| Grid trading | `b8xgrid` | BNB Agent Studio managed trial | `https://bnbagent-api.bnbchain.world/v1/rt/01M1NARJST7D5E5H3DS5N41RRT/.well-known/agent-card.json` |
| Yield optimisation | `b8xyield` | BNB Agent Studio managed trial | `https://bnbagent-api.bnbchain.world/v1/rt/01M1NAT4RE4N6ZJK862PJ0GJTM/.well-known/agent-card.json` |
| Health factor monitoring | `b8xhealth` | Vercel API fallback | `https://b8xmarket-repo.vercel.app/api/agents/b8xhealth` |

## Wallet And Registry Checks

### b8xrebal

```txt
address: 0xa2b4fB139150513872c68d51354e9f913A8c87a0
· free platform trial: ~47h43m left ·
Wallet:  0xa2b4fB139150513872c68d51354e9f913A8c87a0

Network                          BNB                  U                   
bsc-testnet                      0.0504979 tBNB       0 U
· free platform trial: ~47h43m left ·
error: Wallet 0xa2b4fB139150513872c68d51354e9f913A8c87a0 has no registered agent.
```

### b8xgrid

```txt
address: 0x85aeD81F6d6e00dab442F1dd77aaE03c9cA11D89
· free platform trial: ~47h42m left ·
Wallet:  0x85aeD81F6d6e00dab442F1dd77aaE03c9cA11D89

Network                          BNB                  U                   
bsc-testnet                      0.0504979 tBNB       0 U
· free platform trial: ~47h42m left ·
error: Wallet 0x85aeD81F6d6e00dab442F1dd77aaE03c9cA11D89 has no registered agent.
```

### b8xyield

```txt
address: 0x9a27Cea90d0AcA683F4cAFc0C7ead0a57d7367c1
· free platform trial: ~47h42m left ·
Wallet:  0x9a27Cea90d0AcA683F4cAFc0C7ead0a57d7367c1

Network                          BNB                  U                   
bsc-testnet                      0.0505 tBNB       0 U
· free platform trial: ~47h42m left ·
error: Wallet 0x9a27Cea90d0AcA683F4cAFc0C7ead0a57d7367c1 has no registered agent.
```

### b8xhealth

```txt
address: 0x00CCc45a862eaCEa3d421AAf4521FBc4978C3499
Wallet:  0x00CCc45a862eaCEa3d421AAf4521FBc4978C3499

Network                          BNB                  U                   
bsc-testnet                      0.0505 tBNB       0 U
error: Wallet 0x00CCc45a862eaCEa3d421AAf4521FBc4978C3499 has no registered agent.
```

## Known Current Blockers

- BNB managed trial rejected the fourth active runtime with `Agent quota reached (max 3)`; `b8xhealth` uses the Vercel fallback endpoint.
- Managed-project ERC-8004 reconciliation must run through `bag deploy verify --provider bnb`; direct self-paid `bag erc8004 register` is blocked by the CLI for `destination = "platform"` projects.
- The latest full verify attempt failed at the external scanner step: `8004scan API request failed: 500`.
