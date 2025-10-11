import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { tmdbApi } from "@/lib/tmdb-api";
import BackButton from "@/components/ui/back-button";

interface PersonPageProps {
  params: { id: string };
}

export const revalidate = 3600;

export default async function PersonPage({ params }: PersonPageProps) {
  try {
    const person = await tmdbApi.getPersonDetails(params.id);
    const profileUrl = person.profile_path
      ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
  : "/placeholder-person.svg";

    const knownFor = (person.combined_credits?.cast || [])
      .filter((c) => c.media_type === "movie")
      .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
      .slice(0, 12);

    const formatDate = (d?: string | null) => {
      if (!d) return "N/A";
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return d;
      return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(dt);
    };

    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton fallbackHref="/movies" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          <div>
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-border">
              <Image src={profileUrl} alt={person.name} fill className="object-cover" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{person.name}</h1>
            <p className="text-muted-foreground mt-1">{person.known_for_department}</p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <dt className="text-sm text-muted-foreground">Born</dt>
                <dd className="font-medium">{formatDate(person.birthday)}{person.place_of_birth ? ` • ${person.place_of_birth}` : ''}</dd>
              </div>
              {person.deathday && (
                <div>
                  <dt className="text-sm text-muted-foreground">Died</dt>
                  <dd className="font-medium">{formatDate(person.deathday)}</dd>
                </div>
              )}
              {person.homepage && (
                <div>
                  <dt className="text-sm text-muted-foreground">Website</dt>
                  <dd>
                    <a href={person.homepage} target="_blank" rel="noreferrer" className="text-primary hover:underline">Official</a>
                  </dd>
                </div>
              )}
            </dl>

            {person.biography && (
              <section className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Biography</h2>
                <p className="leading-relaxed whitespace-pre-line">{person.biography}</p>
              </section>
            )}
          </div>
        </div>

        {knownFor.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Known for</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {knownFor.map((k) => (
                <Link href={`/movies/${k.id}`} key={`${k.media_type}-${k.id}`} className="block group">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-border">
                    <Image
                      src={k.poster_path ? `https://image.tmdb.org/t/p/w300${k.poster_path}` : "/placeholder-poster.svg"}
                      alt={k.title || k.name || "Title"}
                      fill
                      className="object-cover group-hover:opacity-90 transition"
                    />
                  </div>
                  <div className="mt-2">
                    <div className="text-sm font-medium line-clamp-2">{k.title || k.name}</div>
                    {k.character && (
                      <div className="text-xs text-muted-foreground">as {k.character}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  } catch (e) {
    console.error("Error fetching person:", e);
    notFound();
  }
}
