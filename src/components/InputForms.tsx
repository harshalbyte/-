import React from 'react';
import { InputData, InputType, WiFiData, VCardData } from '@/types';
import { cn } from '@/lib/utils';
import { FileUp, Plus, Trash2 } from 'lucide-react';

interface InputFormsProps {
  inputType: InputType;
  inputData: InputData;
  updateData: (updates: Partial<InputData>) => void;
}

export function InputForms({ inputType, inputData, updateData }: InputFormsProps) {
  const baseInputClass = "w-full bg-white/70 border border-gray-200/60 rounded-[20px] px-6 py-5 text-[16px] text-[#2d3748] placeholder:text-gray-400 focus:outline-none focus:border-[#4a5568] focus:bg-white shadow-sm transition-all";
  const baseLabelClass = "block text-[12px] uppercase tracking-widest text-[#718096] mb-3 font-medium";

  if (inputType === 'url') {
    return (
      <div className="space-y-6">
        <div>
          <label className={baseLabelClass}>Website URL</label>
          <input
            type="url"
            value={inputData.url}
            onChange={(e) => updateData({ url: e.target.value })}
            placeholder="https://example.com"
            className={baseInputClass}
          />
        </div>
      </div>
    );
  }

  if (inputType === 'multi-url') {
    return (
      <div className="space-y-4">
        <label className={baseLabelClass}>Multiple URLs (Link Tree)</label>
        {inputData.multiUrl.map((url, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                const newUrls = [...inputData.multiUrl];
                newUrls[index] = e.target.value;
                updateData({ multiUrl: newUrls });
              }}
              placeholder="https://example.com"
              className={baseInputClass}
            />
            {inputData.multiUrl.length > 1 && (
              <button
                onClick={() => {
                  const newUrls = inputData.multiUrl.filter((_, i) => i !== index);
                  updateData({ multiUrl: newUrls });
                }}
                className="p-3 bg-white/40 hover:bg-white/80 text-gray-400 hover:text-red-500 rounded-[20px] transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => updateData({ multiUrl: [...inputData.multiUrl, ''] })}
          className="flex items-center justify-center gap-2 w-full py-4 bg-white/40 hover:bg-white/60 border border-white/50 rounded-[20px] text-[#4a5568] font-medium transition-all"
        >
          <Plus size={18} />
          Add Another Link
        </button>
      </div>
    );
  }

  if (inputType === 'text') {
    return (
      <div className="space-y-4">
        <div>
          <label className={baseLabelClass}>Plain Text</label>
          <textarea
            value={inputData.text}
            onChange={(e) => updateData({ text: e.target.value })}
            placeholder="Enter your message here..."
            className={cn(baseInputClass, "h-32 resize-none")}
          />
        </div>
      </div>
    );
  }

  if (inputType === 'wifi') {
    const updateWiFi = (updates: Partial<WiFiData>) => {
      updateData({ wifi: { ...inputData.wifi, ...updates } });
    };
    return (
      <div className="space-y-4">
        <div>
          <label className={baseLabelClass}>Network Name (SSID)</label>
          <input
            type="text"
            value={inputData.wifi.ssid}
            onChange={(e) => updateWiFi({ ssid: e.target.value })}
            placeholder="My WiFi Network"
            className={baseInputClass}
          />
        </div>
        <div>
          <label className={baseLabelClass}>Password</label>
          <input
            type="password"
            value={inputData.wifi.pass}
            onChange={(e) => updateWiFi({ pass: e.target.value })}
            placeholder="SecretPassword123"
            className={baseInputClass}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className={baseLabelClass}>Security Type</label>
            <select
              value={inputData.wifi.type}
              onChange={(e) => updateWiFi({ type: e.target.value as 'WEP' | 'WPA' | 'nopass' })}
              className={baseInputClass}
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={inputData.wifi.hidden}
                onChange={(e) => updateWiFi({ hidden: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
              />
              Hidden Network
            </label>
          </div>
        </div>
      </div>
    );
  }

  if (inputType === 'vcard') {
    const updateVCard = (updates: Partial<VCardData>) => {
      updateData({ vcard: { ...inputData.vcard, ...updates } });
    };
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className={baseLabelClass}>First Name</label>
            <input
              type="text"
              value={inputData.vcard.fName}
              onChange={(e) => updateVCard({ fName: e.target.value })}
              placeholder="Jane"
              className={baseInputClass}
            />
          </div>
          <div className="flex-1">
            <label className={baseLabelClass}>Last Name</label>
            <input
              type="text"
              value={inputData.vcard.lName}
              onChange={(e) => updateVCard({ lName: e.target.value })}
              placeholder="Doe"
              className={baseInputClass}
            />
          </div>
        </div>
        <div>
          <label className={baseLabelClass}>Phone Number</label>
          <input
            type="tel"
            value={inputData.vcard.phone}
            onChange={(e) => updateVCard({ phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
            className={baseInputClass}
          />
        </div>
        <div>
          <label className={baseLabelClass}>Email Address</label>
          <input
            type="email"
            value={inputData.vcard.email}
            onChange={(e) => updateVCard({ email: e.target.value })}
            placeholder="jane.doe@example.com"
            className={baseInputClass}
          />
        </div>
        <div>
          <label className={baseLabelClass}>Organization / Company</label>
          <input
            type="text"
            value={inputData.vcard.org}
            onChange={(e) => updateVCard({ org: e.target.value })}
            placeholder="Acme Corp"
            className={baseInputClass}
          />
        </div>
      </div>
    );
  }

  if (inputType === 'file') {
    return (
      <div className="space-y-4">
        <div>
          <label className={baseLabelClass}>Upload Document (PDF, Image, etc.)</label>
          <div className="relative mt-2">
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  updateData({ file: e.target.files[0] });
                }
              }}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={cn(
                "flex flex-col items-center justify-center w-full h-40 border border-white/80 rounded-[20px] cursor-pointer bg-white/50 hover:bg-white/70 transition-all",
                inputData.file ? "border-solid border-[#a8c69f] bg-[#a8c69f]/10" : ""
              )}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-[#94a3b8]">
                <FileUp className="w-10 h-10 mb-3 opacity-70" />
                <p className="mb-2 text-sm text-[#4a5568]">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                {inputData.file ? (
                  <p className="text-xs font-medium text-green-600 truncate max-w-[200px]">
                    {inputData.file.name}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">PDF, DOC, JPG or PNG (MAX. 10MB)</p>
                )}
              </div>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            * Note: In this prototype, files are encoded as temporary local URLs.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
