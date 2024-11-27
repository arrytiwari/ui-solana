'use client'

import React from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import WalletInfo from './components/walletInfo'
import TransactionForm from './components/transactionForm'
import TransactionHistory from './components/transactionHistory'

export default function Home() {
  return (
    <div className="container">
      <div className="background-animation"></div>
      <main>
        <h1 className="text-4xl font-bold mb-8 text-white text-center">Solana Wallet Integration</h1>
        <div className="glass-panel">
          <WalletMultiButton />
          <WalletInfo />
          <TransactionForm />
          <TransactionHistory />
        </div>
      </main>

      <style jsx>{`
  .container {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .background-animation {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #00ffff, #ff00ff, #00ff00, #0000ff);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    z-index: -1;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  main {
    padding: 2rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 800px;
  }

  .glass-panel {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  h1 {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`}</style>
    </div>
  )
}

