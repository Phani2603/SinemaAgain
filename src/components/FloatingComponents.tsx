"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { FloatingNav } from "@/components/ui/floating-navbar";
import FloatingAvatar from "@/components/FloatingAvatar";
import { Film, Heart, Users, Sparkles } from "lucide-react";

const navItems = [
  {
    name: "Movies",
    link: "/movies",
    icon: <Film className="h-4 w-4" />,
  },
  {
    name: "Watchlist",
    link: "/watchlist",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    name: "Friends",
    link: "/friends",
    icon: <Users className="h-4 w-4" />,
  },
  {
    name: "For You",
    link: "/recommendations",
    icon: <Sparkles className="h-4 w-4" />,
  },
];

export default function FloatingComponents() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Don't show floating components on auth pages or landing page
  const hideOnPages = ["/", "/auth/signin", "/auth/signup"];
  const shouldShow = session?.user && !hideOnPages.includes(pathname);

  if (status === "loading" || !shouldShow) {
    return null;
  }

  return (
    <>
      <FloatingNav navItems={navItems} />
      <FloatingAvatar />
    </>
  );
}