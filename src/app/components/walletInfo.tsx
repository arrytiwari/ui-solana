'use client';
import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getSolPrice } from '@/utils/coingecko';


const WalletInfo: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number>(0);
  const [usdBalance, setUsdBalance] = useState<number>(0);
  const [solPrice, setSolPrice] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const balance = await connection.getBalance(publicKey);
          setSolBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    fetchBalance();
  }, [publicKey, connection]);

  useEffect(() => {
    const fetchSolPrice = async () => {
      const price = await getSolPrice();
      setSolPrice(price);
    };

    fetchSolPrice();
  }, []);

  useEffect(() => {
    setUsdBalance(solBalance * solPrice);
  }, [solBalance, solPrice]);

  if (!connected) {
    return <div>Please connect your wallet.</div>;
  }

  return (
    <div className="wallet-info">
      <p>
        <strong>Wallet Address:</strong> {publicKey?.toBase58()}
      </p>
      <p>
        <strong>SOL Balance:</strong> {solBalance.toFixed(2)} SOL
      </p>
      <p>
        <strong>USD Value:</strong> ${usdBalance.toFixed(2)}
      </p>
      <p>
        <strong>Status:</strong> Connected
      </p>
    </div>
  );
};

export default WalletInfo;
