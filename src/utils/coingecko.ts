// utils/coingecko.ts
import axios from 'axios';

export const getSolPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'solana',
          vs_currencies: 'usd',
        },
      }
    );
    return response.data.solana.usd;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return 0;
  }
};
