import { InputData, InputType } from '@/types';

export function computeQRValue(inputType: InputType, data: InputData): string {
  switch (inputType) {
    case 'url':
      return data.url || 'https://example.com';
    
    case 'text':
      return data.text || 'Hello, world!';
    
    case 'multi-url': {
      const validUrls = data.multiUrl.filter(u => u.trim() !== '');
      if (validUrls.length === 0) return 'https://example.com';
      if (validUrls.length === 1) return validUrls[0];
      
      // Cool client-side hack: Generate a tiny HTML link tree as a Data URI!
      const linksHtml = validUrls.map(url => 
        `<a href="${url}" style="display:block;padding:15px;margin:10px 0;background:#FFB7B2;color:#fff;text-decoration:none;border-radius:12px;font-family:sans-serif;font-weight:bold;box-shadow:0 4px 6px rgba(0,0,0,0.1)">${url}</a>`
      ).join('');
      
      const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="background:#FdfBF7;text-align:center;padding:20px;margin:0;"><h2 style="font-family:sans-serif;color:#5D4037">My Links</h2>${linksHtml}</body></html>`;
      
      return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
    }
    
    case 'wifi': {
      const { ssid, pass, type, hidden } = data.wifi;
      if (!ssid) return '';
      const escapedSsid = ssid.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/:/g, '\\:');
      const escapedPass = pass.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/:/g, '\\:');
      return `WIFI:T:${type === 'nopass' ? '' : type};S:${escapedSsid};P:${escapedPass};H:${hidden ? 'true' : 'false'};;`;
    }
    
    case 'vcard': {
      const { fName, lName, phone, email, org } = data.vcard;
      return `BEGIN:VCARD\nVERSION:3.0\nN:${lName};${fName};;;\nFN:${fName} ${lName}\nORG:${org}\nTEL;TYPE=CELL:${phone}\nEMAIL;TYPE=WORK,INTERNET:${email}\nEND:VCARD`;
    }
    
    case 'file': {
      if (data.file) {
        // Use a mock object URL for this prototype session
        try {
          return URL.createObjectURL(data.file);
        } catch (e) {
          return 'https://example.com/mock-file-upload';
        }
      }
      return 'https://example.com/upload-a-file';
    }
    
    default:
      return 'https://example.com';
  }
}
