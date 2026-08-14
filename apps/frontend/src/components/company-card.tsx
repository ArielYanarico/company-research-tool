import { ExternalLink } from "lucide-react"

import type { Company } from "@/lib/search"

type CompanyCardProps = {
  company: Company
}

function SiteChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
      {label}
    </span>
  )
}

function MetaItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null

  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  )
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <section className="relative w-full max-w-2xl rounded-xl border border-border bg-card text-card-foreground shadow-lg">
      <div className="flex flex-col gap-3 p-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {company.name}
          </h2>
          {typeof company.age === "number" && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              {company.age} years old
            </span>
          )}
        </div>

        {company.description && (
          <p className="text-sm text-muted-foreground">{company.description}</p>
        )}

        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
          >
            {company.website}
            <ExternalLink className="size-3.5" />
          </a>
        )}

        {company.otherSites && company.otherSites.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {company.otherSites.map((site) => (
              <SiteChip key={site} label={site} />
            ))}
          </div>
        )}

        <dl className="mt-2 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <MetaItem label="Industry" value={company.industry} />
          <MetaItem label="Company size" value={company.companySize} />
          <MetaItem label="Headquarters" value={company.headquarters} />
          <MetaItem label="Founded" value={company.founded} />
          <MetaItem label="Specialties" value={company.specialties} />
        </dl>

        {company.people && company.people.length > 0 && (
          <div className="border-t border-border pt-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              People
            </h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {company.people.map((person, index) => (
                <li key={`${person.name}-${index}`}>
                  <a
                    href={person.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground transition-colors hover:bg-accent"
                  >
                    {person.name}
                    <ExternalLink className="size-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {company.extract && (
          <p className="border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
            {company.extract}
          </p>
        )}
      </div>
    </section>
  )
}
