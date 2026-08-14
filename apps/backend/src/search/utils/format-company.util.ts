export type ClearbitSuggestion = {
  name?: string;
  domain?: string;
  logo?: string | null;
};

export type WikipediaSummary = {
  title?: string;
  description?: string;
  extract?: string;
};

export type LinkedinPerson = {
  name?: string;
  link?: string;
};

export type LinkedinCompany = {
  website?: string;
  industry?: string;
  companySize?: string;
  headquarters?: string;
  founded?: string;
  specialties?: string;
  people?: LinkedinPerson[];
};

export interface RawSearchResponse {
  clearbit?: ClearbitSuggestion[];
  wikipedia?: WikipediaSummary;
  linkedin?: LinkedinCompany;
  partialError?: Record<string, string>;
}

export interface FormattedCompany {
  name?: string;
  website?: string;
  otherSites?: string[];
  industry?: string;
  companySize?: string;
  headquarters?: string;
  founded?: string;
  age?: number;
  specialties?: string;
  people?: LinkedinPerson[];
  description?: string;
  extract?: string;
  partialError?: Record<string, string>;
}

export function formatCompanyResponse(
  raw: RawSearchResponse,
): FormattedCompany {
  const website = raw.linkedin?.website;
  const normalizedWebsite = website ? normalizeUrl(website) : undefined;

  const otherSites = (raw.clearbit ?? [])
    .map(({ domain }) => domain)
    .filter((domain): domain is string => Boolean(domain))
    .filter((domain) => normalizeUrl(domain) !== normalizedWebsite)
    .filter(
      (domain, index, domains) =>
        domains.findIndex(
          (candidate) => normalizeUrl(candidate) === normalizeUrl(domain),
        ) === index,
    );

  const foundedYear = extractFoundedYear(raw.linkedin?.founded);

  return {
    name: raw.wikipedia?.title ?? raw.clearbit?.[0]?.name,
    website,
    otherSites: otherSites.length > 0 ? otherSites : undefined,
    industry: raw.linkedin?.industry,
    companySize: raw.linkedin?.companySize,
    headquarters: raw.linkedin?.headquarters,
    founded: raw.linkedin?.founded,
    age: foundedYear ? new Date().getFullYear() - foundedYear : undefined,
    specialties: raw.linkedin?.specialties,
    people: raw.linkedin?.people,
    description: raw.wikipedia?.description,
    extract: raw.wikipedia?.extract,
    partialError: raw.partialError,
  };
}

function normalizeUrl(url: string): string {
  return url
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}

function extractFoundedYear(founded?: string): number | undefined {
  if (!founded) return undefined;
  const match = founded.match(/\d{4}/);
  return match ? Number(match[0]) : undefined;
}
