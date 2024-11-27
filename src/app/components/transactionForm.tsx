'use client';
import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

const TransactionForm: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [status, setStatus] = useState<string>('');

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
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: lamports,
        })
      );

      setStatus('Sending transaction...');

      const signature = await sendTransaction(transaction, connection);

      setStatus(`Transaction sent: ${signature}`);

      // Optionally, wait for confirmation
      await connection.confirmTransaction(signature, 'processed');
      setStatus(`Transaction confirmed: ${signature}`);
    } catch (error: any) {
      console.error(error);
      setStatus(`Transaction failed: ${error.message}`);
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
          />
        </div>
        <button type="submit">Send</button>
      </form>
      {status && <p>{status}</p>}
      <style jsx>{`
        .transaction-form {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }

        form div {
          margin-bottom: 10px;
        }

        label {
          display: block;
          margin-bottom: 5px;
        }

        input {
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
        }

        button {
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #005bb5;
        }

        p {
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default TransactionForm;
