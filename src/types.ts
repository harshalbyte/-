export type InputType = 'url' | 'multi-url' | 'text' | 'wifi' | 'vcard' | 'file';

export interface QRSettings {
  size: number;
  fgColor: string;
  bgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
}

export interface WiFiData {
  ssid: string;
  pass: string;
  type: 'WEP' | 'WPA' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  fName: string;
  lName: string;
  phone: string;
  email: string;
  org: string;
}

export interface InputData {
  url: string;
  multiUrl: string[];
  text: string;
  wifi: WiFiData;
  vcard: VCardData;
  file: File | null;
}
