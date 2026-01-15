# Mini Social Backend

A robust RESTful API backend for a mini social media platform built with Node.js, Express, TypeScript, and MongoDB. This system supports user authentication, comment management, and social interactions (likes/dislikes).

## Features

- **User Management**

  - User registration and authentication
  - JWT-based authentication
  - Role-based access control (User & Super Admin)
  - Secure password hashing with bcrypt

- **Comment System**

  - Create, read, update, and delete comments
  - Nested comments/replies support
  - Like and dislike functionality
  - Comment ownership validation
  - Soft delete mechanism

- **Security & Validation**

  - Input validation using Zod schemas
  - Protected routes with JWT authentication
  - Role-based authorization
  - CORS configuration

- **Error Handling**
  - Global error handler
  - Custom error classes
  - Mongoose error handlers (Cast, Validation, Duplicate)
  - Zod validation error handling

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Password Hashing:** bcrypt
- **Development:** ts-node-dev
- **Code Quality:** ESLint, Prettier

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nhnasim333/mini-social-backend.git
   cd mini-social-backend
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following variables:

   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=mongodb://localhost:27017/mini-social
   # Or use MongoDB Atlas:
   # DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/mini-social

   BCRYPT_SALT_ROUNDS=10
   JWT_ACCESS_SECRET=your-super-secret-jwt-key-change-this
   JWT_ACCESS_EXPIRES_IN=7d
   ```

4. **Run the application**
   ```bash
    npm run dev
   ```
   The server should now be running at `http://localhost:5000`.

## Live Link

The backend is deployed and can be accessed at: [https://mini-social-backend.onrender.com](https://mini-social-backend.onrender.com)

## API Documentation Postman Collection

You can import the Postman collection for testing the API endpoints from the following link: [Mini Social Backend Postman Collection](https://www.postman.com/nhnasim333/workspace/mini-social-backend/documentation/23142420-4f5f4b1e-1d3b-4f7e-8f3a-5e2b6c9f4e2a)
