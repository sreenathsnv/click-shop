# ClickShop Frontend

## Overview
This project implements the frontend for an e-commerce platform built with Angular. It serves as the user interface layer that interacts with the backend microservices for authentication, cart management, order processing, and product management powered by Spring Boot. The frontend is designed to provide a seamless shopping experience through RESTful API integration with the backend services.

## Project Structure

- **src/**: Contains Angular components, services, modules, and assets
- **angular.json**: Configuration file for Angular CLI
- **package.json**: Defines project dependencies and scripts

## Prerequisites

- Node.js (v16 or later)
- npm (for package management)
- Angular CLI (`npm install -g @angular/cli`)
- Git (for version control)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Frontend
```bash
ng serve
```
The application will be available at http://localhost:4200

### 4. Build for Production
```bash
ng build --prod
```
Build artifacts will be stored in the `dist/` directory.

## Services and Ports

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:4200 | Default development server |
| Backend API | http://localhost:8183, etc. | Connection to backend microservices |

## Backend Repository
The backend for this project can be found at: https://github.com/sreenathsnv/clickshop-backend/

## Notes

- Ensure backend services are running before starting the frontend (use `run.bat docker` from the backend repository)
- API endpoints are configured to connect to http://localhost:8183 and other ports as defined in the backend
- Environment variables for API URLs can be configured in the `src/environments/` files

## Administrator Access

### Admin Credentials
For demonstration purposes, an administrator account can be used with the following credentials:

- **Username**: admin
- **Password**: admin@123secure

### Manual Admin Creation
If the admin user is not created automatically in the backend, you can manually create it:

#### Using Postman:
- **Endpoint**: http://localhost:8183/api/auth/register
- **Method**: POST
- **Body (JSON)**:
```json
{
  "username": "admin",
  "email": "admin@email.com",
  "password": "admin@123secure",
  "role": "ADMIN"
}
```

#### Using cURL:
```bash
curl -X POST http://localhost:8183/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username":"admin","email":"admin@email.com","password":"admin@123secure","role":"ADMIN"}'
```

## Angular CLI Information

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.1.

### Development Commands

| Command | Description |
|---------|-------------|
| `ng serve` | Start development server at `http://localhost:4200/` |
| `ng generate component component-name` | Generate a new component |
| `ng build` | Build the project to `dist/` directory |
| `ng test` | Execute unit tests via [Karma](https://karma-runner.github.io) |
| `ng e2e` | Execute end-to-end tests |

For more information on Angular CLI commands and features, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.