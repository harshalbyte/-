import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { motion, AnimatePresence } from 'motion/react';
import { SakuraTree } from './SakuraTree';
import { Download, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { QRSettings } from '../types';

interface QRDisplayProps {
  value: string;
  settings: QRSettings;
}

// Loads the transparent sakura branch PNG for canvas stamping in downloads
const loadBlossomImage = (): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = '/sakura-branch-transparent.png';
  });

export function QRDisplay({ value, settings }: QRDisplayProps) {
  const [isTreeMode, setIsTreeMode] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);

  // Create / update the QR code whenever value or settings change
  useEffect(() => {
    const qr = new QRCodeStyling({
      width: 360,
      height: 360,
      data: value || 'https://example.com',
      qrOptions: { errorCorrectionLevel: settings.level as 'L' | 'M' | 'Q' | 'H' },
      dotsOptions: {
        color: settings.fgColor,
        type: 'square',
      },
      cornersSquareOptions: {
        color: settings.fgColor,
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: settings.fgColor,
        type: 'dot',
      },
      backgroundOptions: {
        color: 'transparent',
      },
    });

    qrInstanceRef.current = qr;

    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
      qr.append(qrContainerRef.current);
    }
  }, [value, settings]);

  // Renders QR + sakura branch onto a canvas for downloading
  const renderQRToCanvas = (size: number): Promise<HTMLCanvasElement> => {
    return new Promise(async (resolve, reject) => {
      if (!qrInstanceRef.current) return reject(new Error('QR instance not available'));

      try {
        // Get raw canvas from qr-code-styling
        const rawCanvas = await qrInstanceRef.current.getRawData('png') as Blob;
        const qrUrl = URL.createObjectURL(rawCanvas);
        const qrImg = new Image();

        qrImg.onload = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) { URL.revokeObjectURL(qrUrl); return resolve(canvas); }

          // Background
          ctx.fillStyle = settings.bgColor;
          ctx.fillRect(0, 0, size, size);

          // QR at 86% centered
          const qrSize = Math.round(size * 0.86);
          const qrOffset = Math.round((size - qrSize) / 2);
          ctx.drawImage(qrImg, qrOffset, qrOffset, qrSize, qrSize);
          URL.revokeObjectURL(qrUrl);

          // Sakura circle badge
          try {
            const circleSize = Math.round(size * 0.20);
            const center = size / 2;
            const cx = center - circleSize / 2;
            const cy = center - circleSize / 2;

            // White circle
            ctx.beginPath();
            ctx.arc(center, center, circleSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();

            // Sakura image (zoomed/clipped to circle)
            ctx.save();
            ctx.beginPath();
            ctx.arc(center, center, circleSize / 2, 0, Math.PI * 2);
            ctx.clip();
            const blossomSize = Math.round(circleSize * 1.5);
            const blossom = await loadBlossomImage();
            ctx.drawImage(blossom, center - blossomSize / 2, center - blossomSize / 2, blossomSize, blossomSize);
            ctx.restore();
          } catch (_) { /* skip if image fails */ }

          resolve(canvas);
        };

        qrImg.onerror = () => { URL.revokeObjectURL(qrUrl); reject(new Error('QR image load failed')); };
        qrImg.src = qrUrl;
      } catch (e) {
        reject(e);
      }
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
      {/* QR card */}
      <div
        className="relative w-full max-w-[320px] lg:max-w-[420px] aspect-square flex items-center justify-center rounded-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] cursor-pointer group transition-transform hover:scale-[1.02]"
        style={{ background: settings.bgColor }}
        onClick={() => setIsTreeMode(!isTreeMode)}
        title="Click to interact"
      >
        <div className="absolute inset-0 rounded-[40px]" style={{ background: settings.bgColor }} />

        <AnimatePresence mode="wait">
          {isTreeMode ? (
            <motion.div
              key="tree"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <SakuraTree />
            </motion.div>
          ) : (
            <motion.div
              key="qr"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* qr-code-styling renders into this div */}
              <div
                ref={qrContainerRef}
                style={{
                  width: '86%',
                  height: '86%',
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />

              {/* Sakura — white circle backdrop + transparent PNG */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
                <div style={{
                  position: 'relative',
                  width: '20%',
                  height: '20%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {/* White circle */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: 'white',
                    boxShadow: '0 2px 12px rgba(180,80,120,0.15)',
                  }} />
                  <img
                    src="/sakura-branch-transparent.png"
                    alt=""
                    style={{
                      position: 'relative',
                      width: '150%',
                      height: '150%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 1px 4px rgba(180,80,120,0.2))',
                    }}
                  />
                </div>
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
