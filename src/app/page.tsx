
"use client"; 

import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import WalletInfo from './components/walletInfo';
import TransactionForm from './components/transactionForm';
import TransactionHistory from './components/transactionHistory';


const Home: React.FC = () => {
  return (
    <div className="container">
      <main>
        <h1>Solana Wallet Integration</h1>
        <WalletMultiButton />
        <WalletInfo />
        <TransactionForm />
        <TransactionHistory />
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 800px;
        }

        h1 {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default Home;
