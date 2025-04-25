# ClickShop


Overview
This project is the frontend for an e-commerce platform, built using Angular. It serves as the user interface, interacting with the backend microservices (e.g., authentication, cart management, order management, and product management) powered by Spring Boot. The frontend is designed to provide a seamless shopping experience and integrates with the backend via RESTful APIs.
Project Structure

src/: Contains the Angular components, services, modules, and assets.
angular.json: Configuration file for the Angular CLI.
package.json: Defines project dependencies and scripts.

Prerequisites

Node.js (v16 or later)
npm (for package management)
Angular CLI (install globally with npm install -g @angular/cli)
Git (for version control)

Setup Instructions
1. Clone the Repository
git clone <repository-url>
cd <repository-folder>

2. Install Dependencies
Run the following command to install the required packages:
npm install

3. Run the Frontend
Start the development server:
ng serve

The app will be available at http://localhost:4200 by default.
4. Build for Production
To create a production build:
ng build --prod

The build artifacts will be stored in the dist/ directory.
Services and Ports

Frontend: http://localhost:4200 (default development port)
Backend API: Connects to http://localhost:8183 (AuthManagerMicroservice) and other backend services as needed.

Backend Repository
The backend for this project can be found at: [Backend Repository URL Placeholder]
Notes

Ensure the backend services are running (e.g., using run.bat docker from the backend repository) before starting the frontend.
API endpoints are assumed to be served from http://localhost:8183 and other ports as defined in the backend docker-compose.yml.
Environment variables for API URLs can be configured in the src/environments/ files (e.g., environment.ts and environment.prod.ts).

Admin Credentials (For Demonstration)
An admin account is available for demonstration purposes. If the admin user is not created automatically in the backend, you can manually create it using the following steps:
Manual Admin Creation
Use Postman or cURL to send a POST request to the registration endpoint:

Endpoint: http://localhost:8183/api/auth/register
Method: POST
Body (JSON):{
  "username": "admin",
  "email": "admin@email.com",
  "password": "admin@123secure",
  "role": "ADMIN"
}



Using cURL:
curl -X POST http://localhost:8183/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username":"admin","email":"admin@email.com","password":"admin@123secure","role":"ADMIN"}'

After successful registration, you can use the following credentials to log in via the frontend admin panel:

Username: admin
Password: admin@123secure




This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
