const { createPublicClient, http, parseAbi } = require('viem');
const { bsc } = require('viem/chains');
const Decimal = require('decimal.js');
const FACTORY = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73';
const WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
const USDT = '0x55d398326f99059fF775485246999027B3197955';
const abi = parseAbi(['function getPair(address,address) view returns (address)', 'function token0() view returns (address)', 'function getReserves() view returns (uint112,uint112,uint32)']);
let cached;
async function poolSnapshot() {
  if (cached && Date.now() - cached.time < 15000) return cached.value;
  const client = createPublicClient({ chain: bsc, transport: http('https://bsc-dataseed.bnbchain.org', { timeout: 5000, retryCount: 0 }) });
  const block = await client.getBlock();
  if (Math.abs(Date.now() / 1000 - Number(block.timestamp)) > 120) throw new Error('Chain snapshot is stale.');
  const pair = await client.readContract({ address: FACTORY, abi, functionName: 'getPair', args: [WBNB, USDT], blockNumber: block.number });
  if (/^0x0{40}$/i.test(pair)) throw new Error('Pair is unavailable.');
  const [token0, reserves] = await Promise.all([
    client.readContract({ address: pair, abi, functionName: 'token0', blockNumber: block.number }),
    client.readContract({ address: pair, abi, functionName: 'getReserves', blockNumber: block.number })
  ]);
  const bnbFirst = token0.toLowerCase() === WBNB.toLowerCase();
  const base = reserves[bnbFirst ? 0 : 1], quote = reserves[bnbFirst ? 1 : 0];
  if (base === 0n || quote === 0n) throw new Error('Empty pool.');
  const value = { kind: 'onchain_pool_snapshot', chainId: 56, network: 'BSC mainnet (read only)', venue: 'PancakeSwap V2 WBNB/USDT', blockNumber: String(block.number), blockTime: new Date(Number(block.timestamp) * 1000).toISOString(), fetchedAt: new Date().toISOString(), pool: pair, explorer: `https://bscscan.com/address/${pair}`, price: Number(new Decimal(quote.toString()).div(base.toString()).toSignificantDigits(12)), priceUnit: 'USDT per WBNB', baseReserve: base.toString(), quoteReserve: quote.toString(), decimals: 18, reserveUpdatedAt: new Date(Number(reserves[2]) * 1000).toISOString(), warning: 'Pool reserve ratio, not an oracle or executable quote. All other analysis inputs remain user supplied.' };
  cached = { time: Date.now(), value };
  return value;
}
module.exports = { poolSnapshot };
