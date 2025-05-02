

## 📌 About the System

This is a **Task Management System** designed to streamline collaboration between an **Admin** and multiple **Users**. The system supports registration, task assignment, real-time notifications, and a dashboard to track task statuses.

### 🔐 Account & Authentication

* A **shared login page** is used for both Admin and User.
* The **Admin account** is unique. You can:

  * Create it manually in the database
  * Or initialize it using a database seeder (recommended for first-time setup).
* **Users** must register through the system if they don't have an existing account.
* If the user already has an account, they can log in and access their dashboard directly.

---

## 👨‍💼 Admin Panel

### 📊 Dashboard

* View the **count of tasks** grouped by status (e.g., Pending, In Progress, Completed).
* Display a **visual distribution** of tasks (charts/graphs).
* See a **list of recent tasks** across all users.

### ✅ Tasks Management

* **Create**, **update/edit**, and **delete** any task.
* Assign tasks to users.

### 👥 Member Management

* **Add**, **edit**, and **remove** user accounts.

### 🔔 Notifications

* Receive alerts when:

  * A user **updates** the status of a task.
  * A task becomes **overdue**.
  * A user **submits** a completed task.

---

## 👤 User Panel

### 📊 Dashboard

* View **task statistics** filtered only to the logged-in user.
* Visual distribution of personal task statuses.
* Display of **recently assigned or updated tasks**.

### 📋 My Tasks

* View only the tasks **assigned by the Admin**.
* Can update the status of the task.

### 🔔 Notifications

* Receive alerts when:

  * A **new task** is assigned by the Admin.
  * A task is **nearing its deadline**, starting **3 days before** the due date.


