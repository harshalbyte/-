import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { SakuraTree } from './SakuraTree';
import { Download, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { QRSettings } from '@/types';

interface QRDisplayProps {
  value: string;
  settings: QRSettings;
}

// Loads the sakura branch image for canvas stamping in downloads
const loadBlossomImage = (): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = '/sakura-branch.png';
  });

export function QRDisplay({ value, settings }: QRDisplayProps) {
  const [isTreeMode, setIsTreeMode] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

  // Renders QR + cherry blossom onto a canvas for downloading
  const renderQRToCanvas = (size: number): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      if (!qrRef.current) return reject(new Error('QR ref not available'));
      const svgData = new XMLSerializer().serializeToString(qrRef.current);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) { URL.revokeObjectURL(url); return resolve(canvas); }

        // Draw background + QR
        ctx.fillStyle = settings.bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);

        // Stamp the cherry blossom in center (level H = ~30% occlusion tolerance)
        try {
          const logoSize = Math.round(size * 0.2);
          const center = size / 2;
          const blossom = await loadBlossomImage();
          ctx.drawImage(blossom, center - logoSize / 2, center - logoSize / 2, logoSize, logoSize);
        } catch (_) { /* skip logo if it fails */ }

        resolve(canvas);
      };

      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG load failed')); };
      img.src = url;
    });
  };

  const handleDownloadImage = async () => {
    try {
      const canvas = await renderQRToCanvas(512);
      const a = document.createElement('a');
      a.download = 'taru_qr.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch (e) { console.error('PNG download failed:', e); }
  };

  const handleDownloadPDF = async () => {
    try {
      const canvas = await renderQRToCanvas(512);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const imgSize = pdfWidth - 2 * margin;
      pdf.setFontSize(22);
      pdf.setTextColor('#5D4037');
      pdf.text('Taru QR', pdfWidth / 2, 25, { align: 'center' });
      pdf.addImage(imgData, 'PNG', margin, 40, imgSize, imgSize);
      pdf.save('taru_qr.pdf');
    } catch (e) { console.error('PDF export failed:', e); }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 lg:p-12">
      <div
        className="relative w-full max-w-[320px] lg:max-w-[420px] aspect-square flex items-center justify-center bg-white rounded-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-8 lg:p-12 cursor-pointer group transition-transform hover:scale-[1.02]"
        onClick={() => setIsTreeMode(!isTreeMode)}
        title="Click to interact"
      >
        <AnimatePresence mode="wait">
          {isTreeMode ? (
            <SakuraTree key="tree" />
          ) : (
            <motion.div
              key="qr"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <QRCodeSVG
                ref={qrRef}
                value={value || 'https://example.com'}
                size={360}
                fgColor={settings.fgColor}
                bgColor={settings.bgColor}
                level={settings.level}
                includeMargin={false}
                style={{ width: '100%', height: '100%' }}
              />

              {/* Sakura branch centered on QR — transparent PNG, level H error correction handles coverage */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                  src="/sakura-branch.png"
                  alt=""
                  style={{ width: '55%', height: '55%', objectFit: 'contain' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper text overlay on hover */}
        {!isTreeMode && (
          <div className="absolute inset-0 rounded-[40px] bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/90 backdrop-blur text-[#4a5568] px-5 py-2.5 rounded-full text-[12px] uppercase tracking-wider font-medium shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              Transform
            </span>
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-col gap-4 w-full max-w-[320px] lg:max-w-[420px]">
        <button
          onClick={handleDownloadImage}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#4a5568] hover:bg-[#3a4454] text-white rounded-[20px] transition-all active:scale-95 text-[15px] font-medium tracking-wide shadow-sm"
        >
          <Download size={18} />
          Download PNG
        </button>
        <button
          onClick={handleDownloadPDF}
          className="w-full flex items-center justify-center gap-2 py-4 bg-white hover:bg-gray-50 text-[#4a5568] border border-[#e2e8f0] rounded-[20px] transition-all active:scale-95 text-[15px] font-medium"
        >
          <FileDown size={18} />
          Export as PDF
        </button>
      </div>
    </div>
  );
}
