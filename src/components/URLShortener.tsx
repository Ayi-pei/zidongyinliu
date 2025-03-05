import React, { useState } from 'react';
import { Link, Copy, ExternalLink, BarChart } from 'lucide-react';
import { ShortenedURL } from '../types';

const URLShortener: React.FC = () => {
  const [originalURL, setOriginalURL] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedURLs, setShortenedURLs] = useState<ShortenedURL[]>([]);
  
  // In a real app, this would be handled by a backend service
  const generateShortCode = () => {
    return customAlias || Math.random().toString(36).substring(2, 8);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalURL) {
      alert('请输入原始URL');
      return;
    }
    
    // Validate URL
    try {
      new URL(originalURL);
    } catch (e) {
      alert('请输入有效的URL，包括http://或https://');
      return;
    }
    
    const shortCode = generateShortCode();
    
    // Check if custom alias is already in use
    if (customAlias && shortenedURLs.some(url => url.shortCode === customAlias)) {
      alert('此自定义别名已被使用，请尝试其他别名');
      return;
    }
    
    const newShortenedURL: ShortenedURL = {
      originalURL,
      shortCode,
      createdAt: new Date(),
      clicks: 0
    };
    
    setShortenedURLs([newShortenedURL, ...shortenedURLs]);
    setOriginalURL('');
    setCustomAlias('');
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('链接已复制到剪贴板');
      })
      .catch(err => {
        console.error('无法复制链接: ', err);
      });
  };
  
  const incrementClicks = (shortCode: string) => {
    setShortenedURLs(
      shortenedURLs.map(url => 
        url.shortCode === shortCode 
          ? { ...url, clicks: url.clicks + 1 } 
          : url
      )
    );
  };
  
  const getShortURL = (shortCode: string) => {
    return `${window.location.origin}/s/${shortCode}`;
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="originalURL" className="block text-sm font-medium text-gray-700">
            原始URL
          </label>
          <div className="mt-1">
            <input
              type="url"
              name="originalURL"
              id="originalURL"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              value={originalURL}
              onChange={(e) => setOriginalURL(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700">
            自定义别名 (可选)
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="customAlias"
              id="customAlias"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="my-custom-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            留空将自动生成短代码
          </p>
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Link className="mr-2 h-5 w-5" />
            生成短链接
          </button>
        </div>
      </form>
      
      {shortenedURLs.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">您的短链接</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    短链接
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    原始URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    点击量
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shortenedURLs.map((url) => (
                  <tr key={url.shortCode}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {getShortURL(url.shortCode)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                      {url.originalURL}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {url.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {url.clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(getShortURL(url.shortCode))}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="复制链接"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                        <a
                          href={url.originalURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => incrementClicks(url.shortCode)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="访问链接"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          title="查看统计"
                        >
                          <BarChart className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default URLShortener;