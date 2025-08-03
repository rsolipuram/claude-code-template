# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack application with a React TypeScript frontend and .NET Core 9 Web API backend:

- **Backend**: `SampleApp.Api/` - .NET Core 9 Web API project
- **Frontend**: `sample-app-frontend/` - React 19 TypeScript application created with Create React App

## Development Commands

### Backend (.NET Core API)
```bash
cd SampleApp.Api
dotnet run                    # Start development server (http://localhost:5219)
dotnet build                  # Build the project
dotnet test                   # Run tests (if any exist)
dotnet restore                # Restore NuGet packages
```

The API runs on:
- **Primary**: `http://localhost:5219` (configured for frontend integration)
- HTTPS redirect available but HTTP is used for local development

### Frontend (React)
```bash
cd sample-app-frontend
npm start                     # Start development server (http://localhost:3000)
npm test                      # Run tests in watch mode  
npm run build                 # Build for production
npm install                   # Install dependencies
```

### Running Both Applications
To run the full stack:
1. Start backend: `cd SampleApp.Api && dotnet run`
2. Start frontend: `cd sample-app-frontend && npm start`
3. Backend will be on `http://localhost:5219`, frontend on `http://localhost:3000`

## Architecture Overview

### Backend Architecture (.NET 9)
- **Minimal API approach** with traditional controllers
- **Program.cs**: Single-file startup with dependency injection, CORS, and Swagger configuration
- **Controllers pattern**: REST API endpoints in `Controllers/` directory
- **Models**: Data models in `Models/` directory using records and classes
- **In-memory data storage**: Static list in controller for demo purposes (no database layer)
- **Swagger integration**: Full OpenAPI documentation with Swashbuckle.AspNetCore
- **CORS policy**: Specifically configured for React frontend at `http://localhost:3000`

### Frontend Architecture (React 19 + TypeScript)
- **Create React App** foundation with TypeScript template
- **Service layer pattern**: API communication abstracted in `src/services/`
- **Type-safe interfaces**: Shared TypeScript types in `src/types/`
- **Component-based architecture**: Reusable components in `src/components/`
- **Modern React patterns**: Functional components with hooks

### API Integration
- **Base API URL**: `http://localhost:5219/api` (configured in `productService.ts`)
- **RESTful endpoints**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **JSON communication**: Request/response bodies use JSON format
- **Error handling**: Service layer includes error handling for network failures
- **CORS enabled**: Backend configured to accept requests from React frontend

### Data Flow Architecture
1. **React Components** → call service methods
2. **Service Layer** (`productService.ts`) → makes HTTP requests to API
3. **API Controllers** → process requests and return JSON responses
4. **In-memory storage** → static data in controllers (Products list)
5. **Response handling** → services parse JSON and return typed data to components
6. **State updates** → components re-render based on API responses

### Swagger/OpenAPI Documentation
- **Swagger UI**: Available at `http://localhost:5219/swagger/index.html`
- **OpenAPI spec**: Multiple endpoints available:
  - `/swagger/v1/swagger.json` (Swashbuckle)
  - `/openapi/v1.json` (Native .NET OpenAPI)
- **Interactive testing**: Full API testing capabilities through Swagger UI

## Key Files for Development
- `SampleApp.Api/Program.cs` - Application startup, DI container, middleware pipeline, CORS policy
- `SampleApp.Api/Controllers/ProductsController.cs` - Main API endpoints with in-memory data
- `sample-app-frontend/src/services/productService.ts` - HTTP client for API communication
- `sample-app-frontend/src/types/Product.ts` - Shared TypeScript interfaces
- `SampleApp.Api/Models/Product.cs` - Backend data model definitions

## Technology Stack
- **.NET 9.0** with ASP.NET Core Web API
- **React 19** with TypeScript 4.9
- **Swashbuckle.AspNetCore 9.0** for API documentation
- **Create React App 5.0** for frontend tooling
