import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import { QrCode, Download, Copy, Upload, X } from 'lucide-react';
import { QRCodeData } from '../types';

const QRCodeGenerator: React.FC = () => {
  const [qrData, setQrData] = useState<QRCodeData>({
    url: 'https://example.com',
    size: 200,
    bgColor: '#ffffff',
    fgColor: '#000000',
    includeMargin: true,
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setQrData({
      ...qrData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrData({
      ...qrData,
      size: parseInt(e.target.value, 10),
    });
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the uploaded image
      const previewURL = URL.createObjectURL(file);
      setLogoPreview(previewURL);
      
      // Update QR data with the file
      setQrData({
        ...qrData,
        logoFile: file,
        logoURL: previewURL
      });
    }
  };
  
  const removeLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    setQrData({
      ...qrData,
      logoFile: undefined,
      logoURL: undefined
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const downloadQRCode = () => {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };
  
  const copyQRCodeURL = () => {
    navigator.clipboard.writeText(qrData.url)
      .then(() => {
        alert('URL已复制到剪贴板');
      })
      .catch(err => {
        console.error('无法复制URL: ', err);
      });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <form className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              目标URL
            </label>
            <div className="mt-1">
              <input
                type="url"
                name="url"
                id="url"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="https://example.com"
                value={qrData.url}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              尺寸: {qrData.size}px
            </label>
            <div className="mt-1">
              <input
                type="range"
                name="size"
                id="size"
                min="100"
                max="400"
                step="10"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                value={qrData.size}
                onChange={handleSizeChange}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo上传
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="logoUpload"
                  className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  选择Logo
                </label>
                <input
                  id="logoUpload"
                  name="logoUpload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleLogoUpload}
                  ref={fileInputRef}
                />
              </div>
              
              {logoPreview && (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Logo预览"
                    className="h-12 w-12 object-contain border rounded"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              推荐使用透明背景的PNG图片，最佳尺寸为200x200像素
            </p>
          </div>
          
          <div>
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-500"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '隐藏高级选项' : '显示高级选项'}
            </button>
          </div>
          
          {showAdvanced && (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <div>
                <label htmlFor="fgColor" className="block text-sm font-medium text-gray-700">
                  前景色
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    name="fgColor"
                    id="fgColor"
                    className="h-8 w-8 border border-gray-300 rounded-md"
                    value={qrData.fgColor}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-sm text-gray-500">{qrData.fgColor}</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="bgColor" className="block text-sm font-medium text-gray-700">
                  背景色
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    name="bgColor"
                    id="bgColor"
                    className="h-8 w-8 border border-gray-300 rounded-md"
                    value={qrData.bgColor}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-sm text-gray-500">{qrData.bgColor}</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="includeMargin"
                  name="includeMargin"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={qrData.includeMargin}
                  onChange={handleChange}
                />
                <label htmlFor="includeMargin" className="ml-2 block text-sm text-gray-700">
                  包含边距
                </label>
              </div>
              
              <div>
                <label htmlFor="logoURL" className="block text-sm font-medium text-gray-700">
                  Logo URL (可选，优先使用上传的Logo)
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="logoURL"
                    id="logoURL"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://example.com/logo.png"
                    value={qrData.logoURL || ''}
                    onChange={handleChange}
                    disabled={!!logoPreview}
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <QRCode
            id="qrcode"
            value={qrData.url}
            size={qrData.size}
            bgColor={qrData.bgColor}
            fgColor={qrData.fgColor}
            includeMargin={qrData.includeMargin}
            level="H"
            imageSettings={
              qrData.logoURL
                ? {
                    src: qrData.logoURL,
                    x: undefined,
                    y: undefined,
                    height: qrData.size * 0.2,
                    width: qrData.size * 0.2,
                    excavate: true,
                  }
                : undefined
            }
          />
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button
            type="button"
            onClick={downloadQRCode}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="mr-2 h-5 w-5" />
            下载
          </button>
          <button
            type="button"
            onClick={copyQRCodeURL}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Copy className="mr-2 h-5 w-5" />
            复制链接
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;