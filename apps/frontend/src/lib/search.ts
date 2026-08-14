export type CompanyPerson = {
  name?: string
  link?: string
}

export type Company = {
  name?: string
  website?: string
  otherSites?: string[]
  industry?: string
  companySize?: string
  headquarters?: string
  founded?: string
  age?: number
  specialties?: string
  people?: CompanyPerson[]
  description?: string
  extract?: string
  partialError?: Record<string, string>
  message?: string
}

export async function searchCompany(companyName: string): Promise<Company> {
  const query = new URLSearchParams({ companyName })
  const response = await fetch(`/search?${query}`)

  const result = await response.json() as Company
  if (!response.ok) {
    throw new Error(`Search failed (${result.message ?? response.status})`)
  }

  return result
}
