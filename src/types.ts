export interface UserProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  province: string;
  district: string;
  village: string;
  landSize: number;
  farmingType: string;
  soilType: string;
  waterSource: string;
  mainCrops: string[];
  preferredLanguage: 'en' | 'ur';
  isPremium: boolean;
  isAdmin: boolean;
}

export interface MandiPrice {
  id: string;
  crop: string;
  city: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  eligibility: string;
  eligibilityUrdu: string;
  benefits: string;
  benefitsUrdu: string;
  officialLink: string;
  department: string;
  isVerified: boolean;
  category: 'subsidy' | 'loan' | 'insurance' | 'equipment';
}

export interface DiseaseAnalysis {
  diseaseName: string;
  reason: string;
  treatment: string;
  organicTreatment: {
    method: string;
    dosage: string;
    preparation: string;
  };
  recommendedPesticide: string;
  preventionTips: string[];
}
