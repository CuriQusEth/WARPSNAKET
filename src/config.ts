import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { defineChain } from 'viem';
import { coinbaseWallet, injected, baseAccount } from 'wagmi/connectors';

export const baseVibenet = defineChain({
  id: 84538453,
  name: 'Base Vibenet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.vibes.base.org'] },
  },
  blockExplorers: {
    default: { name: 'Vibescan', url: 'https://vibescan.org' },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [base, baseSepolia, baseVibenet],
  multiInjectedProviderDiscovery: false,
  connectors: [
    injected(),
    baseAccount({ appName: 'Warp Snake' }),
    coinbaseWallet({ appName: 'Warp Snake', preference: 'smartWalletOnly' }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [baseVibenet.id]: http(),
  },
});
