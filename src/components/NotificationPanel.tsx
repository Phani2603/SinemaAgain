"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, UserPlus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Notification {
  id: string;
  type: "friend_request" | "friend_accepted";
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
  onAccept: (id: string, name: string) => void;
  onReject: (id: string) => void;
  loading: boolean;
}

export default function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onAccept,
  onReject,
  loading,
}: NotificationPanelProps) {



  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[5002]"
              onClick={onClose}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] max-w-[90vw] bg-background/80 backdrop-blur-xl border-l border-border/50 shadow-2xl z-[5002] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Notifications</h2>
                    <p className="text-sm text-muted-foreground">
                      {unreadCount} new
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="p-4 rounded-full bg-muted/50 mb-4">
                      <Bell className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">All caught up!</h3>
                    <p className="text-sm text-muted-foreground">
                      No new notifications
                    </p>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-colors"
                    >
                      <div className="flex gap-3">
                        <Avatar className="w-10 h-10 shrink-0">
                          <AvatarImage src={notification.user.image} alt={notification.user.name} />
                          <AvatarFallback>
                            {notification.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {notification.type === 'friend_request' && (
                            <>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <UserPlus className="w-4 h-4 text-primary shrink-0" />
                                  <p className="font-medium text-sm">Friend Request</p>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatTime(notification.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                <strong className="text-foreground">{notification.user.name}</strong> sent you a friend request
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => onAccept(notification.id, notification.user.name)}
                                  disabled={loading}
                                  className="flex-1"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onReject(notification.id)}
                                  disabled={loading}
                                  className="flex-1"
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer with Close Button */}
              <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-md">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </>
        )}
    </AnimatePresence>
  );
}
