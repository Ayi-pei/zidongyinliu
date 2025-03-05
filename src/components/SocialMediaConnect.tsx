import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, RefreshCw, Link2, AlertCircle } from 'lucide-react';
import { SocialMediaAccount } from '../types';

const SocialMediaConnect: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([
    { platform: 'facebook', username: '', connected: false },
    { platform: 'instagram', username: '', connected: false },
    { platform: 'twitter', username: '', connected: false },
  ]);
  
  const handleConnect = (platform: 'facebook' | 'instagram' | 'twitter') => {
    // In a real app, this would open OAuth flow
    const username = prompt(`请输入您的${platform}用户名`);
    
    if (username) {
      setAccounts(
        accounts.map(account => 
          account.platform === platform
            ? { ...account, username, connected: true, lastSync: new Date() }
            : account
        )
      );
    }
  };
  
  const handleDisconnect = (platform: 'facebook' | 'instagram' | 'twitter') => {
    if (confirm(`确定要断开${platform}连接吗？`)) {
      setAccounts(
        accounts.map(account => 
          account.platform === platform
            ? { ...account, connected: false, lastSync: undefined }
            : account
        )
      );
    }
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-8 w-8 text-blue-600" />;
      case 'instagram':
        return <Instagram className="h-8 w-8 text-pink-600" />;
      case 'twitter':
        return <Twitter className="h-8 w-8 text-blue-400" />;
      default:
        return null;
    }
  };
  
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'bg-blue-50 border-blue-200';
      case 'instagram':
        return 'bg-pink-50 border-pink-200';
      case 'twitter':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              连接您的社交媒体账号后，您可以自动发布内容和转发更新。请确保您有权限访问这些账号。
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <div 
            key={account.platform}
            className={`border rounded-lg overflow-hidden ${getPlatformColor(account.platform)}`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {getPlatformIcon(account.platform)}
                  <h3 className="ml-2 text-lg font-medium capitalize">
                    {account.platform}
                  </h3>
                </div>
                <div>
                  {account.connected ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      已连接
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      未连接
                    </span>
                  )}
                </div>
              </div>
              
              {account.connected ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">用户名</p>
                    <p className="font-medium">{account.username}</p>
                  </div>
                  
                  {account.lastSync && (
                    <div>
                      <p className="text-sm text-gray-500">上次同步</p>
                      <p className="font-medium">
                        {account.lastSync.toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => alert('刷新功能将在实际应用中实现')}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      刷新
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => handleDisconnect(account.platform)}
                    >
                      断开连接
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    连接您的{account.platform}账号以自动发布内容和转发更新。
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleConnect(account.platform)}
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    连接账号
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaConnect;