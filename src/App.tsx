import React, { useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { GameCanvas } from './components/GameCanvas';
import { Controls } from './components/Controls';
import { Play, RotateCcw, Link2 } from 'lucide-react';
import { WalletConnect } from './components/WalletConnect';
import { useAccount, useSendTransaction } from 'wagmi';
import { appendAttribution } from './lib/erc8021';
import { toHex } from 'viem';

export default function App() {
  const {
    gameState, score, level, highScore, warpCharges,
    startGame, changeDirection, triggerManualWarp, setGameState,
    refs
  } = useGameEngine();

  const { address, isConnected } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  const [txHash, setTxHash] = useState<string | null>(null);

  const saveScoreOnchain = () => {
    if (!address) return;
    
    // We encode the score as hex and append the builder code
    const scoreDataPayload = toHex(`WarpSnakeScore:${score}`);
    const attributedData = appendAttribution(scoreDataPayload);

    sendTransaction(
      {
        to: address, // Send to self
        value: 0n,
        data: attributedData
      },
      {
        onSuccess: (hash) => {
           setTxHash(hash);
        }
      }
    );
  };

  return (
    <div 
      className="fixed inset-0 text-slate-100 overflow-hidden select-none" 
      style={{ backgroundColor: '#020617', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#22d3ee 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

      {/* HUD Bar */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <div className="absolute top-0 w-full h-20 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between px-4 sm:px-10 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex flex-col items-center justify-center p-2 gap-1 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <div className="w-full h-1 bg-slate-950 rounded-sm"></div>
              <div className="w-full h-5 border-2 border-slate-950 rounded-sm"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tighter text-cyan-400">WARP SNAKE</h1>
              <WalletConnect />
            </div>
          </div>
          
          <div className="flex gap-6 sm:gap-12">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Score</p>
              <p className="text-2xl font-black text-white">{score.toString().padStart(6, '0')}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Level</p>
              <p className="text-2xl font-black text-cyan-400">{level.toString().padStart(2, '0')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < warpCharges ? 'bg-fuchsia-500 shadow-[0_0_8px_#d946ef]' : 'bg-slate-700'}`}></div>
              ))}
            </div>
            <span className="hidden sm:block text-[10px] font-bold uppercase text-fuchsia-400">Warp Charges</span>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div className="h-full w-full flex items-center justify-center pt-20 pb-24 sm:pb-0 relative z-10">
        <div className="relative">
          <GameCanvas refs={refs} />
          {gameState === 'PLAYING' && (
            <Controls onDirection={changeDirection} />
          )}
        </div>
      </div>

      {/* Title Screen Overlay */}
      {gameState === 'MENU' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex flex-col items-center justify-center p-3 gap-1 shadow-[0_0_30px_rgba(6,182,212,0.5)] mb-6">
            <div className="w-full h-2 bg-slate-950 rounded-sm"></div>
            <div className="w-full h-8 border-4 border-slate-950 rounded-sm"></div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] mb-2">
            WARP SNAKE
          </h1>
          <p className="text-sm text-slate-400 mb-10 max-w-xs text-center uppercase tracking-widest">Swipe to move. Orbs charge warp capability. High score protocol initiated.</p>
          
          <button 
            onClick={startGame}
            className="flex items-center gap-3 px-8 py-4 bg-cyan-500 text-slate-950 font-black text-xl rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:bg-cyan-400 active:scale-95 uppercase tracking-widest"
          >
            <Play fill="currentColor" size={20} /> Initialize
          </button>
          
          {highScore > 0 && (
            <p className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
              High Score: <span className="text-cyan-400 ml-2">{highScore.toString().padStart(6, '0')}</span>
            </p>
          )}
        </div>
      )}

      {/* Game Over Screen Overlay */}
      {gameState === 'GAME_OVER' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
          <h2 className="text-3xl font-black tracking-tighter text-fuchsia-500 mb-2 uppercase drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">System Failure</h2>
          <div className="text-center mb-6 bg-slate-900/60 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Final Score</p>
            <p className="text-5xl font-black text-white mb-2">{score.toString().padStart(6, '0')}</p>
            {score >= highScore && score > 0 && <p className="text-xs font-bold text-lime-400 uppercase tracking-widest animate-pulse mt-4">New Record Set</p>}
          </div>

          {isConnected && (
             <div className="mb-6 flex flex-col items-center">
                <button 
                  onClick={saveScoreOnchain}
                  disabled={isPending || !!txHash}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600/20 border border-blue-500 text-blue-400 font-bold text-xs rounded-xl transition-all hover:bg-blue-600/40 uppercase tracking-widest disabled:opacity-50"
                >
                  <Link2 size={16} /> 
                  {isPending ? 'Signing...' : txHash ? 'Score Chained' : 'Save Score Onchain (ERC-8021)'}
                </button>
                {txHash && (
                  <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noreferrer" className="mt-2 text-[10px] text-cyan-500 underline uppercase tracking-widest">
                    View on Basescan
                  </a>
                )}
             </div>
          )}
          
          <div className="flex gap-4">
            <button 
              onClick={() => { setTxHash(null); startGame(); }}
              className="flex items-center gap-2 px-8 py-4 bg-fuchsia-600 border-b-4 border-fuchsia-800 text-white font-black text-sm rounded-xl shadow-[0_10px_30px_rgba(217,70,239,0.4)] transition-all active:translate-y-1 hover:brightness-110 uppercase tracking-widest"
            >
              <RotateCcw size={18} /> Reboot
            </button>
            <button
               onClick={() => setGameState('MENU')}
               className="flex items-center gap-2 px-6 py-4 bg-slate-800 border-b-4 border-slate-950 text-slate-400 font-bold text-sm rounded-xl transition-all active:translate-y-1 hover:text-white uppercase tracking-widest"
            >
              Menu
            </button>
          </div>
        </div>
      )}

      {/* Manual Warp Button (Bottom Right Desktop / Bottom Center Mobile) */}
      {gameState === 'PLAYING' && (
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 flex flex-col items-end gap-6 z-30">
          <button
            disabled={warpCharges === 0}
            onClick={(e) => { e.preventDefault(); triggerManualWarp(); }}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center transition-all ${
              warpCharges > 0 
                ? 'bg-fuchsia-600 border-b-4 border-fuchsia-800 shadow-[0_10px_30px_rgba(217,70,239,0.4)] active:translate-y-1 hover:scale-105' 
                : 'bg-slate-800 border-b-4 border-slate-900 text-slate-600 cursor-not-allowed opacity-80'
            }`}
          >
            <span className={`font-black text-[10px] sm:text-xs tracking-widest uppercase mb-1 ${warpCharges > 0 ? 'text-white' : 'text-slate-600'}`}>Warp</span>
            <div className={`w-6 h-6 sm:w-8 sm:h-8 border-2 rounded-full flex items-center justify-center ${warpCharges > 0 ? 'border-white' : 'border-slate-600'}`}>
              <div className={`w-3 h-1 sm:w-4 ${warpCharges > 0 ? 'bg-white' : 'bg-slate-600'}`}></div>
            </div>
            {warpCharges > 0 && <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 text-slate-950 rounded-full font-black text-xs flex items-center justify-center shadow-[0_0_10px_#22d3ee]">{warpCharges}</div>}
          </button>
        </div>
      )}
    </div>
  );
}
