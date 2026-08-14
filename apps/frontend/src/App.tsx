import { useEffect, useState } from "react"

import { CompanyCard } from "@/components/company-card"
import { MagicButton } from "@/components/godui/magic-button"
import { MagicInput, type MagicInputStatus } from "@/components/godui/magic-input"
import { PixelGrid } from "@/components/godui/pixel-grid"
import { searchCompany, type Company } from "@/lib/search"

const LOGO_GRADIENT =
  "bg-clip-text text-transparent [background-image:linear-gradient(90deg,var(--rainbow-1),var(--rainbow-5),var(--rainbow-3),var(--rainbow-4),var(--rainbow-2))] [background-size:200%_100%] animate-magic-rainbow"

export function App() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<MagicInputStatus>("idle")
  const [company, setCompany] = useState<Company>()
  const [error, setError] = useState<string>()
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (status !== "success" && status !== "error") return
    const id = setTimeout(() => setStatus("idle"), 2*1000)
    return () => clearTimeout(id)
  }, [status])

  const handleSearch = async (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return

    setStatus("loading")
    setHasSearched(true)
    setCompany(undefined)
    setError(undefined)

    try {
      setCompany(await searchCompany(trimmed))
      setStatus("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setStatus("error")
    }
  }

  const handleClear = () => {
    setQuery("")
    setStatus("idle")
    setCompany(undefined)
    setError(undefined)
    setHasSearched(false)
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      <PixelGrid interactive cursorReveal="dim" />

      <main
        className={`flex w-full flex-col items-center gap-6 px-4 ${
          hasSearched ? "justify-start pb-16 pt-20" : "justify-center pb-16"
        }`}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <h1
            className={`text-5xl font-bold tracking-tight drop-shadow-[0_0_24px_var(--god-glow)] sm:text-6xl ${LOGO_GRADIENT}`}
          >
            Company Research
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Search any company and get an instant profile built from multiple
            sources.
          </p>
        </div>

        <div className="flex w-full max-w-xl flex-col items-center gap-4">
          <MagicInput
            size="lg"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for a company..."
            submitButton
            submitLabel="Search"
            status={status}
            onSubmit={handleSearch}
            className="w-full"
          />

          <div className="flex gap-4">
            <MagicButton
              size="md"
              disabled={!query.trim() || status === "loading"}
              onClick={() => handleSearch(query)}
              rainbow={false}
            >
              Search
            </MagicButton>
            <MagicButton
              size="md"
              variant="secondary"
              disabled={!hasSearched && !query}
              onClick={handleClear}
              rainbow={false}
            >
              Clear
            </MagicButton>
          </div>
        </div>

        {error && (
          <p className="max-w-xl text-center text-sm text-destructive">
            {error}
          </p>
        )}

        {company && <CompanyCard company={company} />}
      </main>
    </div>
  )
}

export default App
