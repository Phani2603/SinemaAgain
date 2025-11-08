"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { User, Settings, Heart, Users, LogOut } from "lucide-react";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/auth/signin">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/signin">
          <Button size="sm">
            Get Started
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-accent">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={session.user.image || undefined} 
              alt={session.user.name || "User avatar"} 
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {session.user.name?.charAt(0).toUpperCase() || 
               session.user.email?.charAt(0).toUpperCase() || 
               "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <div className="flex items-center space-x-3 p-3">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={session.user.image || undefined} 
              alt={session.user.name || "User avatar"} 
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
              {session.user.name?.charAt(0).toUpperCase() || 
               session.user.email?.charAt(0).toUpperCase() || 
               "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 flex-1 min-w-0">
            <p className="text-sm font-semibold leading-none truncate">
              {session.user.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session.user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/watchlist" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>My Watchlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/friends" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Friends</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <div className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}