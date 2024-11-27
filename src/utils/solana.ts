// utils/solana.ts
import { Connection, clusterApiUrl } from '@solana/web3.js';

// You can switch to 'mainnet-beta' for production
export const network = clusterApiUrl('devnet');
export const connection = new Connection(network, 'confirmed');
