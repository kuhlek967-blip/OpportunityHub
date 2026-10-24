export type Province =
  | 'Gauteng'
  | 'Western Cape'
  | 'KwaZulu-Natal'
  | 'Eastern Cape'
  | 'Free State'
  | 'Limpopo'
  | 'Mpumalanga'
  | 'North West'
  | 'Northern Cape'
  | 'National / Remote';

export type OpportunityType =
  | 'shop_job'
  | 'government_circular'
  | 'learnership'
  | 'internship'
  | 'bursary'
  | 'artisan_apprenticeship'
  | 'graduate_programme'
  | 'entry_level';

export type QualificationLevel =
  | 'no_matric'
  | 'matric'
  | 'tvet_n6'
  | 'diploma'
  | 'degree'
  | 'postgraduate';

export type IndustrySector =
  | 'retail_store'
  | 'administration'
  | 'technology'
  | 'engineering'
  | 'healthcare'
  | 'finance'
  | 'education'
  | 'logistics'
  | 'artisan_trades'
  | 'security_enforcement'
  | 'agriculture';

export type ScamRiskLevel = 'verified_official' | 'low_risk' | 'under_review' | 'flagged_scam';

export interface ScamCheckResult {
  rule: string;
  passed: boolean;
  severity: 'low' | 'medium' | 'critical';
  details: string;
}

export interface ScamAssessment {
  riskLevel: ScamRiskLevel;
  safetyScore: number; // 0 - 100
  checks: ScamCheckResult[];
  scamWarningNotes?: string;
  verifiedGovDomain: boolean;
  freeEmailDetected: boolean;
  feeRequested: boolean;
}

export interface OfficialSource {
  id: string;
  name: string;
  type: 'DPSA Circular' | 'Provincial Gazette' | 'SETA Accredited' | 'YES4Youth' | 'SOE / Corporate' | 'Higher Education';
  domain: string;
  circularRef?: string;
  feedUrl: string;
  verifiedOfficial: boolean;
  publishedDate: string;
}

export interface DuplicateMeta {
  isDuplicate: boolean;
  canonicalId?: string;
  matchedSourcesCount: number;
  detectedOnFeeds: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  department?: string;
  referenceNumber: string;
  opportunityType: OpportunityType;
  province: Province;
  city: string;
  qualification: QualificationLevel;
  sector: IndustrySector;
  stipendOrSalary: string;
  closingDate: string; // ISO format YYYY-MM-DD
  postedDate: string;
  source: OfficialSource;
  scamAssessment: ScamAssessment;
  duplicateMeta: DuplicateMeta;
  summary: string;
  requirements: string[];
  duties: string[];
  applicationMode: 'z83_form' | 'online_portal' | 'email' | 'in_person';
  applicationEmail?: string;
  applicationPortalUrl?: string;
  z83Required: boolean;
  handDeliveryAddress?: string;
  enquiriesContact?: {
    name: string;
    phone?: string;
    email?: string;
  };
  featured?: boolean;
}

export interface MonitoredFeed {
  id: string;
  name: string;
  category: string;
  url: string;
  format: 'RSS' | 'JSON API' | 'PDF Circular Scraper';
  schedule: string;
  lastChecked: string;
  nextScheduledCheck: string;
  status: 'active' | 'syncing' | 'paused';
  totalIngested: number;
  duplicatesBlocked: number;
  scamsQuarantined: number;
  officialAuthority: string;
}

export interface SyncLogEvent {
  id: string;
  timestamp: string;
  feedName: string;
  action: 'ingested' | 'duplicate_merged' | 'scam_quarantined' | 'closing_date_updated';
  details: string;
  status: 'success' | 'warning' | 'flagged';
}
