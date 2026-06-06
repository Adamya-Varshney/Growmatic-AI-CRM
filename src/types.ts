export type BusinessType = string;

export interface BusinessProfile {
  name: string;
  type: BusinessType;
  city: string;
  language: string;
}

export type LeadStatus = 'New' | 'Hot' | 'Contacted' | 'Closed' | 'Converted' | 'Lost';
export type LeadSource = 'Telegram' | 'WhatsApp' | 'Instagram' | 'Facebook' | 'Google Ads' | 'Website' | 'Meta Ad' | 'In-Store';
export type IntentScore = 'High' | 'Medium' | 'Low' | 'Archived';

export interface BusinessProfile {
  name: string;
  type: BusinessType;
  city: string;
  language: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  intentScore?: IntentScore;
  productInterest: string;
  dateAdded: string;
  city?: string;
  batchPreference?: string;
  danceStyle?: string;
  responseTime?: string;
  creativeSource?: string;
  conversationTranscript?: string;
  notes?: string;
}

export interface CampaignCreative {
  id: string;
  title: string;
  businessType: BusinessType;
  platform: 'Telegram' | 'WhatsApp' | 'Instagram' | 'Facebook' | 'Meta Ad';
  textCopy: string;
  category: string;
  predictionLabel?: 'High Click' | 'Medium Click' | 'Lower Click';
  leads?: number;
  cpl?: number;
  conversionRate?: number;
}

export interface RoiData {
  totalSpent: number;
  totalLeads: number;
  conversions: number;
  roas: number;
  costPerLead: number;
  costPerConversion: number;
}

export interface Recommendation {
  id: string;
  text: string;
  impactEstimate: string;
  actionType: string;
  status: 'pending' | 'accepted' | 'dismissed';
}