# Weather Alert System

A weather alert system built with Nest.js and MongoDB, designed to simulate microservices architecture within a single application.

## Architecture

The application consists of multiple modules representing different services:

- **API Module** – REST endpoints for creating and listing alerts
- **Scheduler Module** – Internal cron job for processing alerts
- **Notifier Module** – (Planned) Notification system for triggered alerts
- **Weather Module** – Tomorrow.io API integration for weather data
- **DAL Module** – Data Access Layer with Mongoose schemas and repositories

## Prerequisites

- Node.js 20 (see `.nvmrc`)
- MongoDB (local or MongoDB Atlas)

## Getting Started

1. **Install Node.js 20**:
   ```bash
   # Using Homebrew (macOS)
   brew install node@20
   export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
   
   # Or using nvm
   nvm use
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set environment variables** (optional):
   ```bash
   export MONGODB_URI="mongodb://localhost:27017/weather-alerts"
   ```

4. **Run the application**:
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Build and run production
   npm run build
   npm run start
   ```

5. **Run tests**:
   ```bash
   # Unit tests
   npm test
   
   # E2E tests
   npm run test:e2e
   
   # Test coverage
   npm run test:cov
   ```

## API Endpoints

- `GET /alerts` - List all alerts
- `POST /alerts` - Create a new alert

## Development

The project follows Test-Driven Development (TDD) practices:

1. Write tests first
2. Implement just enough code to pass tests
3. Refactor while keeping tests passing

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Main app module
└── modules/
    ├── api/                # REST API endpoints
    ├── scheduler/          # Cron job scheduler
    ├── notifier/           # Notification service
    ├── weather/            # Weather API integration
    └── dal/                # Data Access Layer
        ├── schemas/        # Mongoose schemas
        └── repos/          # Repository pattern
```

## Next Steps

This is the infrastructure setup. The next phase will involve implementing business logic using TDD for each module.
