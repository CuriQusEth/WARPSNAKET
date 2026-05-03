import React from 'react';
import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi';
import { appendAttribution } from '../lib/erc8021';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction } = useSendTransaction();

  // Example EOA transaction with ERC-8021 Builder Code
  const handleAttributedTx = () => {
    if (!address) return;
    sendTransaction({
      to: address, // sending 0 ETH to self as a ping/attribution
      value: 0n,
      data: appendAttribution('0x'), // Appends Builder code to empty data
    });
  };

  if (isConnected) {
    return (
      <div className="flex gap-2 items-center mt-1">
        <span className="text-[10px] text-cyan-500/80 uppercase tracking-widest">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button 
          onClick={() => handleAttributedTx()} 
          className="text-[10px] px-2 py-0.5 bg-fuchsia-600/20 text-fuchsia-400 rounded border border-fuchsia-500/30 hover:bg-fuchsia-600/40 uppercase tracking-widest transition-colors"
          title="Ping Base to trigger Builder Code via ERC-8021"
        >
          Send Ping
        </button>
        <button 
          onClick={() => disconnect()} 
          className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded hover:text-white uppercase tracking-widest transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => connect({ connector: connectors[0] })}
      className="mt-1 text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30 hover:bg-cyan-500/40 uppercase tracking-widest transition-colors"
    >
      Connect Wallet
    </button>
  );
}
