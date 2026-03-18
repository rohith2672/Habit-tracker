# Habit-tracker
Full-stack daily habit tracker — Spring Boot + PostgreSQL + React
markdown# Habit Tracker App

A full-stack daily habit tracker with streak tracking, scoring, and category-based organization.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Java 17, Spring Boot 3, JPA/Hibernate, Maven    |
| Database   | PostgreSQL + Flyway migrations                  |
| Frontend   | React (JSX), CSS-in-JS inline styles            |
| Deployment | AWS EC2 (backend), S3 or EC2 (frontend)         |

---

## Project Structure
```
habit-tracker/
├── backend/        ← Spring Boot (com.habittracker)
├── frontend/       ← React dashboard
└── README.md
```

---

## Backend

### Package
`com.habittracker`

### Architecture
- REST controllers → Service layer → Repository (JPA) → PostgreSQL
- DTOs used to separate entity layer from API responses
- Flyway for all schema changes (never modify entities directly in prod)

### Database
- **Database:** PostgreSQL
- **Dialect:** `org.hibernate.dialect.PostgreSQLDialect`
- **Config:** `application.properties` via Spring DataSource
- **Migrations:** Flyway versioned files `V1__, V2__`, etc.
- **SQL style:** Use `BIGSERIAL` for IDs, `TIMESTAMPTZ` for timestamps

### Tables
| Table           | Purpose                              |
|-----------------|--------------------------------------|
| users           | Basic user info                      |
| habits          | Habit definitions per user           |
| daily_checkins  | One record per habit per day         |

### Core Logic
- **Check-in:** POST to mark a habit complete for the day
- **Streak:** Increments on check-in; resets to 0 at midnight if not completed
- **Score:** `streak × difficulty_multiplier × 10`
  - Easy → 1.0x, Medium → 1.5x, Hard → 2.0x
- **Midnight job:** `@Scheduled(cron = "0 0 0 * * *")` scans all habits,
  resets streak for any habit without a checkin for that day

### Habit Model
```
name          String
category      Enum: Health | Learning | Productivity | Mindfulness
difficulty    Enum: Easy | Medium | Hard
streak        int (current streak count)
score         int (calculated)
```

### REST Conventions
- `GET    /api/habits`              → all habits for user
- `GET    /api/habits/today`        → today's habits with completion status
- `POST   /api/habits`             → create new habit
- `POST   /api/habits/{id}/checkin` → mark habit complete for today
- `DELETE /api/habits/{id}`        → delete habit

---

## Frontend

### Stack
- React (JSX), no external UI libraries
- Inline CSS-in-JS styles only
- Fonts: **DM Mono** (body) + **Syne** (headings) via Google Fonts

### Theme
| Token       | Value                  |
|-------------|------------------------|
| Background  | `#0a0a0f`              |
| Surface     | `#0d0d18`              |
| Border      | `#1a1a2e`              |
| Accent      | `#00e5a0` (green)      |
| Score color | `#ff6b35` (orange)     |
| Text        | `#e8e8f0`              |

### Category Colors
| Category      | Color     |
|---------------|-----------|
| Health        | `#00e5a0` |
| Learning      | `#00b4ff` |
| Productivity  | `#ff6b35` |
| Mindfulness   | `#c084fc` |

### Dashboard Features
- Daily habit list with check-in button
- Streak counter + score per habit
- Filter by category
- Circular progress ring (% of day complete)
- Per-category summary cards with progress bars
- Weekly activity heatmap
- Add new habit modal (name, category, difficulty)
- Midnight reset notice in footer

### Current Status
- ✅ `frontend/` — React dashboard UI complete (`HabitDashboard.jsx`)
- ⬜ `backend/` — Spring Boot scaffolding not started

---

## Git Workflow

- `main` → stable releases only
- `dev`  → active development branch
- Branch from `dev` for features: `feature/habit-checkin`, `feature/streak-job`, etc.
- PRs merge into `dev`, then `dev` → `main` for releases

---

## Environment Variables

Create `backend/src/main/resources/application-local.properties` (never commit this):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/habittracker
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
```

---

## Getting Started

### Backend
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Frontend
```bash
cd frontend
npm install
npm start
```
