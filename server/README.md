# Roomify Backend API

Express server with Firebase Admin SDK for managing users and rooms.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase Admin SDK:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Generate a new private key (downloads a JSON file)
   - Copy the contents and set as `FIREBASE_SERVICE_ACCOUNT_KEY` in `.env`
   - OR set individual variables: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm run dev  # Development with auto-reload
# or
npm start    # Production
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Verify Firebase token and return user info
  - Headers: `Authorization: Bearer <firebase-id-token>`
  - Returns: User data and token

### Users
- `GET /api/users/:userId` - Get user by ID
  - Headers: `Authorization: Bearer <firebase-id-token>`
  - Returns: User document

- `POST /api/users` - Create or update user
  - Headers: `Authorization: Bearer <firebase-id-token>`
  - Body: `{ displayName, email, photoURL, preferences }`
  - Returns: Created/updated user document

### Rooms
- `GET /api/rooms` - Get all rooms (with optional filters)
  - Headers: `Authorization: Bearer <firebase-id-token>`
  - Query params: `?roomType=<type>&color=<color>&style=<style>&limit=<number>`
  - Returns: Array of rooms

- `GET /api/rooms/:roomId` - Get specific room
  - Headers: `Authorization: Bearer <firebase-id-token>`
  - Returns: Room document

- `POST /api/rooms` - Create a new room
  - Headers: `Authorization: Bearer <firebase-id-token>`
  - Body: `{ title, uri, roomType?, color?, style?, description?, userId? }`
  - Returns: Created room document

## Testing

You can test the endpoints using curl or Postman. First, get a Firebase ID token from your frontend app, then:

```bash
# Health check
curl http://localhost:3000/health

# Login (verify token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Authorization: Bearer <your-firebase-id-token>"

# Get user
curl http://localhost:3000/api/users/<userId> \
  -H "Authorization: Bearer <your-firebase-id-token>"

# Get rooms
curl http://localhost:3000/api/rooms \
  -H "Authorization: Bearer <your-firebase-id-token>"

# Create room
curl -X POST http://localhost:3000/api/rooms \
  -H "Authorization: Bearer <your-firebase-id-token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Modern Living Room", "uri": "https://example.com/image.jpg", "roomType": "Living Room"}'
```

