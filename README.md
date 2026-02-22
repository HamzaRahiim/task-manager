# 📋 TaskFlow — Task Management Application

A full-stack task management application built with React, Node.js/Express, and MongoDB.
Manage tasks with dynamic, user-defined statuses and priorities — no hardcoded workflow.

---

## 🖥️ Live Preview

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |
| API Health | http://localhost:5000/health |

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, TanStack Query, shadcn/ui, Tailwind CSS, Axios  
**Backend:** Node.js, Express, MongoDB, Mongoose, express-validator  
**Testing:** Vitest, React Testing Library  
**DevOps:** Docker, Docker Compose

---

## 📦 Prerequisites

- Node.js v20+
- npm v9+
- MongoDB Atlas account (or local MongoDB)
- Docker + Docker Compose (optional — for containerized setup)

---

## ⚙️ Environment Variables

### Backend — `backend/.env`
```env
PORT=5000
MONGODB_URI=check .env.example for connection string
NODE_ENV=development
```

### Frontend — `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Copy the `.env.example` files in each folder as a starting point:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

---

## 🚀 Setup & Run (Without Docker)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
# Add your MongoDB URI to backend/.env
npm run dev or npm start
# ✅ Backend running at http://localhost:5000
```

### 3. Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm run dev
# ✅ Frontend running at http://localhost:3000
```

Both services must run simultaneously in separate terminal windows.

---

## 🐳 Setup & Run (With Docker)
```bash
# At the root of the repo, create a .env file:
echo "MONGODB_URI=your_mongodb_connection_string" > .env

# Build and start both services
docker-compose up --build

# ✅ Frontend: http://localhost:3000
# ✅ Backend:  http://localhost:5000
```


---

## 📡 API Documentation

Please see the API_DOCUMENTATION.md file in the root of the repo.

---

## 💡 Design Decisions & Assumptions

### 1. Dynamic Statuses & Priorities (Not Hardcoded)
Rather than hardcoding status values like `pending | in-progress | completed`, both **Status** and **Priority** are fully user-managed resources with their own CRUD operations. Users can name and color-code them freely (e.g., "Needs Client Approval", "Blocked by DevOps", "P0 Critical"). This mirrors how real project management tools like Linear and Jira work.

### 2. Status & Priority Stored as String Name (Not ObjectId Reference)
Tasks store the status and priority as their **string name**, not a MongoDB ObjectId. This avoids a populate/join on every task query and keeps API responses flat and readable. When a status is renamed, the backend automatically cascades the update to all tasks via `Task.updateMany()`.

### 3. Dropdown Filters for Status & Priority (Not Hardcoded Tabs)
Because users can create unlimited statuses and priorities, showing them all as fixed filter tabs would break the layout beyond a handful of items. Instead, filtering uses compact dropdown selectors that scale gracefully to any number of options.

### 4. Combobox with "Create" Option in Task Form
When selecting a status or priority inside the task creation form, users can type a new name and immediately see a "Create X" option if it doesn't exist yet — opening a mini creation dialog without leaving the form. This removes friction and prevents users from abandoning task creation just to manage statuses first.

### 5. Status/Priority Delete Protection
Deleting a status or priority that is currently assigned to tasks is blocked at the API level with a clear error message showing how many tasks are affected. This prevents orphaned tasks with invalid status references.

### 6. MongoDB Atlas (Cloud)
The app uses MongoDB Atlas for the database to avoid requiring a local MongoDB installation. The connection string is kept exclusively in the `.env` file and is never committed to version control.

### 7. Pagination API (Not Frontend Pagination)
Pagination is handled server-side. The frontend sends `page` and `limit` as query params and receives a `pagination` metadata object. This keeps the frontend lean and supports large datasets without loading all records.