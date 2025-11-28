# Movie Recommendation Notification System

## Overview
A complete notification system for movie recommendations that integrates seamlessly with the existing friend request notification infrastructure.

## Features Implemented

### 1. **Notification Model** (`src/models/Notification.ts`)
- **Fields:**
  - `recipient`: User who receives the notification
  - `sender`: User who sent the notification (optional)
  - `type`: Notification type (`friend_request`, `friend_accepted`, `movie_recommendation`)
  - `movieId`: TMDB movie ID (for movie recommendations)
  - `movieTitle`: Movie title (for display)
  - `message`: Optional custom message
  - `read`: Read status (boolean)
  - `createdAt`: Timestamp

- **Static Methods:**
  - `getNotifications(userId, limit)`: Get all notifications for a user
  - `getUnreadCount(userId)`: Get count of unread notifications
  - `markAllAsRead(userId)`: Mark all notifications as read

### 2. **API Endpoints**

#### `/api/notifications` (GET, POST, DELETE)
- **GET**: Fetch all notifications for authenticated user
- **POST**: Create a new notification
  - Body: `{ recipientId, type, movieId, movieTitle, message }`
- **DELETE**: Delete a notification by ID
  - Query: `?id=notificationId`

#### `/api/notifications/read` (PATCH)
- Mark notification(s) as read
- Body: `{ notificationId }` or `{ markAll: true }`

### 3. **Updated Recommendation Flow**

#### `src/app/api/recommendations/send/route.ts`
Now creates a notification when sending movie recommendations:
```typescript
await Notification.create({
  recipient: friendId,
  sender: currentUser._id,
  type: 'movie_recommendation',
  movieId,
  movieTitle: movieTitle || `Movie #${movieId}`,
  message: message || undefined,
  read: false,
});
```

#### `src/components/RecommendMovieDialog.tsx`
Updated to include `movieTitle` in the recommendation payload.

### 4. **Enhanced NotificationPanel** (`src/components/NotificationPanel.tsx`)

**New Features:**
- Displays movie recommendation notifications with:
  - Movie title and recommender name
  - Optional custom message from recommender
  - "View Recommendations" button that navigates to `/recommendations` page
  - Delete button (trash icon) to remove notification
- Handles both old-style (user) and new-style (sender) notification formats
- Click notification to navigate to recommendations page
- Individual delete for movie recommendation notifications

**UI Components:**
- Friend Request: Shows accept/decline buttons
- Movie Recommendation: Shows movie title, sender, message, and "View Recommendations" button

### 5. **Enhanced NotificationBell** (`src/components/NotificationBell.tsx`)

**New Features:**
- Fetches notifications from both:
  - `/api/notifications` (database notifications: movie recommendations)
  - `/api/friends/requests` (friend requests)
- Merges and sorts all notifications by creation date
- Polls for new notifications every 30 seconds
- Calculates unread count from both sources
- Handles notification deletion

**New Method:**
```typescript
deleteNotification(notificationId: string)
```

## User Flow

### Sending a Movie Recommendation
1. User views a movie detail page
2. Clicks "Recommend" button
3. Selects friends (up to 5) in dialog
4. Optionally adds a custom message
5. Clicks "Send Recommendation"
6. System creates:
   - MovieRecommendation record
   - Notification for each recipient

### Receiving a Movie Recommendation
1. Notification bell shows unread count badge
2. User clicks notification bell
3. Notification panel opens showing movie recommendation
4. User sees:
   - Friend's name who recommended
   - Movie title
   - Optional custom message
   - Timestamp
5. User can:
   - Click "View Recommendations" → navigates to `/recommendations` page
   - Click trash icon → deletes the notification
6. Notification is automatically created when friend sends recommendation

## Database Schema

### Notification Collection
```javascript
{
  recipient: ObjectId,        // ref: User
  sender: ObjectId,            // ref: User (optional)
  type: String,                // enum: ['friend_request', 'friend_accepted', 'movie_recommendation']
  movieId: Number,             // TMDB movie ID (optional)
  movieTitle: String,          // Movie title for display (optional)
  message: String,             // Custom message (optional, max 500 chars)
  read: Boolean,               // default: false
  createdAt: Date,             // auto-generated
  updatedAt: Date              // auto-generated
}
```

### Indexes
- `{ recipient: 1, read: 1, createdAt: -1 }` - Efficient unread queries
- `{ recipient: 1, type: 1, createdAt: -1 }` - Filter by type
- `{ recipient: 1 }` - User's notifications
- `{ createdAt: 1 }` - Timestamp ordering

## API Usage Examples

### Create a Movie Recommendation Notification
```typescript
const response = await fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientId: '507f1f77bcf86cd799439011',
    type: 'movie_recommendation',
    movieId: 550,
    movieTitle: 'Fight Club',
    message: 'You have to watch this!'
  })
});
```

### Fetch All Notifications
```typescript
const response = await fetch('/api/notifications');
const data = await response.json();
console.log(data.notifications);
```

### Delete a Notification
```typescript
const response = await fetch(`/api/notifications?id=${notificationId}`, {
  method: 'DELETE'
});
```

### Mark as Read
```typescript
const response = await fetch('/api/notifications/read', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ notificationId: '...' })
});
```

## Integration Points

### Existing Systems
- ✅ **Friend System**: Friend requests continue to work alongside movie notifications
- ✅ **Movie Recommendations**: Automatically creates notifications when recommendations are sent
- ✅ **Authentication**: Uses NextAuth session for authorization

### UI Components Used
- `@/components/ui/button` - Action buttons
- `@/components/ui/avatar` - User profile images
- `@/components/ui/badge` - Unread count display
- `framer-motion` - Smooth animations
- `lucide-react` - Icons (Bell, Film, Trash2, UserPlus, Check, X)
- `sonner` - Toast notifications

## Future Enhancements

### Potential Additions
1. **Mark as Read on View**: Auto-mark notifications as read when panel opens
2. **Push Notifications**: Browser push notifications for new recommendations
3. **Email Notifications**: Send email when friend recommends a movie
4. **Notification Preferences**: Let users choose which notifications they receive
5. **Batch Actions**: "Mark all as read" / "Delete all" buttons
6. **Notification History**: Archive instead of delete
7. **Real-time Updates**: WebSocket for instant notifications (instead of polling)
8. **Notification Grouping**: Group multiple recommendations of the same movie
9. **In-app Notification Sound**: Audio alert for new notifications
10. **Notification Filters**: Filter by type (friend requests, recommendations, etc.)

## Testing Checklist

- [ ] Send movie recommendation creates notification
- [ ] Notification appears in notification bell
- [ ] Unread count increments correctly
- [ ] Click "View Recommendations" navigates to `/recommendations`
- [ ] Delete notification removes it from list
- [ ] Unread count decrements after deletion
- [ ] Friend requests still work alongside movie notifications
- [ ] Notifications sorted by creation date (newest first)
- [ ] Polling fetches new notifications every 30 seconds
- [ ] Avatar displays correctly for sender
- [ ] Custom messages display in notification
- [ ] Timestamp formatting works (Just now, 5m ago, etc.)

## Files Created/Modified

### Created
- `src/models/Notification.ts` - Notification MongoDB model
- `src/app/api/notifications/route.ts` - CRUD operations for notifications
- `src/app/api/notifications/read/route.ts` - Mark notifications as read
- `NOTIFICATION_SYSTEM.md` - This documentation

### Modified
- `src/app/api/recommendations/send/route.ts` - Added notification creation
- `src/components/RecommendMovieDialog.tsx` - Send movieTitle with recommendation
- `src/components/NotificationPanel.tsx` - Added movie recommendation UI
- `src/components/NotificationBell.tsx` - Fetch from notifications API, handle delete

## Technical Notes

- Uses MongoDB with Mongoose ODM
- Follows Next.js 15 App Router patterns
- Server-side authentication with NextAuth
- Client-side state management with React hooks
- Optimistic UI updates for better UX
- Proper error handling and user feedback via toast notifications
- TypeScript for type safety
- Responsive design with Tailwind CSS
