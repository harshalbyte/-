import React from 'react';
import { QRSettings } from '@/types';
import { cn } from '@/lib/utils';
import { Settings2, Type, PaintBucket, Palette } from 'lucide-react';

interface QROptionsProps {
  settings: QRSettings;
  updateSettings: (updates: Partial<QRSettings>) => void;
}

export function QROptions({ settings, updateSettings }: QROptionsProps) {
  const pastelColors = [
    { name: 'Sakura Pink', hex: '#FFB7B2' },
    { name: 'Matcha Green', hex: '#E2F0CB' },
    { name: 'Mint', hex: '#B5EAD7' },
    { name: 'Sky Blue', hex: '#C7CEEA' },
    { name: 'Lavender', hex: '#E2D5F8' },
    { name: 'Wood Brown', hex: '#5D4037' },
    { name: 'Dark Slate', hex: '#334155' },
    { name: 'Pure White', hex: '#FFFFFF' },
  ];

  const baseLabelClass = "block text-[12px] uppercase tracking-widest text-[#718096] mb-3 font-medium flex items-center gap-2";

  return (
    <div className="space-y-8 mt-10 pt-10 border-t border-gray-200/50">
      <div>
        <label className={baseLabelClass}>
          <Settings2 size={18} className="text-gray-400" />
          Error Correction Level
        </label>
        <div className="flex gap-2 bg-white/40 p-1.5 rounded-2xl">
          {(['L', 'M', 'Q', 'H'] as const).map((level) => (
            <button
              key={level}
              onClick={() => updateSettings({ level })}
              className={cn(
                "flex-1 py-2.5 rounded-[14px] text-[13px] font-medium border-none transition-all uppercase tracking-wider",
                settings.level === level
                  ? "bg-white text-[#4a5568] shadow-sm"
                  : "bg-transparent text-[#718096] hover:bg-white/60"
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className={baseLabelClass}>
            <PaintBucket size={18} className="text-gray-400" />
            Foreground
          </label>
          <div className="flex flex-wrap items-center gap-2.5">
            {pastelColors.map((color) => (
              <button
                key={`fg-${color.hex}`}
                onClick={() => updateSettings({ fgColor: color.hex })}
                className={cn(
                  "w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 shadow-sm shrink-0",
                  settings.fgColor === color.hex ? "border-[#f48fb1] scale-110" : "border-white/50"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            <div 
              className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border-2 border-white/50 hover:scale-110 transition-transform shrink-0 flex items-center justify-center bg-[conic-gradient(from_0deg,#fca5a5,#fde047,#86efac,#93c5fd,#d8b4fe,#fca5a5)]"
              title="Custom Color"
            >
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
              <Palette size={18} className="text-white drop-shadow-md z-10 relative pointer-events-none" />
              <input 
                type="color" 
                value={settings.fgColor} 
                onChange={(e) => updateSettings({ fgColor: e.target.value })}
                className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer border-0 p-0 opacity-0 z-20"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={baseLabelClass}>
            <PaintBucket size={18} className="text-gray-400" />
            Background
          </label>
          <div className="flex flex-wrap items-center gap-2.5">
            {pastelColors.map((color) => (
              <button
                key={`bg-${color.hex}`}
                onClick={() => updateSettings({ bgColor: color.hex })}
                className={cn(
                  "w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 shadow-sm shrink-0",
                  settings.bgColor === color.hex ? "border-[#f48fb1] scale-110" : "border-white/50"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
             <div 
               className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border-2 border-white/50 hover:scale-110 transition-transform shrink-0 flex items-center justify-center bg-[conic-gradient(from_0deg,#fca5a5,#fde047,#86efac,#93c5fd,#d8b4fe,#fca5a5)]"
               title="Custom Color"
             >
               <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
               <Palette size={18} className="text-white drop-shadow-md z-10 relative pointer-events-none" />
               <input 
                 type="color" 
                 value={settings.bgColor} 
                 onChange={(e) => updateSettings({ bgColor: e.target.value })}
                 className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer border-0 p-0 opacity-0 z-20"
               />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
