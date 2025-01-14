# E-commerce Website Project

## Project Description

This project is a responsive e-commerce website where customers can browse products, save favorites, log into their accounts, and make purchases. The application is built using a full-stack approach with Node.js and Express powering the backend, and Next.js with Tailwind CSS for the frontend. The system integrates with a MySQL database to manage user accounts, product inventory, and orders.

### Purpose

The primary goals of this project are:

1. To demonstrate the ability to plan, design, and implement a full-stack web application.
2. To showcase web development and database integration skills.
3. To provide hands-on experience in building a scalable and user-friendly e-commerce platform.

## Dependencies and Requirements

### Frontend

- Node.js (version 18.x or higher recommended)
- Next.js: 15.1.0
- React: 19.0.0
- Tailwind CSS: 3.4.1
- TypeScript: 5.x

Key dependencies:

- @stripe/react-stripe-js: 3.1.1
- @stripe/stripe-js: 5.4.0
- next-auth: 5.0.0-beta.25
- zod: 3.24.1

For a complete list of frontend dependencies, please refer to the `package.json` file in the frontend directory.

### Backend

- Node.js (version 18.x or higher recommended)
- Express: 4.21.2
- MySQL: 3.11.5 (mysql2 package)
- TypeScript: 5.7.2

Key dependencies:

- bcrypt: 5.1.1
- cors: 2.8.5
- dotenv: 16.4.7
- stripe: 17.5.0

For a complete list of backend dependencies, please refer to the `package.json` file in the backend directory.

## Platform Requirements

### Minimum Browser Versions

- Chrome: 91+
- Firefox: 90+
- Safari: 14+
- Edge: 91+

### Server Requirements

- Node.js: 18.x or higher
- MySQL: 8.0 or higher
- Web Server: Any server capable of running Node.js applications (e.g., Nginx, Apache with reverse proxy)

## Limitations

- The application is designed for modern web browsers and may not function correctly on older browser versions.
- Mobile responsiveness is implemented, but the user experience may vary on different device sizes.
- The Stripe integration is set up for test mode only in this version.

## External Services and Libraries

1. Stripe: Used for payment processing. Chosen for its robust API and security features.
2. Next.js: Used as the React framework for its server-side rendering capabilities and optimized performance.
3. Tailwind CSS: Selected for rapid UI development and easy customization.
4. MySQL: Chosen as the database for its reliability and widespread use in web applications.

## Setup and Installation

### Prerequisites

- Ensure Node.js and npm are installed.
- Install MySQL and create a database for the application.

### Steps

1. Clone the repository:

- git clone [https://github.com/your-repo-url](https://github.com/your-repo-url)

2. Navigate to the project folder:

- cd your-repo-name

3. Install dependencies for both frontend and backend:

- Frontend: cd frontend npm install
- Backend: cd server npm install

4. Set up environment variables:
   Create `.env` files for both frontend and backend as per the provided examples.

Backend `.env` variables:

- PORT
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME
- STRIPE_SECRET_KEY

Frontend `.env` variables:

- AUTH_SECRET (openssl rand or something similar to generate a random string)
- AUTH_URL (frontend URL with /api/auth appended)
- BACKEND_URL

5. Start the application:

- Frontend: npm run dev
- Backend: npm run dev

## License

This project is licensed under the ISC License.

Copyright © 2025 Elsa Eriksson.

For more details, see the [LICENSE](LICENSE) file.
