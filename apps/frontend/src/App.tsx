
import { PixelGrid } from "./components/godui/pixel-grid"

export function App() {
  return (
    <div className="relative flex w-full min-h-screen items-center justify-center overflow-hidden">
      <PixelGrid interactive cursorReveal="dim" />
      <p className="relative z-10 text-sm font-medium text-foreground">
        Move your cursor across the grid
      </p>
      <div className="font-mono text-xs text-muted-foreground">
        (Press <kbd>d</kbd> to toggle dark mode)
      </div>
    </div>
  )
}

export default App
