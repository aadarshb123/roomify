# Firebase Setup and Deployment Guide for Roomify

## ✅ What's Been Fixed

### 1. **Firebase Configuration Files Created**
- `firebase.json` - Main Firebase configuration
- `.firebaserc` - Project configuration  
- `firestore.rules` - Database security rules (prevents guest access)
- `storage.rules` - Storage security rules (auth required for uploads)
- `firestore.indexes.json` - Database indexes for performance

### 2. **Security Rules Applied**
- ✅ **Guests can now ONLY browse rooms** (read-only)
- ✅ **Authentication required** for:
  - Uploading images
  - Liking/saving rooms
  - Creating/editing profiles
  - Commenting
  - Creating collections

### 3. **Profile Edit Fixed**
- Now saves to both Firebase Auth AND Firestore
- Bio field loads from and saves to Firestore
- Changes persist across sessions

### 4. **Image Upload Fixed**
- Images now save to BOTH `rooms` and `uploads` collections
- Uploaded images appear immediately in the feed
- Proper authentication checks in place

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Install Firebase CLI (Global)

```powershell
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```powershell
firebase login
```

This will open your browser. Log in with your Google account that has access to the Firebase project `roomify-483a2`.

### Step 3: Verify Project Connection

From the `C:\roomify` directory:

```powershell
cd C:\roomify
firebase projects:list
```

You should see `roomify-483a2` in the list.

### Step 4: Deploy Firestore Rules and Indexes

```powershell
# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes (this will create necessary database indexes)
firebase deploy --only firestore:indexes
```

### Step 5: Deploy Storage Rules

```powershell
firebase deploy --only storage
```

### Step 6: Test Your App Locally

Before deploying, test the app to ensure authentication works:

```powershell
cd roomify-app
npm start
```

**Test the following:**
1. ✅ Try browsing without login - should work
2. ✅ Try to like/save without login - should show "Login Required" alert
3. ✅ Login with email/password - should work
4. ✅ After login, like/save rooms - should work
5. ✅ Upload an image - should appear in feed immediately
6. ✅ Edit profile - changes should persist after refresh

### Step 7: Build the Web App

```powershell
cd C:\roomify\roomify-app
npx expo export:web
```

This creates a `web-build` folder with your production build.

### Step 8: Deploy to Firebase Hosting

```powershell
cd C:\roomify
firebase deploy --only hosting
```

Your app will be deployed to: `https://roomify-483a2.web.app`

---

## 📱 Full Deployment (All at Once)

To deploy everything at once:

```powershell
cd C:\roomify
firebase deploy
```

This deploys:
- Firestore rules
- Firestore indexes
- Storage rules
- Hosting (web app)

---

## 🔍 Verification Steps

### After Deployment, Verify:

1. **Visit Firebase Console**: https://console.firebase.google.com/project/roomify-483a2

2. **Check Firestore Rules**:
   - Go to Firestore Database → Rules
   - Verify rules are deployed

3. **Check Storage Rules**:
   - Go to Storage → Rules
   - Verify rules are deployed

4. **Test on Live Site**:
   - Visit your deployed URL
   - Test guest browsing (should work)
   - Test uploading without login (should fail)
   - Test login and upload (should work)

---

## 🐛 Troubleshooting

### If images don't upload:
```powershell
# Check storage rules are deployed
firebase deploy --only storage
```

### If guests can still upload/like:
```powershell
# Redeploy Firestore rules
firebase deploy --only firestore:rules
```

### If database queries are slow:
```powershell
# Deploy indexes
firebase deploy --only firestore:indexes
```

### If hosting fails:
```powershell
# Make sure web-build exists
cd C:\roomify\roomify-app
npx expo export:web

# Then deploy
cd C:\roomify
firebase deploy --only hosting
```

---

## 📊 What Each User Type Can Do Now

### **Guest Users (Not Logged In)**
✅ Browse all rooms
✅ View room details
✅ Filter and search
❌ Like/save rooms (prompted to login)
❌ Upload images (prompted to login)
❌ Comment (prompted to login)
❌ Edit profile (must login first)

### **Authenticated Users (Logged In)**
✅ Everything guests can do, PLUS:
✅ Upload images (appear immediately in feed!)
✅ Like and save rooms
✅ Create collections
✅ Comment on rooms
✅ Edit profile (changes persist!)
✅ Delete own uploads

---

## 🎯 Next Steps

1. Run `npm install -g firebase-tools`
2. Run `firebase login`
3. Run `firebase deploy`
4. Test your app!

All security rules and configurations are already set up for you!
