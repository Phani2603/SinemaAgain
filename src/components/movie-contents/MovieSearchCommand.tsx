"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Movie } from "@/lib/tmdb-api"
import { 
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog"
import { Search, Film, TrendingUp, Star, CalendarClock, Info, Loader2 } from "lucide-react"

interface MovieSearchCommandProps {
  children?: React.ReactNode
  recentlyViewed?: Movie[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function MovieSearchCommand({ 
  children, 
  recentlyViewed = [],
  open: controlledOpen,
  onOpenChange
}: MovieSearchCommandProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  
  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault()
        if (controlledOpen !== undefined && onOpenChange) {
          onOpenChange(!open)
        } else {
          setInternalOpen((prev) => !prev)
        }
      }
    }
    
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [controlledOpen, onOpenChange, open])
  
  // Reset search state when dialog is closed
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setSearchResults([])
      setIsLoading(false)
    }
  }, [open])

  // Optimized search logic with debounce and loading states
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    
    const fetchSearchResults = async () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setSearchResults([])
        setIsLoading(false)
        return
      }
      
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 150))
        
        const response = await fetch(`/api/movie-search?q=${encodeURIComponent(searchQuery)}`, { 
          signal,
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          
          const sortedResults = [...data.results]
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 5)
          
          setSearchResults(sortedResults)
        } else {
          console.error("Search error:", response.statusText)
          setSearchResults([])
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("Search error:", err)
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    const shouldSearch = searchQuery.trim().length >= 2
    
    if (shouldSearch) {
      setIsLoading(true)
    }
    
    const debounceTime = searchQuery.length > 5 ? 150 : 300
    
    const debounceTimer = setTimeout(() => {
      if (shouldSearch) {
        fetchSearchResults()
      } else {
        setIsLoading(false)
        setSearchResults([])
      }
    }, debounceTime)
    
    return () => {
      clearTimeout(debounceTimer)
      controller.abort()
    }
  }, [searchQuery])
  
  const handleSelectMovie = (movieId: number) => {
    setOpen(false)
    router.push(`/movies/${movieId}`)
  }
  
  const handleNavigateToCategory = (path: string) => {
    setOpen(false)
    router.push(path)
  }
  
  // Determine if we're in "search mode"
  const isSearchActive = searchQuery.trim().length >= 2
  
  // Only show the button trigger when not controlled externally
  const isControlled = controlledOpen !== undefined
  
  return (
    <>
      {!isControlled && (
        <Button
          variant="outline"
          className="relative h-10 w-full justify-start rounded-full bg-background text-sm font-normal text-muted-foreground shadow-sm border-border hover:border-primary hover:bg-muted/30 transition-all duration-200 sm:pr-12"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="inline-flex truncate">Search movies...</span>
          <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg">
          <DialogTitle className="sr-only">Search movies</DialogTitle>
          <Command
            shouldFilter={false}
            loop
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
          >
            <CommandInput 
              placeholder="Search movies..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {/* SEARCH MODE: Show search results or loading/empty states */}
              {isSearchActive && (
                <>
                  {isLoading && (
                    <div className="py-6 text-center text-sm flex flex-col items-center justify-center gap-3">
                      <div className="animate-spin">
                        <Loader2 className="h-6 w-6 text-primary/70" />
                      </div>
                      <p className="text-muted-foreground">Searching for movies...</p>
                    </div>
                  )}
                  
                  {!isLoading && searchResults.length > 0 && (
                    <CommandGroup heading="Search Results">
                      {searchResults.map((movie) => (
                        <div 
                          key={movie.id}
                          onClick={() => handleSelectMovie(movie.id)}
                          className="flex items-center gap-3 py-3 px-2 hover:bg-muted/50 cursor-pointer rounded-sm transition-colors"
                        >
                          <div className="relative flex-shrink-0 overflow-hidden rounded-md w-12 h-16 border border-muted bg-muted/30">
                            {movie.poster_path ? (
                              <Image 
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                                alt={movie.title}
                                className="object-cover"
                                fill
                                sizes="48px"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-muted">
                                <Film className="h-6 w-6 text-muted-foreground/50" />
                              </div>
                            )}
                            {movie.vote_average >= 7.5 && (
                              <div className="absolute top-0 right-0 bg-yellow-500/90 text-[10px] font-medium text-black px-1 rounded-bl-md">
                                TOP
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-medium truncate">{movie.title}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {movie.release_date && (
                                <span>{new Date(movie.release_date).getFullYear()}</span>
                              )}
                              {movie.vote_average > 0 && (
                                <>
                                  <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                    {movie.vote_average.toFixed(1)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          setOpen(false);
                          router.push(`/movies/search?q=${encodeURIComponent(searchQuery)}`);
                        }}
                        className="text-primary hover:bg-primary/10 flex items-center justify-center py-2 cursor-pointer rounded-sm transition-colors px-2"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        <span>See all results for &ldquo;{searchQuery}&rdquo;</span>
                      </div>
                    </CommandGroup>
                  )}
                  
                  {!isLoading && searchResults.length === 0 && (
                    <div className="py-6 text-center">
                      <div className="inline-flex mx-auto mb-3 p-2 rounded-full bg-muted/50">
                        <Search className="h-5 w-5 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm text-muted-foreground">No movies found for &ldquo;{searchQuery}&rdquo;</p>
                      <p className="text-xs text-muted-foreground/70 mt-2">Try another search term</p>
                    </div>
                  )}
                </>
              )}
              
              {/* DEFAULT MODE: Show categories and recently viewed when not searching */}
              {!isSearchActive && (
                <>
                  {recentlyViewed.length > 0 && (
                    <>
                      <CommandGroup heading="Recently Viewed">
                        {recentlyViewed.map((movie) => (
                          <div
                            key={movie.id}
                            onClick={() => handleSelectMovie(movie.id)}
                            className="cursor-pointer flex items-center px-2 py-1.5 rounded-sm hover:bg-accent transition-colors"
                          >
                            <Film className="mr-2 h-4 w-4" />
                            <span>{movie.title}</span>
                          </div>
                        ))}
                      </CommandGroup>
                      <CommandSeparator />
                    </>
                  )}
                  
                  <CommandGroup heading="Categories">
                    <div
                      onClick={() => handleNavigateToCategory("/movies")}
                      className="cursor-pointer flex items-center px-2 py-1.5 rounded-sm hover:bg-accent transition-colors"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      <span>All Movies</span>
                    </div>
                    <div
                      onClick={() => handleNavigateToCategory("/movies?filter=popular")}
                      className="cursor-pointer flex items-center px-2 py-1.5 rounded-sm hover:bg-accent transition-colors"
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      <span>Popular Movies</span>
                    </div>
                    <div
                      onClick={() => handleNavigateToCategory("/movies?filter=top-rated")}
                      className="cursor-pointer flex items-center px-2 py-1.5 rounded-sm hover:bg-accent transition-colors"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      <span>Top Rated Movies</span>
                    </div>
                    <div
                      onClick={() => handleNavigateToCategory("/movies?filter=upcoming")}
                      className="cursor-pointer flex items-center px-2 py-1.5 rounded-sm hover:bg-accent transition-colors"
                    >
                      <CalendarClock className="mr-2 h-4 w-4" />
                      <span>Upcoming Movies</span>
                    </div>
                  </CommandGroup>
                  
                  <CommandSeparator />
                  
                  <CommandGroup heading="Tips">
                    <CommandItem disabled>
                      <span className="text-xs">Press <kbd className="rounded border border-border bg-muted px-1.5 font-mono text-[10px]">⌘K</kbd> or <kbd className="rounded border border-border bg-muted px-1.5 font-mono text-[10px]">/</kbd> to open</span>
                    </CommandItem>
                    <CommandItem disabled>
                      <span className="text-xs">Type at least 2 characters to search</span>
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
      
      {children}
    </>
  )
}