import Image from "next/image";

export default function TMDBAttribution() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Powered by</span>
      <a 
        href="https://www.themoviedb.org/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1 hover:text-primary transition-colors"
      >
        <Image 
          src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
          alt="TMDB"
          width={50}
          height={20}
        />
        The Movie Database
      </a>
    </div>
  );
}