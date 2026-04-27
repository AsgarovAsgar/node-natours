# Natours - Tour Booking Application

A full-stack tour booking platform built with Node.js, Express, and MongoDB. Browse tours, make secure bookings with Stripe, and share reviews.

## Features

- Browse and search tours with filtering/sorting
- Secure bookings with Stripe payment integration
- User authentication with JWT
- Review and rating system (5-star)
- User profile management with photo uploads
- Role-based access control (user, guide, lead-guide, admin)
- Tour management with image processing
- Geospatial queries for location-based searches
- Email notifications (Nodemailer + SendGrid)

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Stripe
**Frontend:** Pug templates, Parcel bundler, Axios
**Security:** Helmet, Rate limiting, CORS, XSS protection, NoSQL injection prevention
**Tools:** Multer (file uploads), Sharp (image processing), Morgan (logging)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/AsgarovAsgar/node-natours.git
cd node-natours
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (create `config.env` file):

```
NODE_ENV=development
PORT=3000
DATABASE=<your-mongodb-connection-string>
DATABASE_PASSWORD=<your-database-password>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_USERNAME=<email-username>
EMAIL_PASSWORD=<email-password>
EMAIL_HOST=<email-host>
EMAIL_PORT=<email-port>
EMAIL_FROM=<sender-email>
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
```

4. Run the application:

```bash
# Development mode
npm run dev

# Production mode
npm start

# With debugging
npm run debug
```

5. Build frontend assets:

```bash
# Watch mode for development
npm run watch:js

# Production build
npm run build:js
```

## Architecture

- **MVC Pattern** - Separated controllers, routes, models, and views
- **Middleware Chain** - Request flows through security and utility middleware
- **Global Error Handling** - Centralized error handler for consistent API responses
- **Factory Pattern** - Generic CRUD operations via `handlerFactory.js`
- **Query Building** - `APIFeatures` class for filtering, sorting, pagination, field limiting
- **Schema Middleware** - Pre/post hooks for data validation and relationships
- **Virtual Properties** - Dynamic fields like virtual reviews on tours
- **Image Processing Pipeline** - Automatic resizing and optimization of uploaded images

## Security Features

- JWT token-based authentication with HTTP-only cookies
- Password hashing with bcryptjs (salt rounds: 12)
- Email-based password reset with time-limited tokens
- Rate limiting to prevent brute-force attacks
- Helmet for secure HTTP headers
- CORS configuration
- XSS and NoSQL injection protection
- HTTP Parameter Pollution prevention
- Protected routes with role-based access control
- Stripe webhook signature verification

## Requirements

- Node.js ^16.13.0
- MongoDB database
- Stripe account for payment processing
- Email service (SendGrid recommended for production)

## License

ISC
