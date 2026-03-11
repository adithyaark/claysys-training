# QuizAPI - Final Project (Angular & ASP.NET)

A full-stack quiz application built with **Angular (frontend)** and **ASP.NET Core Web API (backend)**.
This project demonstrates REST API integration, authentication, quiz management, and a responsive UI.

---

## Tech Stack

**Frontend**

* Angular
* TypeScript
* Bootstrap / Tailwind CSS
* RxJS

**Backend**

* ASP.NET Core Web API
* Entity Framework Core
* SQL Server / SQLite
* JWT Authentication

**Tools**

* Swagger UI
* Git
* Node.js
* .NET SDK

---

## Prerequisites

Make sure the following are installed:

* Node.js (v18 or higher)
* Angular CLI
* .NET SDK (v8 or higher)
* SQL Server or SQLite

Install Angular CLI if not installed:

```
npm install -g @angular/cli
```

---

## Backend Setup

Navigate to the backend folder and run:

```
cd "QuizAPI - FinalProject - Angular and ASP.NET/Backend"
dotnet restore
dotnet ef database update
dotnet run
```

Backend will run at:

```
https://localhost:5001
```

Swagger API documentation:

```
https://localhost:5001/swagger
```

---

## Frontend Setup

Navigate to the frontend folder and run:

```
cd "QuizAPI - FinalProject - Angular and ASP.NET/Frontend"
npm install
ng serve
```

Frontend will run at:

```
http://localhost:4200
```

---

## Project Structure

```
QuizAPI - FinalProject - Angular and ASP.NET
│
├── Backend
│   ├── Controllers
│   ├── Models
│   ├── Services
│   └── Program.cs
│
└── Frontend
    └── src/app
        ├── components
        ├── services
        └── models
```

---

## Features

* User authentication using JWT
* Quiz creation and management
* RESTful API integration
* Responsive UI
* API testing using Swagger
