"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ModeToggleProps {
  onThemeChange?: (theme: string) => void
}

export function ModeToggle({ onThemeChange }: ModeToggleProps) {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Only render the toggle on the client to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (theme: string) => {
    if (onThemeChange) {
      onThemeChange(theme)
    } else {
      setTheme(theme)
    }
  }

  if (!mounted) {
    return <div className="w-10 h-10" /> // Placeholder with same size to avoid layout shift
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" sideOffset={8}>
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}