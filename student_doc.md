# SYSTEM DESCRIPTION:

Plateful is a platform that allows a group of users to collaboratively organize a menu for social events such as dinners, picnics, or parties. The goal is to create a menu that meets the preferences of every participant, allowing users to upload their recipe ideas along with the respective ingredients and vote for their favorite options in each category (appetizers, main courses, desserts, etc.). With Plateful, users can join or create events, submit dish proposals, vote for the options they prefer and report allergies.

# USER STORIES:

1) As an event creator, I want to create an event.  
2) As an event creator, I want to add users to the event.  
3) As an event creator, I want to define the categories  
4) As an event creator, I want to set the number of dishes allowed per category.  
5) As an event creator, I want to set the event date.  
6) As an event creator, I want to set the location  
7) As an event creator, I want to set the voting deadline.  
8) As a user, I want to register for an account.   
9) As a user, I want to log in to my account.  
10) As a user, I want to log out from my account.  
11) As a user, I want to have a list of events I am participating in. (HOMEPAGE)  
12) As a user, I want to see my personal profile with my information  
13) As a user, I want to participate to an event  
14) As a user, I want to submit a dish proposal with a title, description, ingredients, and an optional photo.  
15) As a user, I want to vote for my favorite dishes in each category.  
16) As a user, I want to report my allergies  
17) As a user, I want to add additional items to the shopping list.
18) As a user, I want to remove items from the shopping list if they are unnecessary.  
19) As a user, I want to mark an item as purchased on the shopping list.
20) As a user, I want to see the participants in the event  
21) As a user, I want to cancel my participation in the event  
22) As a user, I want to see the most voted dishes for each category

# CONTAINERS:

## CONTAINER_NAME: frontend-1

### DESCRIPTION: 
Next.js application that provides the user interface of Plateful. It allows users to interact with the system by navigating through pages like sign up, login, event dashboard, dish submission, voting, profile, and shopping list management.

### USER STORIES:
8–10, 11–17, 20–22

### PORTS: 
3000:3000

### PERSISTENCE EVALUATION
The frontend does not persist data locally. All user actions and state are managed through API calls to the backend services.

### EXTERNAL SERVICES CONNECTIONS
Communicates via HTTP with the backend microservice to perform user authentication, CRUD operations on events, dishes, votes, and shopping list items.

### MICROSERVICES:

#### MICROSERVICE: frontend
- TYPE: frontend
- DESCRIPTION: Web interface developed with Next.js to provide dynamic pages and user interactivity.
- PORTS: 3000
- TECHNOLOGICAL SPECIFICATION: React, Next.js, Tailwind CSS for styling
- SERVICE ARCHITECTURE: 
Monorepo-based architecture where the frontend communicates via REST APIs with the backend
Uses Next.js app directory and server components

- PAGES:

| Name             | Description                                                 | Related Microservice | User Stories          |
|------------------|-------------------------------------------------------------|----------------------|-----------------------|
| SignUp           | User registration page                                      | backend              | 8                     |
| Login            | Login page for returning users                              | backend              | 9                     |
| Homepage         | Lists events the user participates in                       | backend              | 11                    |
| Profile          | Shows user info and allergies                               | backend              | 12, 16                |
| EventPage        | Detailed view of the event, categories, dishes, votes       | backend              | 13–15, 20–22          |
| SubmitDish       | Form to submit recipes and ingredients                      | backend              | 14                    |
| VotingPage       | Interface to vote on dishes in each category                | backend              | 15, 22                |
| ShoppingList     | View and modify shopping list for the event                 | backend              | 17–19                 |
| CreateEvent      | Interface to create a new event                             | backend              | 1–7                   |

## CONTAINER_NAME: backend-1

### DESCRIPTION: 
Node.js/Express.js application responsible for handling all business logic and database operations, including user management, event handling, recipe submissions, voting, and allergy tracking.

### USER STORIES:
1–7, 8–10, 11–22

### PORTS: 
4000:4000

### PERSISTENCE EVALUATION
All persistent data (users, events, dishes, votes, allergies) is stored in a PostgreSQL database. The backend connects to the database using the pg library and manages tables via SQL queries or migration tools (e.g. Prisma or SQL scripts).

### EXTERNAL SERVICES CONNECTIONS
PostgreSQL database
Serves API endpoints consumed by the frontend

### MICROSERVICES:

#### MICROSERVICE: backend
- TYPE: backend
- DESCRIPTION: REST API server that manages the business logic of Plateful.
- PORTS: 4000
- TECHNOLOGICAL SPECIFICATION: Node.js + Express.js, PostgreSQL
- SERVICE ARCHITECTURE: Stateless REST API service; Express routers for /users, /events, /dishes, /votes, /shopping-list

- ENDPOINTS: 

| HTTP METHOD | URL                   | Description                                 | User Stories           |
| POST        | /users/register        | Register a new user                         | 8                      |
| POST        | /users/login           | User login                                  | 9                      |
| GET         | /users/profile         | Get user info and allergies                 | 12, 16                 |
| POST        | /users/logout          | Logout user                                 | 10                     |
| POST        | /events                | Create a new event                          | 1, 3–7                 |
| POST        | /events/\:id/join       | Join an event                               | 13                     |
| GET         | /events                | Get all events for user                     | 11                     |
| POST        | /dishes                | Submit a new dish                           | 14                     |
| GET         | /dishes/event/\:id      | Get all dishes for an event                 | 15, 22                 |
| POST        | /votes                 | Submit a vote                               | 15                     |
| GET         | /votes/results/\:id     | View most voted dishes per category         | 22                     |
| POST        | /shopping-list         | Add an item to shopping list                | 17                     |
| DELETE      | /shopping-list/\:itemId | Remove an item from shopping list           | 18                     |
| PUT         | /shopping-list/\:itemId | Mark item as purchased                      | 19                     |
| GET         | /participants/\:eventId | Get participants of an event                | 20                     |
| DELETE      | /events/\:id/leave      | Leave/cancel participation in an event      | 21                     |

- DB STRUCTURE:

users: | id | name | email | password_hash | allergies
events: | id | creator_id | name | location | date | voting_deadline | categories | dishes_per_category
participants: | id | user_id | event_id
dishes: | id | event_id | user_id | title | description | ingredients | image_url | category
votes: | id | user_id | dish_id | event_id
shopping_list: | id | event_id | item_name | added_by_user_id | is_purchased

## CONTAINER_NAME: db-1

### DESCRIPTION: 
PostgreSQL container storing persistent application data. 

### USER STORIES:
All stories involving user, event, dish, vote, shopping list, or allergy data persistence.

### PORTS: 
5432:5432

### PERSISTENCE EVALUATION
Volume-mounted storage ensures data persists across container restarts. Used as the main data source by the backend.

### EXTERNAL SERVICES CONNECTIONS
Docker + Docker Compose
