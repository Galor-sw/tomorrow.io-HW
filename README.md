# Weather Alert System

A comprehensive weather alert system built with Nest.js and MongoDB, designed to simulate microservices architecture within a single application.

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** (required for NestJS features)
- **MongoDB Atlas account** (cloud database)
- **Tomorrow.io API key** (weather data provider)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd tommorow.io
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp example.env .env
   ```

4. **Configure environment variables:**
   
   **Contact the maintainer to receive the `.env` file with the following variables:**
   ```bash
   # Database Configuration
   MONGODB_URI=your_mongodb_atlas_connection_string
   
   # Weather API Configuration
   TOMORROW_IO_API_KEY=your_tomorrow_io_api_key
   TOMORROW_IO_BASE_URL=https://api.tomorrow.io/v4/weather/realtime
   
   # Server Configuration
   PORT=3001
   
   # Scheduler Configuration
   SCHEDULER_CRON_EXPRESSION=EVERY_5_MINUTES
   SCHEDULER_DISABLED=false
   ```

5. **Run the application:**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production build
   npm run build
   npm run start
   ```

6. **Verify the server is running:**
   ```bash
   curl http://localhost:3001/api/parameters/names
   ```

## 🏗️ Microservices Architecture

The application is designed as a **monorepo with microservices architecture**, where each module represents a different service:

### **API Gateway Module** 
- **Purpose**: Central router for all external API calls
- **Responsibilities**: 
  - Route external requests to internal services
  - Handle authentication and authorization
  - Validate incoming requests
  - Orchestrate communication between services
- **Endpoints**: `/api/alerts`, `/api/users`, `/api/parameters`, `/api/triggered-alerts`

### **Scheduler Module**
- **Purpose**: Internal cron job service for processing alerts
- **Responsibilities**:
  - Run scheduled tasks to check weather conditions
  - Group alerts by location for efficient API calls
  - Evaluate alert thresholds against real-time weather data
  - Update alert trigger statuses
- **Configuration**: Dynamic cron expressions via environment variables

### **Notifier Module**
- **Purpose**: Notification system for triggered alerts
- **Responsibilities**:
  - Send email notifications
  - Send SMS notifications
  - Track notification delivery status
- **Status**: Ready for implementation

### **Weather Module**
- **Purpose**: Tomorrow.io API integration
- **Responsibilities**:
  - Fetch real-time weather data
  - Validate location names
  - Handle API rate limiting and errors
  - Cache weather data for efficiency

### **DAL (Data Access Layer) Module**
- **Purpose**: Centralized data access with strict separation of concerns
- **Responsibilities**:
  - Manage all database operations
  - Provide repository pattern implementation
  - Handle data validation and transformation
  - Ensure data consistency across services

## 🎯 Core Functionality

### **Alert Management**
- **Create Alerts**: Set up weather condition monitoring with custom thresholds
- **Location Validation**: Automatic validation against Tomorrow.io API
- **Parameter Support**: 20+ weather parameters (temperature, humidity, wind, etc.)
- **Dynamic Parameters**: Database-driven parameter management
- **Delete Alerts**: Remove alerts with proper cleanup

### **Weather Monitoring**
- **Real-time Data**: Fetch current weather conditions from Tomorrow.io
- **Location Support**: Global location coverage with automatic geocoding
- **Parameter Coverage**: Comprehensive weather metrics including:
  - Temperature (actual and feels-like)
  - Precipitation (rain, snow, sleet intensity)
  - Atmospheric (humidity, pressure, dew point)
  - Wind (speed, direction, gusts)
  - Visibility (cloud cover, UV index, visibility)

### **Intelligent Scheduling**
- **Dynamic Cron Jobs**: Configurable scheduling via environment variables
- **Efficient Processing**: Group alerts by location to minimize API calls
- **Status Tracking**: Monitor alert trigger status with timestamps
- **Error Handling**: Robust error handling with logging

### **Triggered Alerts System**
- **Automatic Detection**: Monitor weather conditions against alert thresholds
- **Historical Tracking**: Store all triggered alerts with detailed information
- **Status Updates**: Real-time alert status updates
- **API Access**: Complete API for triggered alerts management

### **User Management**
- **User Profiles**: Create and manage user accounts
- **Alert Association**: Link alerts to specific users
- **Data Cleanup**: Automatic cleanup when alerts are deleted

## 📡 API Endpoints

### **Alerts**
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create new alert
- `DELETE /api/alerts` - Delete alert (JSON body with `_id`)

### **Parameters**
- `GET /api/parameters` - Get all weather parameters
- `GET /api/parameters/names` - Get parameter names only
- `GET /api/parameters/categories` - Get parameters by category
- `GET /api/parameters/numeric` - Get numeric parameters only
- `GET /api/parameters/categorical` - Get categorical parameters only

### **Triggered Alerts**
- `GET /api/triggered-alerts` - Get all triggered alerts
- `GET /api/triggered-alerts?limit=10` - Get limited triggered alerts
- `GET /api/triggered-alerts/recent` - Get recent triggered alerts
- `GET /api/triggered-alerts/alert/{alertId}` - Get triggered alerts by alert ID
- `GET /api/triggered-alerts/user/{userId}` - Get triggered alerts by user ID


### **Weather Data**
- `GET /api/weather/{location}` - Get weather data for location

## 🔧 Configuration

 ### **Environment Variables**
 - `MONGODB_URI`: MongoDB Atlas connection string
 - `TOMORROW_IO_API_KEY`: Tomorrow.io API key
 - `TOMORROW_IO_BASE_URL`: Tomorrow.io API base URL (optional, has default)
 - `PORT`: Server port (default: 3001)
 - `SCHEDULER_CRON_EXPRESSION`: Cron job timing
 - `SCHEDULER_DISABLED`: Enable/disable scheduler

### **Scheduler Timing Options**
- `EVERY_MINUTE` - Every minute
- `EVERY_5_MINUTES` - Every 5 minutes
- `EVERY_10_MINUTES` - Every 10 minutes
- `EVERY_30_MINUTES` - Every 30 minutes
- `EVERY_HOUR` - Every hour
- `EVERY_DAY` - Every day
- `EVERY_WEEK` - Every week
- `EVERY_MONTH` - Every month

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```
