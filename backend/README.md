# TradeAI Backend

This is the backend for the TradeAI application, built with Node.js, Express, and MongoDB. It provides a RESTful API for managing trades, user authentication, and trade analytics.

## Features

- User authentication (register, login, logout)
- CRUD operations for trades
- Trade statistics and analytics
- File upload for trade screenshots
- Pagination, filtering, and sorting
- Security best practices (JWT, rate limiting, etc.)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/tradeai.git
   cd tradeai/backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file with your configuration.

4. Start the development server
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/tradeai

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# File Upload
MAX_FILE_UPLOAD=10
FILE_UPLOAD_PATH=./uploads
```

## API Documentation

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/logout` - Logout user / clear cookie

### Trades

- `GET /api/v1/trades` - Get all trades (supports filtering, sorting, pagination)
- `GET /api/v1/trades/:id` - Get single trade
- `POST /api/v1/trades` - Create new trade
- `PUT /api/v1/trades/:id` - Update trade
- `DELETE /api/v1/trades/:id` - Delete trade
- `PUT /api/v1/trades/:id/photo` - Upload trade photo
- `GET /api/v1/trades/stats` - Get trade statistics
- `GET /api/v1/trades/calendar` - Get trades by month for calendar view

## Development

- Run in development mode: `npm run dev`
- Run in production: `npm start`

## Deployment

1. Set `NODE_ENV` to `production` in your `.env` file
2. Make sure MongoDB is properly configured
3. Use a process manager like PM2 to keep the application running

```bash
npm install -g pm2
pm2 start server.js
```

## Security

- Uses Helmet for setting various HTTP headers
- Data sanitization against NoSQL injection and XSS
- Rate limiting
- HTTP parameter pollution protection
- JWT authentication
- Secure headers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
