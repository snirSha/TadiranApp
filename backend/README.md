# backend

This is the backend service for the TadiranApp system, built with Node.js and Express. It provides RESTful APIs to support the admin panel and mobile application.

## Installation

Install the application dependencies by running:

```sh
cd TadiranApp/backend
npm install
```

Set up environment variables: 
    PORT=4000
    MONGO_URI=mongodb://localhost:27017/tadiran
    JWT_SECRET=your_jwt_secret
    ADMIN_EMAILS=admin@tadiran.com,manager@tadiran.com
    FILES_PATH=http://localhost:4000/uploads/invoices

## Development

Start the application in development mode by running:

```sh
npm run dev
```

## Production

Build the application in production mode by running:

```sh
npm run build
npm start
```

