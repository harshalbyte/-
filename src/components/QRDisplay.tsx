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

export function QRDisplay({ value, settings }: QRDisplayProps) {
  const [isTreeMode, setIsTreeMode] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

  // Renders the QR SVG onto a canvas — includes the cherry blossom logo stamp in center
  // Uses Blob + createObjectURL instead of btoa/base64 which fails on many SVG strings
  const renderQRToCanvas = (size: number): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      if (!qrRef.current) return reject(new Error("QR ref not available"));
      const svgData = new XMLSerializer().serializeToString(qrRef.current);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) { URL.revokeObjectURL(url); return resolve(canvas); }

        ctx.fillStyle = settings.bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);

        // Stamp the cherry blossom logo in the center (safe: level H allows ~30% occlusion)
        const logoSize = Math.round(size * 0.2);
        const center = size / 2;
        const logoX = center - logoSize / 2;
        const logoY = center - logoSize / 2;

        // White circle background so QR scanners aren't confused by the image
        ctx.beginPath();
        ctx.arc(center, center, logoSize / 2 + 6, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        const logoImg = new Image();
        logoImg.onload = () => {
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          resolve(canvas);
        };
        logoImg.onerror = () => resolve(canvas); // resolve without logo if it can't load
        logoImg.src = '/favicon.png';
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("SVG load failed")); };
      img.src = url;
    });
  };

  const handleDownloadImage = async () => {
    try {
      const canvas = await renderQRToCanvas(512);
      const downloadLink = document.createElement("a");
      downloadLink.download = "taru_qr.png";
      downloadLink.href = canvas.toDataURL("image/png");
      downloadLink.click();
    } catch (e) {
      console.error("PNG download failed:", e);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const canvas = await renderQRToCanvas(512);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      // QR code is always square — no need for getImageProperties (removed in jsPDF v4)
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const imgSize = pdfWidth - (2 * margin); // square

      pdf.setFontSize(22);
      pdf.setTextColor('#5D4037');
      pdf.text("Taru QR", pdfWidth / 2, 25, { align: 'center' });
      pdf.addImage(imgData, 'PNG', margin, 40, imgSize, imgSize);
      pdf.save("taru_qr.pdf");
    } catch (e) {
      console.error("PDF export failed:", e);
    }
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
                value={value || "https://example.com"}
                size={360}
                fgColor={settings.fgColor}
                bgColor={settings.bgColor}
                level={settings.level}
                includeMargin={false}
                style={{ width: '100%', height: '100%' }}
              />
              {/* Cherry blossom leaf centered on the QR — safe because error correction level H handles it */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="rounded-full bg-white flex items-center justify-center shadow-sm"
                  style={{ width: '20%', height: '20%', padding: '2%' }}
                >
                  <img
                    src="/favicon.png"
                    alt="cherry blossom"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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
