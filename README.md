# Movie Catalog Management System

Simple CRUD lab project built with Node.js, Express, MongoDB, and a plain HTML/CSS/JavaScript frontend.

## Folder structure

```text
movie-app/
  models/Movie.js
  routes/movies.js
  public/index.html
  public/styles.css
  public/app.js
  server.js
  package.json
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file by copying `.env.example`.

3. Start MongoDB locally or use MongoDB Atlas.

4. Run the project:

```bash
node server.js
```

5. Open `http://localhost:3000`

## API endpoints

- `GET /api/movies`
- `POST /api/movies`
- `GET /api/movies/:id`
- `PUT /api/movies/:id`
- `DELETE /api/movies/:id`
