# 📚 Task Management API Documentation

## Overview

The Task Management API is a production-grade RESTful service built with **Node.js**, **Express**, and **MongoDB Atlas**. It provides complete CRUD operations for three core resources:

- **Statuses** — User-defined task statuses (e.g., "Todo", "In Progress", "Done")
- **Priorities** — User-defined priority levels (e.g., "Low", "Medium", "High")
- **Tasks** — Individual tasks with dynamic status and priority references

All responses follow a consistent JSON structure with `success`, `message`, and `data` fields.

---

## 🌐 Base URL

```
http://localhost:5000/api
```

For production, replace `localhost:5000` with your deployed server domain.

---

## 📋 Response Format

### Success Response (2xx)

```json
{
  "success": true,
  "message": "Operation description",
  "data": {
    "property": "value"
  }
}
```

### Error Response (4xx, 5xx)

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error details"
    }
  ]
}
```

---

## 📍 API Endpoints

### Health Check

Test if the API is running.

#### Request

```http
GET /health
```

#### Response `200`

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-02-23T10:30:00.000Z"
}
```

---

## 🏷️ STATUSES RESOURCE

User-defined task statuses. Status names are **case-insensitive unique** and can be renamed (auto-cascades to tasks).

### Get All Statuses

Retrieve all statuses sorted by newest first.

#### Request

```http
GET /statuses
```

#### Query Parameters

None

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "_id": "67b5a8c2f9e2c1a0b3d4e5f6",
      "name": "Done",
      "color": "#10B981",
      "createdAt": "2024-02-23T10:15:00.000Z",
      "updatedAt": "2024-02-23T10:15:00.000Z"
    },
    {
      "_id": "67b5a8c2f9e2c1a0b3d4e5f5",
      "name": "In Progress",
      "color": "#F59E0B",
      "createdAt": "2024-02-23T10:10:00.000Z",
      "updatedAt": "2024-02-23T10:10:00.000Z"
    },
    {
      "_id": "67b5a8c2f9e2c1a0b3d4e5f4",
      "name": "Todo",
      "color": "#6B7280",
      "createdAt": "2024-02-23T10:05:00.000Z",
      "updatedAt": "2024-02-23T10:05:00.000Z"
    }
  ]
}
```

---

### Check Status Name Availability

Check if a status name exists (useful for frontend dropdown/combobox UX).

#### Request

```http
GET /statuses/check?name=Blocked
```

#### Query Parameters

| Parameter | Type   | Required | Description          |
| --------- | ------ | -------- | -------------------- |
| `name`    | string | Yes      | Status name to check |

#### Response `200` — Status Exists

```json
{
  "success": true,
  "data": {
    "exists": true,
    "status": {
      "_id": "67b5a8c2f9e2c1a0b3d4e5f3",
      "name": "Blocked",
      "color": "#EF4444",
      "createdAt": "2024-02-23T09:50:00.000Z",
      "updatedAt": "2024-02-23T09:50:00.000Z"
    }
  }
}
```

#### Response `200` — Status Does Not Exist

```json
{
  "success": true,
  "data": {
    "exists": false,
    "status": null
  }
}
```

---

### Create Status

Create a new user-defined status.

#### Request

```http
POST /statuses
Content-Type: application/json

{
  "name": "In Review",
  "color": "#8B5CF6"
}
```

#### Request Body

| Field   | Type   | Required | Constraints                                  |
| ------- | ------ | -------- | -------------------------------------------- |
| `name`  | string | Yes      | 1–50 chars, trimmed, case-insensitive unique |
| `color` | string | No       | Valid hex color (e.g., `#FF5733`)            |

#### Response `201` — Success

```json
{
  "success": true,
  "message": "Status created successfully",
  "data": {
    "_id": "67b5a8c2f9e2c1a0b3d4e5f7",
    "name": "In Review",
    "color": "#8B5CF6",
    "createdAt": "2024-02-23T10:35:00.000Z",
    "updatedAt": "2024-02-23T10:35:00.000Z"
  }
}
```

#### Response `409` — Duplicate Name

```json
{
  "success": false,
  "message": "Status \"In Review\" already exists. Status names must be unique."
}
```

#### Response `422` — Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "color",
      "message": "Color must be a valid hex code like #FF5733"
    }
  ]
}
```

---

### Update Status

Update an existing status. When name changes, all tasks using the old name auto-update to the new name.

#### Request

```http
PATCH /statuses/:id
Content-Type: application/json

{
  "name": "Needs Review",
  "color": "#7C3AED"
}
```

#### URL Parameters

| Parameter | Type   | Description                 |
| --------- | ------ | --------------------------- |
| `id`      | string | MongoDB `_id` of the status |

#### Request Body (all fields optional)

| Field   | Type   | Constraints                                                          |
| ------- | ------ | -------------------------------------------------------------------- |
| `name`  | string | 1–50 chars, trimmed, case-insensitive unique (excluding current doc) |
| `color` | string | Valid hex color (e.g., `#FF5733`)                                    |

#### Response `200` — Success

```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {
    "_id": "67b5a8c2f9e2c1a0b3d4e5f7",
    "name": "Needs Review",
    "color": "#7C3AED",
    "createdAt": "2024-02-23T10:35:00.000Z",
    "updatedAt": "2024-02-23T10:40:00.000Z"
  }
}
```

#### Response `404` — Not Found

```json
{
  "success": false,
  "message": "Status not found"
}
```

#### Response `409` — Duplicate Name or Tasks In Use

```json
{
  "success": false,
  "message": "Status \"Needs Review\" already exists. Status names must be unique."
}
```

---

### Delete Status

Delete a status. **Blocked** if any tasks are using it.

#### Request

```http
DELETE /statuses/:id
```

#### URL Parameters

| Parameter | Type   | Description                 |
| --------- | ------ | --------------------------- |
| `id`      | string | MongoDB `_id` of the status |

#### Response `200` — Success

```json
{
  "success": true,
  "message": "Status deleted successfully"
}
```

#### Response `404` — Not Found

```json
{
  "success": false,
  "message": "Status not found"
}
```

#### Response `409` — Cannot Delete (Tasks In Use)

```json
{
  "success": false,
  "message": "Cannot delete \"In Progress\" — it is used by 5 task(s). Reassign those tasks first."
}
```

---

## 🎯 PRIORITIES RESOURCE

User-defined priority levels. Priority names are **case-insensitive unique** and can be renamed (auto-cascades to tasks).

### Get All Priorities

Retrieve all priorities sorted by newest first.

#### Request

```http
GET /priorities
```

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "_id": "67b5a8c2f9e2c1a0b3d4e5f9",
      "name": "High",
      "color": "#EF4444",
      "createdAt": "2024-02-23T10:20:00.000Z",
      "updatedAt": "2024-02-23T10:20:00.000Z"
    },
    {
      "_id": "67b5a8c2f9e2c1a0b3d4e5f8",
      "name": "Medium",
      "color": "#F59E0B",
      "createdAt": "2024-02-23T10:15:00.000Z",
      "updatedAt": "2024-02-23T10:15:00.000Z"
    },
    {
      "_id": "67b5a8c2f9e2c1a0b3d4e5f7",
      "name": "Low",
      "color": "#10B981",
      "createdAt": "2024-02-23T10:10:00.000Z",
      "updatedAt": "2024-02-23T10:10:00.000Z"
    }
  ]
}
```

---

### Check Priority Name Availability

Check if a priority name exists.

#### Request

```http
GET /priorities/check?name=Urgent
```

#### Query Parameters

| Parameter | Type   | Required | Description            |
| --------- | ------ | -------- | ---------------------- |
| `name`    | string | Yes      | Priority name to check |

#### Response `200` — Priority Exists

```json
{
  "success": true,
  "data": {
    "exists": true,
    "priority": {
      "_id": "67b5a8c2f9e2c1a0b3d4e5f9",
      "name": "Urgent",
      "color": "#DC2626",
      "createdAt": "2024-02-23T10:20:00.000Z",
      "updatedAt": "2024-02-23T10:20:00.000Z"
    }
  }
}
```

#### Response `200` — Priority Does Not Exist

```json
{
  "success": true,
  "data": {
    "exists": false,
    "priority": null
  }
}
```

---

### Create Priority

Create a new user-defined priority level.

#### Request

```http
POST /priorities
Content-Type: application/json

{
  "name": "Critical",
  "color": "#BE123C"
}
```

#### Request Body

| Field   | Type   | Required | Constraints                                  |
| ------- | ------ | -------- | -------------------------------------------- |
| `name`  | string | Yes      | 1–50 chars, trimmed, case-insensitive unique |
| `color` | string | No       | Valid hex color (e.g., `#FF5733`)            |

#### Response `201` — Success

```json
{
  "success": true,
  "message": "Priority created successfully",
  "data": {
    "_id": "67b5a8c2f9e2c1a0b3d4e5fa",
    "name": "Critical",
    "color": "#BE123C",
    "createdAt": "2024-02-23T10:45:00.000Z",
    "updatedAt": "2024-02-23T10:45:00.000Z"
  }
}
```

#### Response `409` — Duplicate Name

```json
{
  "success": false,
  "message": "Priority \"Critical\" already exists. Priority names must be unique."
}
```

---

### Update Priority

Update an existing priority. When name changes, all tasks using the old name auto-update to the new name.

#### Request

```http
PATCH /priorities/:id
Content-Type: application/json

{
  "name": "Very High",
  "color": "#DC2626"
}
```

#### URL Parameters

| Parameter | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `id`      | string | MongoDB `_id` of the priority |

#### Request Body (all fields optional)

| Field   | Type   | Constraints                                                 |
| ------- | ------ | ----------------------------------------------------------- |
| `name`  | string | 1–50 chars, case-insensitive unique (excluding current doc) |
| `color` | string | Valid hex color                                             |

#### Response `200` — Success

```json
{
  "success": true,
  "message": "Priority updated successfully",
  "data": {
    "_id": "67b5a8c2f9e2c1a0b3d4e5fa",
    "name": "Very High",
    "color": "#DC2626",
    "createdAt": "2024-02-23T10:45:00.000Z",
    "updatedAt": "2024-02-23T10:50:00.000Z"
  }
}
```

---

### Delete Priority

Delete a priority. **Blocked** if any tasks are using it.

#### Request

```http
DELETE /priorities/:id
```

#### URL Parameters

| Parameter | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `id`      | string | MongoDB `_id` of the priority |

#### Response `200` — Success

```json
{
  "success": true,
  "message": "Priority deleted successfully"
}
```

#### Response `409` — Cannot Delete (Tasks In Use)

```json
{
  "success": false,
  "message": "Cannot delete \"High\" — it is used by 12 task(s). Reassign those tasks first."
}
```

---

## ✅ TASKS RESOURCE

Tasks are the core entities. Each task **references a Status and Priority by their string names** (not IDs), enabling dynamic user-defined categories.

### Get All Tasks (Paginated + Search + Filter)

Retrieve tasks with advanced filtering, searching, and pagination.

#### Request

```http
GET /tasks?page=1&limit=10&status=In%20Progress&priority=High&search=bug&sortBy=createdAt&sortOrder=desc
```

#### Query Parameters

| Parameter   | Type   | Default   | Description                                               |
| ----------- | ------ | --------- | --------------------------------------------------------- |
| `page`      | number | 1         | Page number (1-indexed)                                   |
| `limit`     | number | 10        | Results per page (max: 100)                               |
| `status`    | string | —         | Filter by status name (case-insensitive)                  |
| `priority`  | string | —         | Filter by priority name (case-insensitive)                |
| `search`    | string | —         | Case-insensitive substring search in title or description |
| `sortBy`    | string | createdAt | Field to sort by (`createdAt`, `title`, `priority`, etc.) |
| `sortOrder` | string | desc      | `asc` or `desc`                                           |

#### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "_id": "67b5a8c2f9e2c1a0b3d4e5fb",
      "title": "Fix login bug",
      "description": "Users cannot log in with Google OAuth on mobile",
      "status": "In Progress",
      "priority": "High",
      "dueDate": "2024-03-01T00:00:00.000Z",
      "createdAt": "2024-02-23T09:00:00.000Z",
      "updatedAt": "2024-02-23T10:30:00.000Z"
    },
    {
      "_id": "67b5a8c2f9e2c1a0b3d4e5fc",
      "title": "Update documentation",
      "description": "",
      "status": "Todo",
      "priority": "Low",
      "dueDate": null,
      "createdAt": "2024-02-23T08:30:00.000Z",
      "updatedAt": "2024-02-23T08:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Get Single Task

Retrieve a task by its ID.

#### Request

```http
GET /tasks/:id
```

#### URL Parameters

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| `id`      | string | MongoDB `_id` of the task |

#### Response `200` — Success

```json
{
  "success": true,
  "data": {
    "_id": "67b5a8c2f9e2c1a0b3d4e5fb",
    "title": "Fix login bug",
    "description": "Users cannot log in with Google OAuth on mobile",
    "status": "In Progress",
    "priority": "High",
    "dueDate": "2024-03-01T00:00:00.000Z",
    "createdAt": "2024-02-23T09:00:00.000Z",
    "updatedAt": "2024-02-23T10:30:00.000Z"
  }
}
```

#### Response `404` — Not Found

```json
{
  "success": false,
  "message": "Task not found"
}
```

#### Response `400` — Invalid ID Format

```json
{
  "success": false,
  "message": "Invalid ID format."
}
```

---

### Create Task

Create a new task. **Status and Priority must exist** in the database before use.

#### Request

```http
POST /tasks
Content-Type: application/json

{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication to the API",
  "status": "In Progress",
  "priority": "High",
  "dueDate": "2024-03-15"
}
```

#### Request Body

| Field         | Type   | Required | Constraints                                                         |
| ------------- | ------ | -------- | ------------------------------------------------------------------- |
| `title`       | string | Yes      | 1–100 chars, trimmed                                                |
| `description` | string | No       | Trimmed, defaults to empty string                                   |
| `status`      | string | Yes      | Must exist in Statuses collection                                   |
| `priority`    | string | Yes      | Must exist in Priorities collection                                 |
| `dueDate`     | string | No       | ISO 8601 date format (e.g., `2024-03-15` or `2024-03-15T14:30:00Z`) |

#### Response `201` — Success

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "67b5a8c2f9e2c1a0b3d4e5fd",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication to the API",
    "status": "In Progress",
    "priority": "High",
    "dueDate": "2024-03-15T00:00:00.000Z",
    "createdAt": "2024-02-23T10:50:00.000Z",
    "updatedAt": "2024-02-23T10:50:00.000Z"
  }
}
```

#### Response `422` — Status Does Not Exist

```json
{
  "success": false,
  "message": "Status \"Blocked\" does not exist. Create it first or choose an existing status."
}
```

#### Response `422` — Priority Does Not Exist

```json
{
  "success": false,
  "message": "Priority \"Urgent\" does not exist. Create it first or choose an existing priority."
}
```

#### Response `422` — Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "dueDate",
      "message": "Due date must be a valid date"
    }
  ]
}
```

---

### Update Task

Update an existing task. All fields are optional; only provided fields are updated.

#### Request

```http
PATCH /tasks/:id
Content-Type: application/json

{
  "status": "Done",
  "priority": "Low",
  "dueDate": null
}
```

#### URL Parameters

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| `id`      | string | MongoDB `_id` of the task |

#### Request Body (all fields optional)

| Field         | Type   | Constraints                         |
| ------------- | ------ | ----------------------------------- |
| `title`       | string | 1–100 chars, non-empty, trimmed     |
| `description` | string | Trimmed                             |
| `status`      | string | Must exist in Statuses collection   |
| `priority`    | string | Must exist in Priorities collection |
| `dueDate`     | string | ISO 8601 date or `null`             |

#### Response `200` — Success

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "67b5a8c2f9e2c1a0b3d4e5fd",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication to the API",
    "status": "Done",
    "priority": "Low",
    "dueDate": null,
    "createdAt": "2024-02-23T10:50:00.000Z",
    "updatedAt": "2024-02-23T11:00:00.000Z"
  }
}
```

#### Response `404` — Not Found

```json
{
  "success": false,
  "message": "Task not found"
}
```

#### Response `422` — Status Does Not Exist

```json
{
  "success": false,
  "message": "Status \"Archived\" does not exist. Create it first or choose an existing status."
}
```

---

### Delete Task

Delete a task permanently.

#### Request

```http
DELETE /tasks/:id
```

#### URL Parameters

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| `id`      | string | MongoDB `_id` of the task |

#### Response `200` — Success

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### Response `404` — Not Found

```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## 🔍 Common Query Examples

### Example 1: Get High-Priority Tasks in Progress

```http
GET /tasks?status=In%20Progress&priority=High&limit=20
```

### Example 2: Search Tasks by Keyword

```http
GET /tasks?search=authentication&sortOrder=asc&page=1
```

### Example 3: Get All Completed Tasks, Sorted by Oldest First

```http
GET /tasks?status=Done&sortBy=createdAt&sortOrder=asc
```

### Example 4: Paginate Through All Tasks

```http
GET /tasks?page=2&limit=15
```

---

## ⚠️ Error Codes Reference

| Code | Meaning       | Description                                           |
| ---- | ------------- | ----------------------------------------------------- |
| 200  | OK            | Successful GET, PATCH, or DELETE                      |
| 201  | Created       | Successful POST                                       |
| 400  | Bad Request   | Invalid ID format or missing required query params    |
| 404  | Not Found     | Resource (status, priority, task) not found           |
| 409  | Conflict      | Duplicate name or resource in use (cannot delete)     |
| 422  | Unprocessable | Validation error or referenced resource doesn't exist |
| 500  | Server Error  | Internal server error (rare in production)            |

---

## 🔐 Security Notes

1. **No Authentication Currently** — This is a public API. For production, implement JWT or OAuth2.
2. **CORS Enabled** — Frontend URL is configurable via `FRONTEND_URL` env var.
3. **Input Validation** — All fields are validated server-side; client-side validation is recommended.
4. **Case-Insensitive Matching** — Status and Priority names are matched case-insensitively but stored with original casing.

---

## 📦 Example Workflow

### Step 1: Create a Status

```http
POST /api/statuses
{
  "name": "In Review",
  "color": "#F59E0B"
}
```

### Step 2: Create a Priority

```http
POST /api/priorities
{
  "name": "High",
  "color": "#EF4444"
}
```

### Step 3: Create a Task

```http
POST /api/tasks
{
  "title": "Review pull request",
  "description": "Code review for auth module",
  "status": "In Review",
  "priority": "High",
  "dueDate": "2024-03-01"
}
```

### Step 4: Update Task Status When Done

```http
PATCH /api/tasks/:id
{
  "status": "Done"
}
```

### Step 5: Rename Priority (Auto-Cascades to Tasks)

```http
PATCH /api/priorities/:id
{
  "name": "Critical"
}
```

All tasks referencing "High" priority auto-update to "Critical".

---

## 🚀 Quick Start for Frontend Developers

1. **Health Check** — `GET /health` to confirm API is running.
2. **Load Statuses** — `GET /statuses` to populate dropdown in UI.
3. **Load Priorities** — `GET /priorities` to populate priority dropdown.
4. **Create Task** — `POST /tasks` with valid status/priority references.
5. **Search/Filter** — `GET /tasks?search=...&status=...&priority=...` for dynamic queries.
6. **Manage Categories** — `POST/PATCH/DELETE /statuses` and `/priorities` for admin functionality.

---

## 📞 Support

For issues or questions:

- Check **Error Codes Reference** section above
- Verify **Status** and **Priority** exist before creating/updating tasks
- Ensure dates are in **ISO 8601** format
- Test with **HTTP 200/201 OK** responses before debugging logic

---

**Last Updated:** February 23, 2024  
**API Version:** 1.0  
**Built with:** Node.js, Express.js, MongoDB Atlas
