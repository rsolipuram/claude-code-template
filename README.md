# SampleApp - Full Stack Application

A full-stack application with a React TypeScript frontend and .NET Core Web API backend.

## Project Structure

```
├── SampleApp.Api/              # .NET Core Web API Backend
│   ├── Controllers/           # API Controllers
│   ├── Models/               # Data Models
│   ├── Program.cs            # Application entry point
│   └── SampleApp.Api.csproj  # Project file
├── sample-app-frontend/       # React TypeScript Frontend
│   ├── src/
│   │   ├── components/       # React Components
│   │   ├── services/         # API Services
│   │   ├── types/           # TypeScript Interfaces
│   │   └── App.tsx          # Main App Component
│   └── package.json         # Node.js dependencies
└── README.md                # This file
```

## Prerequisites

Before running the application, ensure you have the following installed:

- **.NET 9.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/9.0)
- **Node.js (v18 or higher)** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SampleApp
```

### 2. Backend Setup (.NET Core API)

Navigate to the backend directory:
```bash
cd SampleApp.Api
```

Restore dependencies and run the API:
```bash
dotnet restore
dotnet run
```

The API will be available at:
- **HTTP**: `http://localhost:5219`
- **HTTPS**: `https://localhost:7015`

### 3. Frontend Setup (React)

Open a new terminal and navigate to the frontend directory:
```bash
cd sample-app-frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm start
```

The React app will be available at:
- **Frontend**: `http://localhost:3000`

## API Documentation

### Swagger UI
Interactive API documentation is available at:
- **Swagger UI**: `http://localhost:5219/swagger/index.html`

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/{id}` | Get product by ID |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/{id}` | Update an existing product |
| DELETE | `/api/products/{id}` | Delete a product |

### Sample Product Object
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop"
}
```

## Running Both Applications

### Option 1: Manual (Recommended for Development)

1. **Start Backend** (Terminal 1):
   ```bash
   cd SampleApp.Api
   dotnet run
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd sample-app-frontend
   npm start
   ```

3. **Open Browser**:
   - Frontend: `http://localhost:3000`
   - API Documentation: `http://localhost:5219/swagger/index.html`

### Option 2: Background Processes

```bash
# Start backend in background
cd SampleApp.Api && nohup dotnet run > /dev/null 2>&1 &

# Start frontend in background
cd sample-app-frontend && nohup npm start > /dev/null 2>&1 &

# Open applications
open http://localhost:3000
open http://localhost:5219/swagger/index.html
```

## Development Commands

### Backend (.NET Core)
```bash
cd SampleApp.Api

# Run the application
dotnet run

# Build the project
dotnet build

# Run tests (if any exist)
dotnet test

# Clean build artifacts
dotnet clean
```

### Frontend (React)
```bash
cd sample-app-frontend

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Run production build locally
npm run serve
```

## Technology Stack

### Backend
- **.NET 9.0** - Web API framework
- **ASP.NET Core** - Web framework
- **Swashbuckle.AspNetCore** - Swagger/OpenAPI documentation
- **Microsoft.AspNetCore.OpenApi** - OpenAPI support

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Create React App** - Build tooling
- **CSS** - Styling

## Features

- ✅ **RESTful API** with full CRUD operations
- ✅ **Interactive API Documentation** with Swagger UI
- ✅ **Type-safe Frontend** with TypeScript
- ✅ **CORS Configuration** for cross-origin requests
- ✅ **Hot Reload** for development
- ✅ **Component-based Architecture**

## Configuration

### API Configuration
The API configuration is in `SampleApp.Api/appsettings.json` and `Program.cs`.

### Frontend Configuration
The frontend API base URL is configured in `sample-app-frontend/src/services/productService.ts`:
```typescript
const API_BASE_URL = 'http://localhost:5219/api';
```

## Troubleshooting

### Port Conflicts
If you encounter port conflicts:

**Backend**:
- Default ports: HTTP 5219, HTTPS 7015
- Change in `SampleApp.Api/Properties/launchSettings.json`

**Frontend**:
- Default port: 3000
- React will automatically suggest alternative ports if 3000 is busy

### CORS Issues
If you see CORS errors:
1. Ensure the backend is running on `http://localhost:5219`
2. Check that CORS is configured for `http://localhost:3000` in `Program.cs`

### API Connection Issues
If the frontend can't connect to the API:
1. Verify both servers are running
2. Check the `API_BASE_URL` in `productService.ts` matches the backend URL
3. Ensure no firewall is blocking the connections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for demonstration purposes.
