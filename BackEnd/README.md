# Ty-project Backend

This is the backend API for Ty-project, using Node.js, Express, and MongoDB Atlas.

## Setup

1. Install dependencies:

```bash
cd BackEnd
npm install
```

2. Start the server:

```bash
npm start
```

The server will run on port 5000 by default.

## API Endpoints

- `POST /api/signup` — Signup as brand or model (send all form fields in JSON)
- `POST /api/login` — Login with email/username and password

MongoDB Atlas connection is pre-configured with your credentials.
