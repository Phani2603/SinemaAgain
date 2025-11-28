"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { User, Settings, Heart, Users, LogOut, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import NotificationBell from "./NotificationBell";

export default function FloatingAvatar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-6 right-6 z-[5001]"
      >
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </motion.div>
    );
  }

  if (!session?.user) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-6 right-6 z-[5001]"
      >
        <div className="flex items-center space-x-2">
          <Link href="/auth/signin">
            <Button variant="outline" size="sm" className="backdrop-blur-sm bg-background/80">
              Sign In
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-6 right-6 z-[5001] flex flex-col sm:flex-row items-end gap-3"
    >
      {/* Notification Bell - Desktop: left of avatar, Mobile: below avatar */}
      <div className="order-2 sm:order-1">
        <NotificationBell />
      </div>

      {/* Avatar Dropdown - Desktop: right side, Mobile: above bell */}
      <div className="order-1 sm:order-2">
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-12 w-12 rounded-full p-0 hover:bg-accent backdrop-blur-sm bg-background/80 border border-border/50 shadow-lg"
          >
            <Avatar className="h-11 w-11">
              <AvatarImage 
                src={session.user.image || undefined} 
                alt={session.user.name || "User avatar"} 
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                {session.user.name?.charAt(0).toUpperCase() || 
                 session.user.email?.charAt(0).toUpperCase() || 
                 "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-64 mr-4 backdrop-blur-sm bg-background/95" 
          align="end" 
          forceMount
        >
          {/* User Info Section */}
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
          
          {/* Navigation Items */}
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
          
          {/* Sign Out */}
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
      </div>
    </motion.div>
  );
}
