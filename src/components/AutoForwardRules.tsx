import React, { useState } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';
import { AutoForwardRule } from '../types';
import { format } from 'date-fns';

const AutoForwardRules: React.FC = () => {
  const [rules, setRules] = useState<AutoForwardRule[]>([
    {
      id: '1',
      sourcePlatform: 'facebook',
      targetPlatform: 'instagram',
      sourceUsername: 'example_user',
      enabled: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastForwarded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ]);
  
  const [newRule, setNewRule] = useState<Partial<AutoForwardRule>>({
    sourcePlatform: 'facebook',
    targetPlatform: 'instagram',
    sourceUsername: '',
    enabled: true
  });
  
  const handleAddRule = () => {
    if (!newRule.sourceUsername) {
      alert('请输入源用户名');
      return;
    }
    
    if (newRule.sourcePlatform === newRule.targetPlatform) {
      alert('源平台和目标平台不能相同');
      return;
    }
    
    const rule: AutoForwardRule = {
      id: Date.now().toString(),
      sourcePlatform: newRule.sourcePlatform as 'facebook' | 'instagram' | 'twitter',
      targetPlatform: newRule.targetPlatform as 'facebook' | 'instagram' | 'twitter',
      sourceUsername: newRule.sourceUsername,
      enabled: newRule.enabled || true,
      createdAt: new Date()
    };
    
    setRules([...rules, rule]);
    
    // Reset form
    setNewRule({
      sourcePlatform: 'facebook',
      targetPlatform: 'instagram',
      sourceUsername: '',
      enabled: true
    });
  };
  
  const handleDeleteRule = (id: string) => {
    if (confirm('确定要删除此转发规则吗？')) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };
  
  const handleToggleRule = (id: string) => {
    setRules(
      rules.map(rule => 
        rule.id === id 
          ? { ...rule, enabled: !rule.enabled } 
          : rule
      )
    );
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRule({
      ...newRule,
      [name]: value
    });
  };
  
  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'Facebook';
      case 'instagram':
        return 'Instagram';
      case 'twitter':
        return 'Twitter';
      default:
        return platform;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">添加新的自动转发规则</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="sourcePlatform" className="block text-sm font-medium text-gray-700">
              源平台
            </label>
            <select
              id="sourcePlatform"
              name="sourcePlatform"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={newRule.sourcePlatform}
              onChange={handleInputChange}
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sourceUsername" className="block text-sm font-medium text-gray-700">
              源用户名/ID
            </label>
            <input
              type="text"
              name="sourceUsername"
              id="sourceUsername"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition-colors duration-200 ease-in-out"
              placeholder="输入用户名或ID"
              value={newRule.sourceUsername}
              onChange={handleInputChange}
              autoFocus
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          
          <div>
            <label htmlFor="targetPlatform" className="block text-sm font-medium text-gray-700">
              目标平台
            </label>
            <select
              id="targetPlatform"
              name="targetPlatform"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={newRule.targetPlatform}
              onChange={handleInputChange}
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddRule}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              添加规则
            </button>
          </div>
        </div>
      </div>
      
      {rules.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {rules.map((rule) => (
              <li key={rule.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {getPlatformName(rule.sourcePlatform)} → {getPlatformName(rule.targetPlatform)}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {rule.enabled ? '已启用' : '已禁用'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`p-1 rounded-full ${
                          rule.enabled ? 'text-green-600 hover:text-green-900' : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={rule.enabled ? '禁用' : '启用'}
                      >
                        {rule.enabled ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1 text-red-600 hover:text-red-900 rounded-full"
                        title="删除"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        源用户: {rule.sourceUsername}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        创建于: {format(rule.createdAt, 'yyyy-MM-dd')}
                      </p>
                      {rule.lastForwarded && (
                        <p className="ml-4">
                          上次转发: {format(rule.lastForwarded, 'yyyy-MM-dd HH:mm')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">暂无自动转发规则</p>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          立即检查并转发
        </button>
      </div>
    </div>
  );
};

export default AutoForwardRules;