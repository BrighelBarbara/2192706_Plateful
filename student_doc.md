# Student_doc.md

## Project Title: Plateful

## Technologies Used
- Frontend: React (Vite)
- Backend: Node.js + Express (separate microservices)
- Database: PostgreSQL
- Containerization: Docker + Docker Compose
- Infrastructure: IaC (Dockerfiles, docker-compose)
- Architecture: Microservices

## System Architecture Overview
The application is based on a **microservices architecture**. Each key functionality is encapsulated in a separate backend service, while the UI is managed by a React frontend.

### Architecture Diagram

- `frontend`: the client interface of the application
- `auth-service`: manages authentication (login, registration, JWT)
- `event-service`: manages creation and listing of events
- `menu-service`: handles dish proposals, votes, ingredients
- `shoppinglist-service`: creates and updates shared shopping lists
- `db`: PostgreSQL database

All backend services expose REST APIs and communicate only with the database.

### Communication Flow

1. The **frontend** makes requests to backend services
2. Backend services interact with the **PostgreSQL database**
3. Each service runs in an isolated Docker container
4. The services are orchestrated via `docker-compose`

## Infrastructure as Code

All configurations are containerized:
- Each service has its own `Dockerfile`
- The project is bootstrapped via `docker-compose.yml`
- Environment variables are stored in `.env`

## Non Functional Requirements
- Responsive UI
- Secure authentication with JWT
- Scalable microservice structure
- Clear separation of concerns
