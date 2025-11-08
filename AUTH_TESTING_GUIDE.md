# 🎉 Authentication Testing Guide

## ✅ **Quick Testing Steps:**

### **1. Start Development Server:**
```bash
npm run dev
```

### **2. Test Authentication Flow:**

#### **Step 1: Visit Landing Page**
```
http://localhost:3000
```
**Expected:** Landing page with updated "Get Started" buttons

#### **Step 2: Click "Get Started"**
- Click any "Get Started" button on the landing page
**Expected:** Redirects to `http://localhost:3000/auth/signin`

#### **Step 3: Test Authentication Page**
```
http://localhost:3000/auth/signin
```
**Expected:** Beautiful signin/signup form with:
- Google OAuth button
- Email/password form
- Toggle between Sign In and Sign Up

#### **Step 4: Test User Registration**
- Click "Sign up" toggle
- Fill in: Name, Email, Password
- Click "Create Account"
**Expected:** Account created + automatic signin + redirect to movies

#### **Step 5: Test Google OAuth**
- Click "Continue with Google"
**Expected:** Google OAuth flow + redirect to movies page

#### **Step 6: Test Movies Page (Protected)**
```
http://localhost:3000/movies
```
**Expected:** 
- Shows movies page if authenticated
- Redirects to signin if not authenticated
- Shows authenticated navbar with user menu

### **3. Test API Endpoints:**

#### **Check Providers:**
```
GET http://localhost:3000/api/auth/providers
```
**Expected:** Google and credentials providers

#### **Check Session:**
```
GET http://localhost:3000/api/auth/session
```
**Expected:** User session data if logged in, null if not

#### **Test Registration API:**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "name": "Test User", 
  "password": "password123"
}
```
**Expected:** User created successfully

### **4. Test User Flow:**
1. **Landing Page** → Click "Get Started"
2. **Auth Page** → Sign up with email or Google
3. **Movies Page** → Browse movies (authenticated)
4. **User Menu** → Access profile, watchlist, sign out

---

## 🎯 **Expected Behavior:**

### **Authenticated Users:**
- ✅ Can access `/movies` page
- ✅ See authenticated navbar with user menu
- ✅ Can sign out from user menu

### **Non-Authenticated Users:**
- ✅ Land on main page with "Get Started" buttons
- ✅ Redirected to `/auth/signin` when clicking buttons
- ✅ Cannot access `/movies` directly (redirected to signin)

### **Authentication Features:**
- ✅ Google OAuth signin
- ✅ Email/password registration and signin
- ✅ Automatic session management
- ✅ Protected routes
- ✅ User menu with profile options

---

## 🔧 **If Issues Occur:**

### **MongoDB Connection:**
- Check `.env.local` has correct MONGODB_URI
- Verify MongoDB Atlas cluster is running

### **Google OAuth:**
- Check Google Cloud Console authorized URLs
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

### **Environment Variables:**
- Ensure NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your local server

### **Common Fixes:**
```bash
# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev
```

---

## 🚀 **Ready to Test!**

Your authentication system now includes:
- ✅ **Complete signup/signin flow**
- ✅ **Google OAuth integration**  
- ✅ **Protected movie pages**
- ✅ **User session management**
- ✅ **Authenticated navigation**

**Start testing with `npm run dev` and follow the steps above!** 🎯