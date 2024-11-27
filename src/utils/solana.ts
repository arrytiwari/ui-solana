
import { Connection, clusterApiUrl } from '@solana/web3.js';


export const network = clusterApiUrl('devnet');
export const connection = new Connection(network, 'confirmed');
