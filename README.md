# Weather Alert System

A comprehensive weather alert system built with Nest.js and MongoDB, designed to simulate microservices architecture within a single application.

## Features

- **API Gateway Pattern** - Centralized routing for all external API calls
- **MongoDB Atlas Integration** - Cloud database with Mongoose ODM
- **Tomorrow.io Weather API** - Real-time weather data with location validation
- **Alert Management** - Create and manage weather alerts with 19 supported parameters
- **Location Validation** - Automatic validation of location names against weather API
- **Comprehensive Error Handling** - User-friendly error messages and proper HTTP status codes
- **TDD Approach** - Test-Driven Development with Jest

## Architecture

The application consists of multiple modules representing different services:

- **API Gateway Module** – Central router for all external API calls, orchestrating communication with internal services
- **Scheduler Module** – Internal cron job for processing alerts (planned)
- **Notifier Module** – Notification system for triggered alerts (planned)
- **Weather Module** – Tomorrow.io API integration for weather data
- **DAL Module** – Data Access Layer with Mongoose schemas and repositories

## Prerequisites

- Node.js 20 (see `.nvmrc`)
- MongoDB Atlas account
- Tomorrow.io API key

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

3. **Set environment variables**:
   Create a `.env` file in the root directory:
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tomorrow-hw?retryWrites=true&w=majority
   TOMORROW_IO_API_KEY=your_tomorrow_io_api_key
   PORT=3001
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

### Weather Data
- `GET /api/weather/:location` - Get real-time weather data for a location

### Alerts
- `GET /api/alerts` - List all alerts
- `POST /api/alerts` - Create a new alert with location validation

### Alert Creation Example
```json
POST /api/alerts
{
  "userId": "66b6e6f0b6c7d5e1a2b3c4d5",
  "locationText": "toronto, canada",
  "parameter": "temperature",
  "operator": ">",
  "threshold": 30,
  "description": "Hot weather alert",
  "units": "metric"
}
```

## Supported Weather Parameters

The system supports all 19 Tomorrow.io weather parameters:
- `cloudBase`, `cloudCeiling`, `cloudCover`, `dewPoint`, `freezingRainIntensity`
- `humidity`, `precipitationProbability`, `pressureSurfaceLevel`, `rainIntensity`
- `sleetIntensity`, `snowIntensity`, `temperature`, `temperatureApparent`
- `uvHealthConcern`, `uvIndex`, `visibility`, `weatherCode`, `windDirection`
- `windGust`, `windSpeed`

## Error Handling

The system provides comprehensive error handling:
- **Invalid Location**: Returns 400 Bad Request with helpful error message
- **Weather API Errors**: Returns 502 Bad Gateway with detailed error information
- **Validation Errors**: Returns 400 Bad Request with class-validator details

## Development

The project follows Test-Driven Development (TDD) practices:

1. Write tests first
2. Implement just enough code to pass tests
3. Refactor while keeping tests passing

## Project Structure

```
src/
├── main.ts                 # Application entry point with environment loading
├── app.module.ts           # Main app module
└── modules/
    ├── apiGateway/         # API Gateway - central router for all requests
    ├── scheduler/          # Cron job scheduler (planned)
    ├── notifier/           # Notification service (planned)
    ├── weather/            # Tomorrow.io API integration
    └── dal/                # Data Access Layer
        ├── types/          # TypeScript types and enums
        ├── schemas/        # Mongoose schemas
        └── repos/          # Repository pattern
```

## Next Steps

- Implement Scheduler Module for alert processing
- Implement Notifier Module for alert notifications
- Add user authentication and authorization
- Implement alert triggering logic
- Add weather data caching
- Implement alert history and analytics
