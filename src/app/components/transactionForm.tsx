// app/components/TransactionForm.tsx
'use client';

import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

export default function TransactionForm() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false); // New state

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) {
      setStatus('Wallet not connected');
      return;
    }

    let recipientPubkey: PublicKey;

    try {
      recipientPubkey = new PublicKey(recipient);
    } catch (error) {
      setStatus('Invalid recipient address');
      return;
    }

    const lamports = parseFloat(amount) * 1e9; // SOL to lamports

    if (isNaN(lamports) || lamports <= 0) {
      setStatus('Invalid amount');
      return;
    }

    try {
      setIsSending(true); // Disable button and show sending status
      setStatus('Sending transaction...');

      // Step 1: Fetch the latest blockhash and last valid block height
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      // Step 2: Create the transaction with recent blockhash and fee payer
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: lamports,
        })
      );

      // Step 3: Send the transaction
      const signature = await sendTransaction(transaction, connection);

      setStatus(`Transaction sent: ${signature}`);

      // Step 4: Confirm the transaction using the new strategy
      await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        'processed' // Commitment level
      );

      setStatus(`Transaction confirmed: ${signature}`);
    } catch (error: any) {
      console.error(error);
      setStatus(`Transaction failed: ${error.message}`);
    } finally {
      setIsSending(false); // Re-enable button
    }
  };

  return (
    <div className="transaction-form">
      <h2>Send SOL</h2>
      <form onSubmit={handleSend}>
        <div>
          <label htmlFor="recipient">Recipient Address:</label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
            placeholder="Enter recipient's SOL address"
          />
        </div>
        <div>
          <label htmlFor="amount">Amount (SOL):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.0001"
            min="0"
            required
            placeholder="Enter amount in SOL"
          />
        </div>
        <button type="submit" disabled={isSending}>
          {isSending ? 'Sending transaction...' : 'Send'}
        </button>
      </form>
      {status && <p>{status}</p>}
      <style jsx>{`
        .transaction-form {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          width: 100%;
          max-width: 500px;
        }

        form div {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
        }

        input {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }

        input:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 5px rgba(0, 112, 243, 0.5);
        }

        button {
          width: 100%;
          padding: 12px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        button:not(:disabled):hover {
          background-color: #005bb5;
        }

        p {
          margin-top: 15px;
          font-size: 14px;
          color: #333;
        }
      `}</style>
    </div>
  );
}
