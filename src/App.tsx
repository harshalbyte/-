/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { InputType, InputData, QRSettings } from '@/types';
import { GlassPanel } from '@/components/GlassPanel';
import { InputForms } from '@/components/InputForms';
import { QROptions } from '@/components/QROptions';
import { QRDisplay } from '@/components/QRDisplay';
import { computeQRValue } from '@/lib/qr-helpers';
import { Link2, Layers, AlignLeft, Wifi, Contact, FileUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

import { SakuraParticles } from '@/components/SakuraParticles';

const TABS: { id: InputType; label: string; icon: React.ReactNode }[] = [
  { id: 'url', label: 'URL', icon: <Link2 size={18} /> },
  { id: 'multi-url', label: 'Multi-URL', icon: <Layers size={18} /> },
  { id: 'text', label: 'Text', icon: <AlignLeft size={18} /> },
  { id: 'wifi', label: 'Wi-Fi', icon: <Wifi size={18} /> },
  { id: 'vcard', label: 'vCard', icon: <Contact size={18} /> },
  { id: 'file', label: 'File', icon: <FileUp size={18} /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<InputType>('url');
  
  const [inputData, setInputData] = useState<InputData>({
    url: '',
    multiUrl: [''],
    text: '',
    wifi: { ssid: '', pass: '', type: 'WPA', hidden: false },
    vcard: { fName: '', lName: '', phone: '', email: '', org: '' },
    file: null,
  });

  const [qrSettings, setQrSettings] = useState<QRSettings>({
    size: 256,
    fgColor: '#5D4037', // Wood Brown
    bgColor: '#FFFFFF', // Pure White
    level: 'H',
  });

  const updateInputData = (updates: Partial<InputData>) => {
    setInputData(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<QRSettings>) => {
    setQrSettings(prev => ({ ...prev, ...updates }));
  };

  const qrValue = useMemo(() => computeQRValue(activeTab, inputData), [activeTab, inputData]);

  return (
    <div className="min-h-screen relative text-[#4a5568] font-sans selection:bg-[#ffb7c5]/30">
      {/* Matte Pastel Pink Japanese-inspired Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#fdf2f4] via-[#fce4ec] to-[#f8bbd0]" />
      
      {/* Subtle organic shapes (Sakura breeze / clouds) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#f48fb1]/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#ffb7c5]/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-[#fce4ec]/50 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000" />
      </div>

      {/* Matte Frosted Glass Overlay for texture */}
      <div className="fixed inset-0 z-0 backdrop-blur-3xl bg-white/40" />

      {/* Falling Sakura Particles */}
      <SakuraParticles />

      <div className="relative z-10 container mx-auto max-w-[1400px] px-6 py-12 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="mb-12 text-center relative z-10">
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-baseline justify-center gap-4 mb-2"
          >
            <h1 className="text-[54px] leading-none font-light tracking-wide text-[#4a5568]" style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>तरु</h1>
            <span className="text-[26px] font-light tracking-[0.2em] text-[#8a9ba8] uppercase">QR</span>
          </motion.div>
        </header>

        {/* Main Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-[1200px] mx-auto w-full">
          
          {/* Left Column: Inputs & Settings */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <GlassPanel className="p-3 flex gap-2 overflow-x-auto hide-scrollbar snap-x">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 rounded-[20px] text-[15px] font-medium transition-all whitespace-nowrap snap-center w-full",
                    activeTab === tab.id
                      ? "bg-white/90 text-[#4a5568] shadow-sm"
                      : "bg-transparent text-[#718096] hover:bg-white/50"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", activeTab === tab.id ? "bg-[#f48fb1]" : "bg-[#cbd5e1]")} />
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </GlassPanel>

            <GlassPanel className="p-10">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <InputForms 
                  inputType={activeTab} 
                  inputData={inputData} 
                  updateData={updateInputData} 
                />
              </motion.div>

              <QROptions 
                settings={qrSettings} 
                updateSettings={updateSettings} 
              />
            </GlassPanel>
          </div>

          {/* Right Column: Preview & Download */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 h-[750px] z-10 w-full">
            <GlassPanel interactive={true} className="h-full flex flex-col items-center justify-center relative overflow-hidden bg-white/70 border-l border-white rounded-[40px]">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8bbd0]/20 pointer-events-none" />
              <QRDisplay value={qrValue} settings={qrSettings} />
            </GlassPanel>
          </div>
          
        </div>
      </div>
    </div>
  );
}
