# FinSync OS

AI-powered personal finance management platform built with React Native, Node.js, Express.js, and MongoDB.

## Overview

FinSync OS helps users manage personal finances through smart expense tracking, budget management, analytics, and AI-powered financial insights.

## Features

* User Authentication (JWT)
* Personal Expense Tracking
* Monthly Budget Management
* AI Expense Categorization
* AI Budget Assistant
* Family Finance Management
* Family Expense Tracking
* Analytics Dashboard
* Smart Financial Insights
* Professional Mobile UI

## Tech Stack

### Frontend

* React Native (Expo)

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JWT

### AI Integration

* Gemini AI

---

## Application Screenshots

### Login Screen

![Login Screen](screenshots/loginscreen.jpeg)

### Register Screen

![Register Screen](screenshots/registerscreen.jpeg)

### Home Screen

![Home Screen](screenshots/homescreen1.jpeg)

### Home Dashboard

![Home Dashboard](screenshots/homescreen2.jpeg)

### Add Expense Screen

![Add Expense](screenshots/addexpensescreen.jpeg)

### Family Management

![Family Screen](screenshots/familyscreen1.jpeg)

### Family Members

![Family Members](screenshots/familyscreen2.jpeg)

### Analytics Dashboard

![Analytics](screenshots/analyticsscreen.jpeg)

### Profile Screen

![Profile](screenshots/profilescreen1.jpeg)

### Profile Features

![Profile Features](screenshots/profilescreen2.jpeg)

---

## Project Architecture

Frontend (React Native)
↓
REST API (Express.js)
↓
MongoDB Database
↓
AI Categorization Engine

---

## Current Features Status

* Authentication ✅
* Expense Tracking ✅
* Budget Management ✅
* Family Finance ✅
* Dashboard ✅
* AI Categorization ✅
* Analytics Dashboard 🚧
* PDF Reports 🚧
* Spending Prediction AI 📌

---

## Future Enhancements

* PDF Financial Reports
* AI Spending Prediction
* Advanced Financial Analytics
* Savings Goal Tracking
* Investment Insights

---
## Installation

### Backend Setup
1. cd backend
2. npm install
3. Create .env file (copy from .env.example)
4. Add your MongoDB URI, API keys
5. npm start

### Frontend Setup
1. cd frontend
2. npm install
3. npx expo start

## Test Account
Email: demo@test.com
Password: demo123

## API Endpoints
POST /api/auth/register
POST /api/auth/login
POST /api/expenses
GET /api/analytics
... (list more)

## Author

Chetan Murudkar

Final Year Project – FinSync OS

