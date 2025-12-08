"use client";

import { MovieSearchCommand as MovieSearchCommandComponent } from './MovieSearchCommand';

interface MovieSearchCommandProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MovieSearchCommand({ open, onOpenChange }: MovieSearchCommandProps) {
  return <MovieSearchCommandComponent open={open} onOpenChange={onOpenChange} />;
}