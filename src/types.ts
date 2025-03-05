export interface ScheduledPost {
  content: string;
  scheduledTime: string;
  platforms: string[];
  attachQRCode: boolean;
  targetURL?: string;
  useShortLink?: boolean;
  shortLinkAlias?: string;
  repeatSchedule?: 'none' | 'daily' | 'weekly' | 'monthly';
  endDate?: string;
  subscriptionURL?: string;
  autoForward?: boolean;
  accountId?: string;
}

export interface QRCodeData {
  url: string;
  size: number;
  bgColor: string;
  fgColor: string;
  includeMargin: boolean;
  logoURL?: string;
  logoFile?: File;
}

export interface ShortenedURL {
  originalURL: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
}

export interface SocialMediaAccount {
  platform: 'facebook' | 'instagram' | 'twitter' | 'tiktok';
  username: string;
  accountId: string;
  connected: boolean;
  lastSync?: Date;
}

export interface AutoForwardRule {
  id: string;
  sourcePlatform: 'facebook' | 'instagram' | 'twitter' | 'tiktok';
  targetPlatform: 'facebook' | 'instagram' | 'twitter' | 'tiktok';
  sourceUsername: string;
  enabled: boolean;
  createdAt: Date;
  lastForwarded?: Date;
}