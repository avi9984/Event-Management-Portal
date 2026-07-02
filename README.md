# Event Management Portal Backend

A production-ready backend for an **Event Management Portal** built using **Node.js, Express.js, Prisma ORM, and PostgreSQL**.

## Features

### Authentication

* JWT Authentication
* Secure password hashing using bcrypt
* Single active session per user
* Real-time force logout using Socket.IO
* Protected routes
* Login rate limiting

### Category Management

* Create Category
* Update Category
* Delete Category
* Nested Categories (Parent/Child)
* Category Tree API

### Event Management

* Create Event
* Upload Multiple Images
* Publish Event at Scheduled Time
* List Published Events
* Timezone-aware Event Listing
* Soft Delete
* Permanent Delete
* Search & Pagination

### Admin

* Dashboard Statistics
* View All Events
* View Event Creator Details
* View Event Media
* Filter Events

  * Published
  * Waiting
  * Deleted
* Permanent Delete

---

# Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* JWT
* Socket.IO
* Multer
* Luxon
* Zod
* bcrypt

---

# Project Structure

```text
src
│
├── config
├── controllers
├── middlewares
├── routes
├── services
├── sockets
├── uploads
├── utils
├── validations
├── app.js
└── server.js

prisma
│
├── schema.prisma
└── seed.js
```

---

# Prerequisites

* Node.js >= 20
* PostgreSQL
* npm

---

# Installation

Clone the repository.

```bash
git clone <repository-url>
```

Navigate to the project.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

DATABASE_URL="postgresql://postgres:password@localhost:5432/event_management"

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=1d

REFRESH_SECRET=your_refresh_secret

CLIENT_URL=http://localhost:3000
```

---

# Database Setup

Generate Prisma Client.

```bash
npx prisma generate
```

Run migrations.

```bash
npx prisma migrate dev --name init
```

Seed the admin user.

```bash
node prisma/seed.js
```

---

# Run the Application

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

# Default Admin Credentials

```
Username : admin

Password : Admin@123
```

> Change the password after the first login.

---

# API Endpoints

## Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | `/api/auth/login`  |
| POST   | `/api/auth/logout` |

---

## Categories

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | `/api/categories`     |
| GET    | `/api/categories`     |
| PUT    | `/api/categories/:id` |
| DELETE | `/api/categories/:id` |

---

## Events

| Method | Endpoint                    |
| ------ | --------------------------- |
| POST   | `/api/events`               |
| GET    | `/api/events`               |
| DELETE | `/api/events/:id`           |
| DELETE | `/api/events/:id/permanent` |

---

## Admin

| Method | Endpoint                          |
| ------ | --------------------------------- |
| GET    | `/api/admin/dashboard`            |
| GET    | `/api/admin/events`               |
| DELETE | `/api/admin/events/:id/permanent` |

---

# Authentication

Pass JWT token in the Authorization header.

```
Authorization: Bearer <access_token>
```

---

# Event Listing

Send the user's timezone using the request header.

```
X-Timezone: Asia/Kolkata
```

Example

```
GET /api/events?page=1&limit=10&search=music
```

---

# Image Upload

Use **multipart/form-data**.

Field name:

```
photos
```

Supports multiple image uploads.

---

# Event Status Logic

Published Event

```
publishAt <= Current UTC Time
```

Waiting Event

```
publishAt > Current UTC Time
```

Deleted Event

```
deletedAt IS NOT NULL
```

---

# Single Login

Only one active session is allowed per user.

If the same user logs in from another browser or device:

* Previous session is invalidated.
* Previous browser receives a real-time `forceLogout` event through Socket.IO.
* User is redirected to the login page.

---

# Pagination

Example

```
GET /api/events?page=1&limit=10
```

---

# Search

Example

```
GET /api/events?search=music
```

---

# Timezone Support

All timestamps are stored in **UTC**.

Responses are converted to the user's timezone using the `X-Timezone` request header.

---

# Security

* JWT Authentication
* Password Hashing (bcrypt)
* Express Rate Limiter
* Helmet
* Input Validation using Zod
* Protected Routes
* Single Active Session

---

# Future Improvements

* Refresh Token Rotation
* Email Verification
* Forgot Password
* Cloud Storage (AWS S3 / Cloudinary)
* Swagger API Documentation
* Docker Support
* Unit & Integration Tests
* Redis-based Socket.IO Adapter for horizontal scaling

---
