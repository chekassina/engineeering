export interface Service {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  iconName: string;
  capabilities: string[];
  imageUrl: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  client: string;
  year: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceCategory: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'qualified' | 'disqualified' | 'contacted';
  aiQualification?: {
    score: number; // 0 to 100
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    summary: string;
    suggestedResponse: string;
    estimatedValue: string;
    keyNeeds: string[];
  };
}

export interface CompetitorReport {
  id: string;
  competitorName: string;
  competitorUrl: string;
  industry: string;
  strengths: string[];
  weaknesses: string[];
  adStrategyRecommendations: string;
  createdAt: string;
}

export interface SeoProject {
  id: string;
  serviceId: string;
  serviceTitle: string;
  targetKeywords: string[];
  metaDescription: string;
  contentIdeas: { title: string; type: string; brief: string }[];
  onPageRecommendations: string[];
  createdAt: string;
}

export interface AdCampaign {
  id: string;
  campaignName: string;
  serviceCategory: string;
  targetAudience: string;
  budget: string;
  platforms: {
    facebook?: { headline: string; text: string; targeting: string };
    google?: { headline: string; description: string; keywords: string[] };
    linkedin?: { headline: string; text: string; audience: string };
    tiktok?: { hook: string; body: string; visualConcept: string };
  };
  createdAt: string;
}
