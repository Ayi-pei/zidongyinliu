import React, { useState } from 'react';
import { Calendar, Clock, Send, QrCode, Link, Copy, AlertCircle, GitBranch as BrandTiktok } from 'lucide-react';
import { ScheduledPost, SocialMediaAccount } from '../types';

interface SchedulePostFormProps {
  onSchedule: (post: ScheduledPost) => void;
}

const SchedulePostForm: React.FC<SchedulePostFormProps> = ({ onSchedule }) => {
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [attachQRCode, setAttachQRCode] = useState(false);
  const [targetURL, setTargetURL] = useState('');
  const [useShortLink, setUseShortLink] = useState(false);
  const [shortLinkAlias, setShortLinkAlias] = useState('');
  const [repeatSchedule, setRepeatSchedule] = useState('none');
  const [endDate, setEndDate] = useState('');
  const [subscriptionURL, setSubscriptionURL] = useState('');
  const [autoForward, setAutoForward] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  // Mock accounts data - in a real app, this would come from your backend
  const accounts: SocialMediaAccount[] = [
    { platform: 'facebook', username: 'default_fb', accountId: 'facebook_default', connected: true },
    { platform: 'instagram', username: 'default_ig', accountId: 'instagram_default', connected: true },
    { platform: 'twitter', username: 'default_tw', accountId: 'twitter_default', connected: true },
    { platform: 'tiktok', username: 'default_tt', accountId: 'tiktok_default', connected: true },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content && !subscriptionURL) {
      alert('请输入发送内容或订阅源链接');
      return;
    }

    if (!date || !time || platforms.length === 0) {
      alert('请填写所有必填字段');
      return;
    }

    if (attachQRCode && !targetURL) {
      alert('启用二维码时必须填写目标URL');
      return;
    }

    if (repeatSchedule !== 'none' && !endDate) {
      alert('请设置重复发送的结束日期');
      return;
    }

    const scheduledTime = `${date} ${time}`;
    
    const post: ScheduledPost = {
      content,
      scheduledTime,
      platforms,
      attachQRCode,
      targetURL: attachQRCode ? targetURL : undefined,
      useShortLink,
      shortLinkAlias: useShortLink ? shortLinkAlias : undefined,
      repeatSchedule,
      endDate: repeatSchedule !== 'none' ? endDate : undefined,
      subscriptionURL: autoForward ? subscriptionURL : undefined,
      autoForward,
      accountId: selectedAccount || undefined
    };

    onSchedule(post);
    
    // Reset form
    setContent('');
    setDate('');
    setTime('');
    setPlatforms([]);
    setAttachQRCode(false);
    setTargetURL('');
    setUseShortLink(false);
    setShortLinkAlias('');
    setRepeatSchedule('none');
    setEndDate('');
    setSubscriptionURL('');
    setAutoForward(false);
    setSelectedAccount('');
  };

  const handlePlatformChange = (platform: string) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter(p => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  const generateShortLink = () => {
    if (!targetURL) {
      alert('请先输入目标URL');
      return;
    }
    setUseShortLink(true);
    if (!shortLinkAlias) {
      setShortLinkAlias(Math.random().toString(36).substring(2, 8));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              您可以选择直接发送内容，或者订阅目标主页自动转发最新内容。支持定时发送和重复计划。
            </p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="account" className="block text-sm font-medium text-gray-700">
          发送账号
        </label>
        <select
          id="account"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
        >
          <option value="">使用默认账号</option>
          {accounts.map((account) => (
            <option key={account.accountId} value={account.accountId}>
              {account.platform} - {account.username}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            发送方式
          </label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                checked={!autoForward}
                onChange={() => setAutoForward(false)}
              />
              <span className="ml-2">直接发送内容</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                checked={autoForward}
                onChange={() => setAutoForward(true)}
              />
              <span className="ml-2">订阅转发</span>
            </label>
          </div>
        </div>

        {autoForward ? (
          <div>
            <label htmlFor="subscriptionURL" className="block text-sm font-medium text-gray-700">
              订阅源链接
            </label>
            <div className="mt-1">
              <input
                type="url"
                id="subscriptionURL"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="输入要订阅的主页或内容源链接"
                value={subscriptionURL}
                onChange={(e) => setSubscriptionURL(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              发送内容
            </label>
            <div className="mt-1">
              <textarea
                id="content"
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="输入您想要发送的内容..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            日期
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="date"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            时间
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="time"
              id="time"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">重复计划</label>
        <div className="mt-2">
          <select
            value={repeatSchedule}
            onChange={(e) => setRepeatSchedule(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="none">不重复</option>
            <option value="daily">每天</option>
            <option value="weekly">每周</option>
            <option value="monthly">每月</option>
          </select>
        </div>
        {repeatSchedule !== 'none' && (
          <div className="mt-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              结束日期
            </label>
            <input
              type="date"
              id="endDate"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={date}
              required
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">发布平台</label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              id="facebook"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={platforms.includes('Facebook')}
              onChange={() => handlePlatformChange('Facebook')}
            />
            <label htmlFor="facebook" className="ml-2 block text-sm text-gray-700">
              Facebook
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="instagram"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={platforms.includes('Instagram')}
              onChange={() => handlePlatformChange('Instagram')}
            />
            <label htmlFor="instagram" className="ml-2 block text-sm text-gray-700">
              Instagram
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="twitter"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={platforms.includes('Twitter')}
              onChange={() => handlePlatformChange('Twitter')}
            />
            <label htmlFor="twitter" className="ml-2 block text-sm text-gray-700">
              Twitter
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="tiktok"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={platforms.includes('TikTok')}
              onChange={() => handlePlatformChange('TikTok')}
            />
            <label htmlFor="tiktok" className="ml-2 block text-sm text-gray-700">
              TikTok
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="attachQRCode"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={attachQRCode}
                onChange={(e) => setAttachQRCode(e.target.checked)}
              />
              <label htmlFor="attachQRCode" className="ml-2 block text-sm text-gray-700">
                附带二维码
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="useShortLink"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={useShortLink}
                onChange={(e) => setUseShortLink(e.target.checked)}
              />
              <label htmlFor="useShortLink" className="ml-2 block text-sm text-gray-700">
                使用短链接
              </label>
            </div>
          </div>
          
          {(attachQRCode || useShortLink) && (
            <div className="mt-3">
              <label htmlFor="targetURL" className="block text-sm font-medium text-gray-700">
                目标URL
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  id="targetURL"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://example.com"
                  value={targetURL}
                  onChange={(e) => setTargetURL(e.target.value)}
                  required={attachQRCode || useShortLink}
                />
              </div>
            </div>
          )}
          
          {useShortLink && (
            <div className="mt-3">
              <label htmlFor="shortLinkAlias" className="block text-sm font-medium text-gray-700">
                短链接别名 (可选)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="shortLinkAlias"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="自定义短链接别名"
                  value={shortLinkAlias}
                  onChange={(e) => setShortLinkAlias(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={generateShortLink}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Copy className="mr-1.5 h-4 w-4" />
                生成短链接
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Send className="mr-2 h-5 w-5" />
          安排发送
        </button>
      </div>
    </form>
  );
};

export default SchedulePostForm;