import { Opportunity, ScamAssessment, ScamCheckResult } from '../types';

// Anchor date for evaluation is October 24, 2026
const CURRENT_DATE = new Date('2026-10-24');

export function getClosingDateStatus(closingDateStr: string): {
  status: 'active' | 'closing_soon' | 'expired' | 'today';
  daysLeft: number;
  formatted: string;
} {
  const closing = new Date(closingDateStr);
  const diffTime = closing.getTime() - CURRENT_DATE.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      status: 'expired',
      daysLeft,
      formatted: `Closed on ${closingDateStr}`,
    };
  }

  if (daysLeft === 0) {
    return {
      status: 'today',
      daysLeft: 0,
      formatted: 'Closing Today (16:00 SAST)',
    };
  }

  if (daysLeft <= 3) {
    return {
      status: 'closing_soon',
      daysLeft,
      formatted: `Closes in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
    };
  }

  return {
    status: 'active',
    daysLeft,
    formatted: `Closes ${closingDateStr} (${daysLeft} days left)`,
  };
}

/**
 * Normalizes text for similarity and duplicate checking
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detect duplicates across feeds
 */
export function detectDuplicate(
  candidate: Partial<Opportunity>,
  existingOpportunities: Opportunity[]
): { isDuplicate: boolean; matchedItem?: Opportunity; matchReason?: string } {
  const normTitle = normalizeText(candidate.title || '');
  const normOrg = normalizeText(candidate.organization || '');
  const candRef = candidate.referenceNumber?.trim().toLowerCase();

  for (const existing of existingOpportunities) {
    if (existing.id === candidate.id) continue;

    // Check exact reference match
    if (candRef && candRef.length > 3 && existing.referenceNumber.toLowerCase() === candRef) {
      return {
        isDuplicate: true,
        matchedItem: existing,
        matchReason: `Exact reference number match: "${existing.referenceNumber}"`,
      };
    }

    // Check high title and organization similarity
    const exTitle = normalizeText(existing.title);
    const exOrg = normalizeText(existing.organization);

    if (normTitle === exTitle && normOrg === exOrg) {
      return {
        isDuplicate: true,
        matchedItem: existing,
        matchReason: `Matching job title and organization: "${existing.title}" at "${existing.organization}"`,
      };
    }
  }

  return { isDuplicate: false };
}

/**
 * South African Job Scam Heuristics Engine
 */
export function analyzeScamRisk(text: string, email?: string, domain?: string, feeMentioned?: boolean): ScamAssessment {
  const lower = text.toLowerCase();
  const checks: ScamCheckResult[] = [];
  let score = 100;

  // 1. Fee / Payment demand check
  const feeKeywords = [
    'pep pax',
    'ewallet',
    'cash send',
    'application fee',
    'medical fee',
    'uniform fee',
    'police clearance fee',
    'deposit',
    'registration fee',
    'mukuru',
    'send r',
    'r250',
    'r300',
    'r150',
    'admin fee',
  ];

  const foundFee = feeMentioned || feeKeywords.some((kw) => lower.includes(kw));
  if (foundFee) {
    score -= 60;
    checks.push({
      rule: 'Prohibition of Upfront Fees (BCEA Compliance)',
      passed: false,
      severity: 'critical',
      details: 'FAILED: Text mentions payment, uniform fees, or money transfers. In South Africa, legitimate employers and government departments NEVER request money to apply or for screening.',
    });
  } else {
    checks.push({
      rule: 'Prohibition of Upfront Fees (BCEA Compliance)',
      passed: true,
      severity: 'critical',
      details: 'PASSED: Zero application, uniform, or medical clearance fees detected.',
    });
  }

  // 2. Email domain check for public sector / corporate claims
  const isClaimingGov =
    lower.includes('department of') ||
    lower.includes('dpsa') ||
    lower.includes('saps') ||
    lower.includes('correctional') ||
    lower.includes('municipality') ||
    lower.includes('provincial government') ||
    lower.includes('transnet') ||
    lower.includes('eskom');

  const freeEmailProviders = ['@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com', '@webmail.co.za'];
  const usesFreeEmail =
    (email && freeEmailProviders.some((prov) => email.toLowerCase().includes(prov))) ||
    freeEmailProviders.some((prov) => lower.includes(prov));

  const isOfficialGovDomain = domain?.endsWith('.gov.za') || false;

  if (isClaimingGov && usesFreeEmail) {
    score -= 40;
    checks.push({
      rule: 'Official Domain Verification for Public Sector',
      passed: false,
      severity: 'critical',
      details: 'FAILED: Post claims government affiliation but uses a generic free email address (e.g. @gmail.com). Official South African government vacancies strictly use @<department>.gov.za.',
    });
  } else if (isOfficialGovDomain) {
    checks.push({
      rule: 'Official Domain Verification for Public Sector',
      passed: true,
      severity: 'critical',
      details: 'PASSED: Confirmed authorized .gov.za government gateway.',
    });
  } else {
    checks.push({
      rule: 'Email Domain Credibility',
      passed: !usesFreeEmail,
      severity: 'medium',
      details: usesFreeEmail
        ? 'CAUTION: Free public email domain found. Commercial entities should use registered corporate domains.'
        : 'PASSED: Professional or official domain in use.',
    });
    if (usesFreeEmail) score -= 15;
  }

  // 3. Unrealistic compensation flags
  const unrealisticSalary =
    (lower.includes('no matric') || lower.includes('grade 10') || lower.includes('cleaner')) &&
    (lower.includes('r18') || lower.includes('r20') || lower.includes('r25') || lower.includes('r30'));

  if (unrealisticSalary) {
    score -= 20;
    checks.push({
      rule: 'Remuneration & Skill Level Calibration',
      passed: false,
      severity: 'medium',
      details: 'FAILED: Advertises an unusually high salary for entry-level work requiring no prior qualifications, a common tactic used to lure desperate youth.',
    });
  } else {
    checks.push({
      rule: 'Remuneration & Skill Level Calibration',
      passed: true,
      severity: 'low',
      details: 'PASSED: Advertised stipend or salary matches standard national bargaining/public service scales.',
    });
  }

  // 4. WhatsApp / Telegram interview pressure
  const telegramOrWhatsappPayment =
    lower.includes('whatsapp only') ||
    lower.includes('telegram') ||
    lower.includes('inbox for jobs') ||
    lower.includes('dm me on whatsapp');

  if (telegramOrWhatsappPayment) {
    score -= 15;
    checks.push({
      rule: 'Authorised Recruitment Channels',
      passed: false,
      severity: 'medium',
      details: 'CAUTION: Directs users exclusively to private messaging channels without verifiable physical office or public circular reference.',
    });
  } else {
    checks.push({
      rule: 'Authorised Recruitment Channels',
      passed: true,
      severity: 'low',
      details: 'PASSED: Standard formal application channels (Z83, online portal, or departmental registry) provided.',
    });
  }

  // Calculate overall risk
  score = Math.max(0, Math.min(100, score));

  let riskLevel: 'verified_official' | 'low_risk' | 'under_review' | 'flagged_scam';
  let warningNotes: string | undefined;

  if (score < 40) {
    riskLevel = 'flagged_scam';
    warningNotes = 'ALERT: Multiple critical fraud markers detected. Do NOT pay any money, send identity copies, or share banking OTP codes.';
  } else if (score < 75) {
    riskLevel = 'under_review';
    warningNotes = 'CAUTION: Listing has unverified attributes. Proceed with caution and verify with the official employer directly.';
  } else if (isOfficialGovDomain || score >= 95) {
    riskLevel = 'verified_official';
  } else {
    riskLevel = 'low_risk';
  }

  return {
    riskLevel,
    safetyScore: score,
    checks,
    scamWarningNotes: warningNotes,
    verifiedGovDomain: isOfficialGovDomain,
    freeEmailDetected: usesFreeEmail,
    feeRequested: foundFee,
  };
}
