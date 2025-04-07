# MbRestaurantManagerUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.5.

## Vercel
This project is currently deployed on Vercel

https://mb-restaurant-manager-ui.vercel.app

## Development server

### 1. Install dependencies

Before running the app for the first time, install the project dependencies (node ^18.19.1):

```bash
npm install
```

To start a local development server, run:

```bash
ng serve
```
### 🔧 Backend

__The backend is built with Node.js and is available in this repo:__
__[mb-restaurant-manager-server](https://github.com/bouskaM/mb-restaurant-manager-server)__

__If you're running this project locally, make sure to start the Node.js server as well.__
__By default, the frontend expects the backend to be running at `http://localhost:3000`.__

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## DEVELOPER NOTES

I decided to build this using the latest version of Angular (19), and to keep things simple, I went with Signals, standalone components, and inline HTML + styles.
My goal was to keep each component as minimal and focused as possible without adding unnecessary boilerplate.

### Login + Auth
- A `Login component` to handle user input and display potential errors
- An `Auth service` to manage login requests and store auth state (also synced with localStorage)
- An `Auth guard` to protect routes like /dashboard and /restaurants so they’re only accessible to logged-in users
- An `Auth interceptor` to catch 401 errors and automatically log the user out if needed

### Routing 
- Router shows navbar and lazy loaded content for logged in users
- Login screen without navbar
- Fallback from '' to redirect to either login or dashboard
- show 404 error on non-existent pages  

### Dasboard
- Main _Dashboard component_ with child components for modules (only "restaurants" in this case)

### Restaurants
- The main `RestaurantsComponent` is split into multiple child components to handle the table, search, loading spinner, and pagination.
- NOTE: The assignment said that data requests for this table should be between __40k-100k__ (which i randomly generate in server repo),
    This suggests possbile work with large data 
    -> my initial thought was to create special pagination endpoint in backend to do the __server side pagination__
    and the api would look something like `/api/restaurants?page=1&pageSize=25&sort=address&order=asc&search=Strasse` 
    -> or even to map managerId to manager name on the backend, so the client wouldn’t need to handle that logic at all.
- I __did not__ want to change the assignment, and realized that the best approach was to initially __load data from both endpoints__, create a __Map__ from the managers array for faster and simpler lookups, and only map the manager names onto the __paginated result__ displayed in the component.
- This led to the creation of a __signal-based store (`restaurants.store.ts`)__ to handle state and logic for the table. If the assignment were more complex, I’d consider using NgRx Store, but in this case, that felt like overkill.

### Types
- The `models/` folder contains `auth.model.ts` and `restaurants.model.ts` with all shared types used across the app.

### Navbar
- For better UX, I created a reusable `Navbar` component inside the `shared/` folder.
- It’s used across authenticated feature modules like `dashboard` and `restaurants`, and is hidden on the login screen.
