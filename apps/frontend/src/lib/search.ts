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
}

export async function searchCompany(companyName: string): Promise<Company> {
  const query = new URLSearchParams({ companyName })
  const response = await fetch(`/search?${query}`)

  if (!response.ok) {
    throw new Error(`Search failed (${response.status})`)
  }

  return response.json() as Promise<Company>
}
