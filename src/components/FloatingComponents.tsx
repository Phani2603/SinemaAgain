"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import FloatingAvatar from "@/components/FloatingAvatar";
import { LucideVideotape, FileVideo, Users, Handshake, Search } from "lucide-react";

const navItems = [
  {
    name: "Search",
    link: "/movies/search",
    icon: <Search className="h-5 w-5" />,
  },
  {
    name: "Movies",
    link: "/movies",
    icon: <LucideVideotape className="h-5 w-5" />,
  },
  {
    name: "Watchlist",
    link: "/watchlist",
    icon: <FileVideo className="h-5 w-5" />,
  },
  {
    name: "Friends",
    link: "/friends",
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: "For You",
    link: "/recommendations",
    icon: <Handshake className="h-5 w-5" />,
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
      <SidebarNav navItems={navItems} />
      <FloatingAvatar />
    </>
  );
}