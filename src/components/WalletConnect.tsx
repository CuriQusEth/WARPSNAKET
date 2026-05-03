import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex gap-2 items-center mt-1">
        <span className="text-[10px] text-cyan-500/80 uppercase tracking-widest">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
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
    <div className="flex gap-2 items-center mt-1">
      {connectors.map((c) => (
        <button 
          key={c.uid}
          onClick={() => connect({ connector: c })}
          className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30 hover:bg-cyan-500/40 uppercase tracking-widest transition-colors"
        >
          Connect {c.name}
        </button>
      ))}
    </div>
  );
}
