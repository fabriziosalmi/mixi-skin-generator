import React from 'react';
import { SkinColors } from '../lib/export';
import { Play, Pause, SkipBack, SkipForward, SlidersHorizontal, Disc3 } from 'lucide-react';

interface PreviewPanelProps {
  colors: SkinColors;
}

export function PreviewPanel({ colors }: PreviewPanelProps) {
  const style = {
    '--bg-app': colors.bgApp,
    '--srf-low': colors.srfLow,
    '--srf-mid': colors.srfMid,
    '--srf-raised': colors.srfRaised,
    '--clr-a': colors.clrA,
    '--clr-b': colors.clrB,
    '--clr-c': colors.clrC,
    '--clr-d': colors.clrD,
    '--txt-white': colors.txtWhite,
    '--txt-muted': colors.txtMuted,
    '--brd-default': colors.brdDefault,
    '--wave-low': colors.waveLow,
    '--wave-mid': colors.waveMid,
    '--wave-high': colors.waveHigh,
    '--wave-bg': colors.waveBg,
    '--wave-playhead': colors.wavePlayhead,
  } as React.CSSProperties;

  return (
    <div 
      className="w-full h-full rounded-xl overflow-hidden flex flex-col font-mono shadow-2xl border"
      style={{ 
        ...style, 
        backgroundColor: 'var(--bg-app)', 
        color: 'var(--txt-white)',
        borderColor: 'var(--brd-default)'
      }}
    >
      {/* Top Bar */}
      <div className="h-12 flex items-center justify-between px-4 border-b" style={{ backgroundColor: 'var(--srf-low)', borderColor: 'var(--brd-default)' }}>
        <div className="flex items-center gap-2 font-bold tracking-widest">
          <Disc3 size={20} style={{ color: 'var(--clr-a)' }} />
          MIXI
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--txt-muted)' }}>
          <span>CPU: 12%</span>
          <span>12:34 PM</span>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        
        {/* Decks Row 1 */}
        <div className="flex-1 flex gap-4 min-h-0">
          <Deck letter="A" colorVar="var(--clr-a)" />
          <Deck letter="B" colorVar="var(--clr-b)" />
        </div>

        {/* Mixer */}
        <div className="h-48 rounded-lg border flex p-4 gap-4" style={{ backgroundColor: 'var(--srf-mid)', borderColor: 'var(--brd-default)' }}>
          <MixerChannel label="CH 1" colorVar="var(--clr-a)" />
          <div className="flex-1 flex flex-col items-center justify-center border-x px-4" style={{ borderColor: 'var(--brd-default)' }}>
            <div className="text-xl font-bold mb-4">MIXER</div>
            <div className="w-full h-2 rounded-full overflow-hidden flex" style={{ backgroundColor: 'var(--srf-low)' }}>
              <div className="h-full w-1/2" style={{ backgroundColor: 'var(--clr-a)' }}></div>
              <div className="h-full w-1/2" style={{ backgroundColor: 'var(--clr-b)' }}></div>
            </div>
          </div>
          <MixerChannel label="CH 2" colorVar="var(--clr-b)" />
        </div>

      </div>
    </div>
  );
}

function Deck({ letter, colorVar }: { letter: string, colorVar: string }) {
  return (
    <div className="flex-1 rounded-lg border flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--srf-mid)', borderColor: 'var(--brd-default)' }}>
      {/* Deck Header */}
      <div className="h-10 border-b flex items-center px-3 justify-between" style={{ backgroundColor: 'var(--srf-raised)', borderColor: 'var(--brd-default)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-black" style={{ backgroundColor: colorVar }}>
            {letter}
          </div>
          <span className="font-bold text-sm truncate">Track Title - Artist Name</span>
        </div>
        <span className="text-sm font-bold" style={{ color: colorVar }}>124.00</span>
      </div>

      {/* Waveform Area */}
      <div className="h-24 border-b relative overflow-hidden" style={{ backgroundColor: 'var(--wave-bg)', borderColor: 'var(--brd-default)' }}>
        {/* Mock Waveform */}
        <div className="absolute inset-0 flex items-center justify-center opacity-80">
          <div className="w-full h-12 flex items-end gap-[1px] px-2">
            {Array.from({ length: 40 }).map((_, i) => {
              const h = Math.random() * 100;
              const isLow = i % 3 === 0;
              const isHigh = i % 5 === 0;
              const color = isLow ? 'var(--wave-low)' : isHigh ? 'var(--wave-high)' : 'var(--wave-mid)';
              return (
                <div key={i} className="flex-1" style={{ height: `${h}%`, backgroundColor: color }} />
              );
            })}
          </div>
        </div>
        {/* Playhead */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 z-10" style={{ backgroundColor: 'var(--wave-playhead)', boxShadow: '0 0 8px var(--wave-playhead)' }}></div>
      </div>

      {/* Controls */}
      <div className="flex-1 p-4 flex items-center justify-between">
        <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center" style={{ borderColor: 'var(--srf-raised)' }}>
          <div className="w-20 h-20 rounded-full border-2 border-dashed animate-[spin_4s_linear_infinite]" style={{ borderColor: colorVar }}></div>
        </div>
        
        <div className="flex gap-2">
          <button className="w-12 h-10 rounded flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: 'var(--srf-raised)' }}>
            <SkipBack size={18} />
          </button>
          <button className="w-16 h-12 rounded flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: colorVar, color: '#000' }}>
            <Play size={24} fill="currentColor" />
          </button>
          <button className="w-12 h-10 rounded flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: 'var(--srf-raised)' }}>
            <SkipForward size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MixerChannel({ label, colorVar }: { label: string, colorVar: string }) {
  return (
    <div className="w-20 flex flex-col items-center gap-3">
      <div className="text-xs font-bold" style={{ color: 'var(--txt-muted)' }}>{label}</div>
      
      {/* EQ Knobs */}
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center relative" style={{ borderColor: 'var(--srf-raised)' }}>
            <div className="w-1 h-3 absolute top-1 rounded-full" style={{ backgroundColor: 'var(--txt-white)' }}></div>
          </div>
        ))}
      </div>

      {/* Fader */}
      <div className="flex-1 w-8 rounded-full relative flex justify-center py-2" style={{ backgroundColor: 'var(--srf-low)' }}>
        <div className="w-1 h-full rounded-full" style={{ backgroundColor: 'var(--srf-raised)' }}></div>
        <div className="absolute bottom-4 w-6 h-8 rounded shadow-lg" style={{ backgroundColor: colorVar }}>
          <div className="w-full h-0.5 bg-black/50 absolute top-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
}
