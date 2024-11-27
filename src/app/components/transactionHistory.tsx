
"use client";

import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ParsedTransactionWithMeta, ParsedInstruction } from '@solana/web3.js';
import { format } from 'date-fns';

interface TransactionInfo {
  signature: string;
  amount: number;
  timestamp: Date;
  status: string;
}

const TransactionHistory: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [transactions, setTransactions] = useState<TransactionInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!connected || !publicKey) return;

      setLoading(true);
      setError('');
      try {
        const signatures = await connection.getSignaturesForAddress(publicKey, {
          limit: 10,
        });

        const txnDetails: TransactionInfo[] = [];

        for (const sig of signatures) {
          const txn: ParsedTransactionWithMeta | null = await connection.getParsedTransaction(sig.signature);

          if (txn && txn.meta && txn.transaction) {
            const parsedInstructions = txn.transaction.message.instructions;

            for (const instruction of parsedInstructions) {
              // Type Guard: Check if instruction is a ParsedInstruction
              if ('parsed' in instruction && instruction.programId.toBase58() === '11111111111111111111111111111111') {
                // Further check if it's a transfer type
                if (instruction.parsed.type === 'transfer') {
                  const amountLamports = instruction.parsed.info.lamports;
                  const amount = amountLamports / 1e9; // Convert lamports to SOL

                  const timestamp = txn.blockTime
                    ? new Date(txn.blockTime * 1000)
                    : new Date();

                  const status = txn.meta.err ? 'Failed' : 'Success';

                  txnDetails.push({
                    signature: sig.signature,
                    amount,
                    timestamp,
                    status,
                  });
                }
              }
            }
          }
        }

        setTransactions(txnDetails);
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [connected, publicKey, connection]);

  if (!connected) {
    return <div>Please connect your wallet to view transactions.</div>;
  }

  return (
    <div className="transaction-history">
      <h2>Recent Transactions</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && transactions.length === 0 && <p>No transactions found.</p>}
      {!loading && !error && transactions.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Signature</th>
              <th>Amount (SOL)</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.signature}>
                <td>
                  <a
                    href={`https://explorer.solana.com/tx/${txn.signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {txn.signature.substring(0, 10)}...
                  </a>
                </td>
                <td>{txn.amount}</td>
                <td>{format(txn.timestamp, 'PPpp')}</td>
                <td>{txn.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style jsx>{`
        .transaction-history {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }

        th {
          background-color: #0070f3;
          color: white;
        }

        a {
          color: #0070f3;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default TransactionHistory;
