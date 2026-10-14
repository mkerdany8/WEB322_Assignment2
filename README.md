# Climate Solutions Web App

A full-stack Node.js web application that catalogues climate solutions organised by sector, with a password-protected admin area for managing entries.

**Live site:** https://climate-solutions-mk.vercel.app

## Features

- Browse 30 climate solution projects across 5 sectors (Electricity, Transportation, Industry, Land Sinks, and Food, Agriculture & Land Use)
- Filter projects by sector, or view an individual project's detail page
- Session-based authentication using `client-sessions`
- Admin CRUD — add, edit and delete projects, with every write route guarded by `ensureLogin` middleware
- Custom 404 and 500 error pages
- Server-rendered views with EJS partials, styled with Tailwind CSS and daisyUI

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js, Express 5 |
| Views | EJS |
| Database | PostgreSQL via Sequelize ORM |
| Styling | Tailwind CSS 4, daisyUI |
| Auth | client-sessions |
| Hosting | Vercel |

## Data Model

Two tables with a one-to-many relationship — each `Project` belongs to a `Sector`.

- **Sector** — `id`, `sector_name`
- **Project** — `id`, `title`, `feature_img_url`, `summary_short`, `intro_short`, `impact`, `original_source_url`, `sector_id`

## Running Locally

```bash
npm install
npm run tw:build    # compile Tailwind
node seed.js        # create tables and load ./data (run once, on a fresh DB)
npm start
```

Create a `.env` file in the project root with the following:

```
PGHOST=
PGDATABASE=
PGUSER=
PGPASSWORD=
SESSIONSECRET=
ADMINUSER=
ADMINPASSWORD=
```

The database connection requires SSL. Run `node test-db.js` to verify your credentials connect before starting the server.

## Routes

| Method | Path | Auth |
|---|---|---|
| GET | `/` | — |
| GET | `/about` | — |
| GET | `/solutions/projects` | — |
| GET | `/solutions/projects/:id` | — |
| GET | `/login` | — |
| POST | `/login` | — |
| GET | `/logout` | — |
| GET · POST | `/solutions/addProject` | required |
| GET · POST | `/solutions/editProject/:id` | required |
| GET | `/solutions/deleteProject/:id` | required |

---

Built by Moustafa Elkerdany.
