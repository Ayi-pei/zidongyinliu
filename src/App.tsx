import React, { useState } from 'react';
import { Calendar, Clock, Share2, QrCode, Link, Send, Instagram, Facebook, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode.react';
import SchedulePostForm from './components/SchedulePostForm';
import SocialMediaConnect from './components/SocialMediaConnect';
import QRCodeGenerator from './components/QRCodeGenerator';
import URLShortener from './components/URLShortener';
import AutoForwardRules from './components/AutoForwardRules';
import { ScheduledPost } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'qrcode' | 'url' | 'connect' | 'autoforward'>('schedule');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  
  const handleSchedulePost = (post: ScheduledPost) => {
    setScheduledPosts([...scheduledPosts, post]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Share2 className="mr-2 text-indigo-600" />
            <span>社交媒体自动化工具</span>
          </h1>
          <div className="text-sm text-gray-500">Social Media Automation Tool</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            <button
              className={`px-6 py-4 flex items-center whitespace-nowrap ${
                activeTab === 'schedule' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('schedule')}
            >
              <Calendar className="mr-2 h-5 w-5" />
              <span>定时发送</span>
            </button>
            <button
              className={`px-6 py-4 flex items-center whitespace-nowrap ${
                activeTab === 'autoforward' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('autoforward')}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              <span>自动转发</span>
            </button>
            <button
              className={`px-6 py-4 flex items-center whitespace-nowrap ${
                activeTab === 'qrcode' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('qrcode')}
            >
              <QrCode className="mr-2 h-5 w-5" />
              <span>二维码生成</span>
            </button>
            <button
              className={`px-6 py-4 flex items-center whitespace-nowrap ${
                activeTab === 'url' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('url')}
            >
              <Link className="mr-2 h-5 w-5" />
              <span>短链接</span>
            </button>
            <button
              className={`px-6 py-4 flex items-center whitespace-nowrap ${
                activeTab === 'connect' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('connect')}
            >
              <Share2 className="mr-2 h-5 w-5" />
              <span>社交媒体连接</span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'schedule' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">自动化和定时发送</h2>
                <p className="text-gray-600 mb-6">
                  设置在特定时间下自动发送预设内容和转发FB社交软件关注对象的更新内容到IG。
                </p>
                <SchedulePostForm onSchedule={handleSchedulePost} />
                
                {scheduledPosts.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">已安排的发送</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ul className="divide-y divide-gray-200">
                        {scheduledPosts.map((post, index) => (
                          <li key={index} className="py-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <Clock className="h-5 w-5 text-indigo-500" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {post.scheduledTime} - {post.platforms.join(', ')}
                                </p>
                                <p className="mt-1 text-sm text-gray-600">{post.content}</p>
                                {post.attachQRCode && (
                                  <div className="mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      包含二维码
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'autoforward' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">自动转发设置</h2>
                <p className="text-gray-600 mb-6">
                  设置自动转发指定用户或账号的最新发布内容到其他社交媒体平台。
                </p>
                <AutoForwardRules />
              </div>
            )}

            {activeTab === 'qrcode' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">动态二维码生成</h2>
                <p className="text-gray-600 mb-6">
                  生成动态二维码，将用户引导到您设置的落地页URL。支持自定义Logo和颜色。
                </p>
                <QRCodeGenerator />
              </div>
            )}

            {activeTab === 'url' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">短链接生成</h2>
                <p className="text-gray-600 mb-6">
                  创建简短易记的链接，追踪点击量并分析用户行为。
                </p>
                <URLShortener />
              </div>
            )}

            {activeTab === 'connect' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">连接社交媒体账号</h2>
                <p className="text-gray-600 mb-6">
                  连接您的社交媒体账号，以便自动发布内容和转发更新。
                </p>
                <SocialMediaConnect />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 社交媒体自动化工具 | 保留所有权利
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;