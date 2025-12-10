"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REGIONS, LANGUAGES, GENRES, MAX_FAVORITE_GENRES } from "@/lib/constants";
import { X, GripVertical, Star } from "lucide-react";

interface Language {
  code: string;
  name: string;
  isPrimary: boolean;
}

interface PreferencesEditorProps {
  initialRegion?: string;
  initialLanguages?: Language[];
  initialGenres?: number[];
  onSave?: () => void;
}

export default function PreferencesEditor({
  initialRegion = "IN",
  initialLanguages = [],
  initialGenres = [],
  onSave,
}: PreferencesEditorProps) {
  const [region, setRegion] = useState(initialRegion);
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(initialLanguages);
  const [selectedGenres, setSelectedGenres] = useState<number[]>(initialGenres);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Sync with props
  useEffect(() => {
    setRegion(initialRegion);
    setSelectedLanguages(initialLanguages);
    setSelectedGenres(initialGenres);
  }, [initialRegion, initialLanguages, initialGenres]);

  const handleAddLanguage = (langCode: string) => {
    const language = LANGUAGES.find((l) => l.code === langCode);
    if (!language) return;

    // Check if already added
    if (selectedLanguages.some((l) => l.code === langCode)) return;

    // Max 5 languages
    if (selectedLanguages.length >= 5) return;

    setSelectedLanguages([
      ...selectedLanguages,
      {
        code: language.code,
        name: language.name,
        isPrimary: selectedLanguages.length === 0, // First one is primary
      },
    ]);
  };

  const handleRemoveLanguage = (code: string) => {
    const newLanguages = selectedLanguages.filter((l) => l.code !== code);
    
    // If removed language was primary, make first language primary
    if (newLanguages.length > 0 && !newLanguages.some((l) => l.isPrimary)) {
      newLanguages[0].isPrimary = true;
    }
    
    setSelectedLanguages(newLanguages);
  };



  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newLanguages = [...selectedLanguages];
    const draggedItem = newLanguages[draggedIndex];
    newLanguages.splice(draggedIndex, 1);
    newLanguages.splice(index, 0, draggedItem);

    // First item becomes primary
    newLanguages.forEach((lang, i) => {
      lang.isPrimary = i === 0;
    });

    setSelectedLanguages(newLanguages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleToggleGenre = (genreId: number) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genreId));
    } else {
      if (selectedGenres.length >= MAX_FAVORITE_GENRES) return;
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        region,
        languages: selectedLanguages,
        favoriteGenres: selectedGenres,
      };
      
      console.log('Saving preferences:', payload);
      
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Save response:', data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to save preferences");
      }

      alert("Preferences saved successfully!");
      onSave?.();
    } catch (error) {
      console.error("Save preferences error:", error);
      alert(`Failed to save preferences: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const availableLanguages = LANGUAGES.filter(
    (l) => !selectedLanguages.some((sl) => sl.code === l.code)
  );

  return (
    <div className="space-y-6">
      {/* Region Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Region Preference</h3>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((r) => (
              <SelectItem key={r.code} value={r.code}>
                {r.flag} {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language Selection with Drag to Reorder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Language Preferences</h3>
          <span className="text-sm text-muted-foreground">
            {selectedLanguages.length}/5 selected
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Drag to reorder • First language is your primary preference
        </p>

        {/* Selected Languages - Draggable */}
        <div className="space-y-2">
          {selectedLanguages.map((lang, index) => (
            <div
              key={lang.code}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 rounded-lg border bg-card cursor-move transition-all ${
                draggedIndex === index ? "opacity-50" : ""
              } ${lang.isPrimary ? "border-primary ring-2 ring-primary/20" : ""}`}
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              
              <div className="flex-1 flex items-center gap-2">
                <span className="font-medium">{lang.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({LANGUAGES.find((l) => l.code === lang.code)?.nativeName})
                </span>
                {lang.isPrimary && (
                  <Badge variant="default" className="gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Primary
                  </Badge>
                )}
                {!lang.isPrimary && index === 0 && (
                  <Badge variant="outline">Will become primary</Badge>
                )}
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleRemoveLanguage(lang.code)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add Language */}
        {selectedLanguages.length < 5 && (
          <Select onValueChange={handleAddLanguage}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Add a language..." />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Favorite Genres */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Favorite Genres</h3>
          <span className="text-sm text-muted-foreground">
            {selectedGenres.length}/{MAX_FAVORITE_GENRES} selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id);
            const isDisabled = !isSelected && selectedGenres.length >= MAX_FAVORITE_GENRES;

            return (
              <button
                key={genre.id}
                onClick={() => handleToggleGenre(genre.id)}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isDisabled
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {genre.icon} {genre.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
