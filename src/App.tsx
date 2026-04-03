import React, { useState } from 'react';
import { Download, Sparkles, Palette, Settings, FileJson } from 'lucide-react';
import { generateSkin } from './lib/gemini';
import { exportSkin, SkinColors, SkinMetadata } from './lib/export';
import { PreviewPanel } from './components/PreviewPanel';

const DEFAULT_COLORS: SkinColors = {
  bgApp: '#050510',
  srfLow: '#0a0a1a',
  srfMid: '#10102a',
  srfRaised: '#1a1a3a',
  clrA: '#ff007f',
  clrB: '#00ffff',
  clrC: '#ffaa00',
  clrD: '#8a2be2',
  txtWhite: '#ffffff',
  txtMuted: '#8888aa',
  brdDefault: '#222244',
  waveLow: '#ff007f',
  waveMid: '#00ffff',
  waveHigh: '#ffffff',
  waveBg: '#000000',
  wavePlayhead: '#ffffff',
};

const DEFAULT_METADATA: SkinMetadata = {
  id: 'skin-cyberpunk',
  name: 'Neon Cyberpunk',
  author: 'DJ Mixi',
  version: '1.0.0',
  description: 'High contrast neon pink and cyan over pitch black.',
};

export default function App() {
  const [colors, setColors] = useState<SkinColors>(DEFAULT_COLORS);
  const [metadata, setMetadata] = useState<SkinMetadata>(DEFAULT_METADATA);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'colors' | 'meta'>('ai');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateSkin(prompt);
      
      // Update metadata
      setMetadata(prev => ({
        ...prev,
        id: `skin-${result.metadata.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: result.metadata.name,
        description: result.metadata.description,
      }));

      // Update colors
      setColors(result.colors);
    } catch (error) {
      console.error("Failed to generate skin:", error);
      alert("Failed to generate skin. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    exportSkin(metadata, colors);
  };

  const handleColorChange = (key: keyof SkinColors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handleMetaChange = (key: keyof SkinMetadata, value: string) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans selection:bg-pink-500/30">
      {/* Header */}
      <header className="h-16 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between px-6 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Palette size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-white">Mixi Skin Studio</h1>
            <p className="text-xs text-neutral-400">Open Source DJ UI Builder</p>
          </div>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
        >
          <Download size={16} />
          Export Skin ZIP
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-96 border-r border-neutral-800 bg-neutral-900/30 flex flex-col overflow-hidden">
          
          {/* Tabs */}
          <div className="flex p-2 gap-1 border-b border-neutral-800 bg-neutral-900/50">
            <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} icon={<Sparkles size={14} />}>AI Gen</TabButton>
            <TabButton active={activeTab === 'colors'} onClick={() => setActiveTab('colors')} icon={<Palette size={14} />}>Colors</TabButton>
            <TabButton active={activeTab === 'meta'} onClick={() => setActiveTab('meta')} icon={<FileJson size={14} />}>Meta</TabButton>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            
            {activeTab === 'ai' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <h2 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-pink-500" />
                    Describe Your Vibe
                  </h2>
                  <p className="text-xs text-neutral-400 mb-4">
                    Tell the AI what kind of skin you want. It will generate the perfect color palette and metadata for you.
                  </p>
                  <textarea 
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="e.g. 'A retro synthwave theme with deep purple backgrounds, neon pink and bright orange accents.'"
                    className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all resize-none placeholder:text-neutral-600"
                  />
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg shadow-pink-500/20"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate Skin
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <ColorSection title="Surfaces & Backgrounds" description="The main structural colors of the app.">
                  <ColorInput label="App Background" value={colors.bgApp} onChange={v => handleColorChange('bgApp', v)} />
                  <ColorInput label="Surface Low" value={colors.srfLow} onChange={v => handleColorChange('srfLow', v)} />
                  <ColorInput label="Surface Mid" value={colors.srfMid} onChange={v => handleColorChange('srfMid', v)} />
                  <ColorInput label="Surface Raised" value={colors.srfRaised} onChange={v => handleColorChange('srfRaised', v)} />
                </ColorSection>

                <ColorSection title="Decks" description="Primary colors for the 4 decks.">
                  <ColorInput label="Deck A" value={colors.clrA} onChange={v => handleColorChange('clrA', v)} />
                  <ColorInput label="Deck B" value={colors.clrB} onChange={v => handleColorChange('clrB', v)} />
                  <ColorInput label="Deck C" value={colors.clrC} onChange={v => handleColorChange('clrC', v)} />
                  <ColorInput label="Deck D" value={colors.clrD} onChange={v => handleColorChange('clrD', v)} />
                </ColorSection>

                <ColorSection title="Waveforms" description="Colors for the 3-band EQ waveforms.">
                  <ColorInput label="Wave Low (Bass)" value={colors.waveLow} onChange={v => handleColorChange('waveLow', v)} />
                  <ColorInput label="Wave Mid" value={colors.waveMid} onChange={v => handleColorChange('waveMid', v)} />
                  <ColorInput label="Wave High (Treble)" value={colors.waveHigh} onChange={v => handleColorChange('waveHigh', v)} />
                  <ColorInput label="Wave Background" value={colors.waveBg} onChange={v => handleColorChange('waveBg', v)} />
                  <ColorInput label="Playhead" value={colors.wavePlayhead} onChange={v => handleColorChange('wavePlayhead', v)} />
                </ColorSection>

                <ColorSection title="Text & Borders" description="Typography and structural lines.">
                  <ColorInput label="Primary Text" value={colors.txtWhite} onChange={v => handleColorChange('txtWhite', v)} />
                  <ColorInput label="Muted Text" value={colors.txtMuted} onChange={v => handleColorChange('txtMuted', v)} />
                  <ColorInput label="Borders" value={colors.brdDefault} onChange={v => handleColorChange('brdDefault', v)} />
                </ColorSection>
              </div>
            )}

            {activeTab === 'meta' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="space-y-4">
                  <TextInput label="Skin ID" value={metadata.id} onChange={v => handleMetaChange('id', v)} placeholder="e.g. skin-cyberpunk" />
                  <TextInput label="Skin Name" value={metadata.name} onChange={v => handleMetaChange('name', v)} placeholder="e.g. Neon Cyberpunk" />
                  <TextInput label="Author" value={metadata.author} onChange={v => handleMetaChange('author', v)} placeholder="Your name or handle" />
                  <TextInput label="Version" value={metadata.version} onChange={v => handleMetaChange('version', v)} placeholder="1.0.0" />
                  
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Description</label>
                    <textarea 
                      value={metadata.description}
                      onChange={e => handleMetaChange('description', e.target.value)}
                      className="w-full h-24 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-600 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* Preview Area */}
        <section className="flex-1 bg-neutral-950 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-pink-500/5 to-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-full max-w-5xl aspect-[16/10] relative z-10">
            <div className="absolute -top-8 left-0 text-xs font-medium text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Preview
            </div>
            <PreviewPanel colors={colors} />
          </div>
        </section>

      </main>
    </div>
  );
}

// --- Helper Components ---

function TabButton({ active, onClick, children, icon }: { active: boolean, onClick: () => void, children: React.ReactNode, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
        active ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function ColorSection({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-white mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 mb-4">{description}</p>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between group">
      <label className="text-sm text-neutral-300 group-hover:text-white transition-colors">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500 font-mono uppercase w-16 text-right">{value}</span>
        <div className="relative w-8 h-8 rounded-md overflow-hidden border border-neutral-700 shadow-sm cursor-pointer hover:border-neutral-500 transition-colors">
          <input 
            type="color" 
            value={value} 
            onChange={e => onChange(e.target.value)}
            className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-0"
          />
          <div className="w-full h-full pointer-events-none" style={{ backgroundColor: value }} />
        </div>
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-400 mb-1.5">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-600 transition-colors"
      />
    </div>
  );
}
