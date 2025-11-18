require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Helper function to parse service account key from .env
function parseServiceAccountKey() {
  // Try parsing from env var first (single-line JSON)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (e) {
      // If that fails, try reading from .env file directly (multi-line JSON)
      try {
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        
        // Find the FIREBASE_SERVICE_ACCOUNT_KEY line
        const lines = envContent.split('\n');
        let jsonStartIndex = -1;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('FIREBASE_SERVICE_ACCOUNT_KEY=')) {
            jsonStartIndex = i;
            break;
          }
        }
        
        if (jsonStartIndex !== -1) {
          // Extract JSON from the line (remove the key= part)
          let jsonString = lines[jsonStartIndex].replace(/^FIREBASE_SERVICE_ACCOUNT_KEY=\s*/, '');
          
          // If JSON continues on next lines, collect them
          let braceCount = (jsonString.match(/{/g) || []).length - (jsonString.match(/}/g) || []).length;
          let currentLine = jsonStartIndex + 1;
          
          while (braceCount > 0 && currentLine < lines.length) {
            jsonString += '\n' + lines[currentLine];
            braceCount += (lines[currentLine].match(/{/g) || []).length - (lines[currentLine].match(/}/g) || []).length;
            currentLine++;
          }
          
          return JSON.parse(jsonString.trim());
        }
      } catch (fileError) {
        // Fall through to return null
      }
    }
  }
  return null;
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    // Option 1: Use service account key file (recommended for production)
    const serviceAccount = parseServiceAccountKey();
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } 
    // Option 2: Use individual environment variables
    else if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } 
    // Option 3: Use default credentials (for Firebase hosting/Cloud Run)
    else {
      admin.initializeApp();
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ==================== USER ROUTES ====================

// GET /api/users/:userId - Get user by ID
app.get('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user can only access their own data (or is admin)
    if (req.user.uid !== userId && req.user.uid !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/users - Create or update user
app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    const { displayName, email, photoURL, preferences } = req.body;
    const userId = req.user.uid;

    const userData = {
      displayName: displayName || req.user.name || null,
      email: email || req.user.email || null,
      photoURL: photoURL || req.user.picture || null,
      preferences: preferences || {},
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(userId).set(userData, { merge: true });

    res.status(201).json({ id: userId, ...userData });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Failed to create/update user' });
  }
});

// ==================== AUTH ROUTES ====================

// POST /api/auth/login - Verify Firebase token and return user info
app.post('/api/auth/login', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // Get or create user document
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    let userData;
    if (userDoc.exists) {
      userData = { id: userDoc.id, ...userDoc.data() };
    } else {
      // Create user document if it doesn't exist
      userData = {
        id: userId,
        displayName: req.user.name || null,
        email: req.user.email || null,
        photoURL: req.user.picture || null,
        preferences: {},
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      };
      await userRef.set(userData);
    }

    res.json({
      user: userData,
      token: req.headers.authorization.split('Bearer ')[1], // Return the token for convenience
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Failed to process login' });
  }
});

// ==================== ROOM ROUTES ====================

// GET /api/rooms - Get all rooms (with optional filters)
app.get('/api/rooms', authenticateToken, async (req, res) => {
  try {
    const { roomType, color, style, limit = 50 } = req.query;
    let query = db.collection('rooms');

    // Apply filters
    if (roomType) {
      query = query.where('roomType', '==', roomType);
    }
    if (color) {
      query = query.where('color', '==', color);
    }
    if (style) {
      query = query.where('style', '==', style);
    }

    // Limit results
    query = query.limit(parseInt(limit));

    const snapshot = await query.get();
    const rooms = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ rooms, count: rooms.length });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// GET /api/rooms/:roomId - Get specific room
app.get('/api/rooms/:roomId', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const roomDoc = await db.collection('rooms').doc(roomId).get();

    if (!roomDoc.exists) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ id: roomDoc.id, ...roomDoc.data() });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// POST /api/rooms - Create a new room
app.post('/api/rooms', authenticateToken, async (req, res) => {
  try {
    const { title, uri, roomType, color, style, description, userId } = req.body;

    if (!title || !uri) {
      return res.status(400).json({ error: 'Title and image URI are required' });
    }

    const roomData = {
      title,
      uri,
      roomType: roomType || null,
      color: color || null,
      style: style || null,
      description: description || null,
      userId: userId || req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('rooms').add(roomData);

    res.status(201).json({ id: docRef.id, ...roomData });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

