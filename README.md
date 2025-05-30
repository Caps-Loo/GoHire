# Trinity Vision

**Trinity Vision** is a full-stack job recruitment web application designed to simplify the hiring process for both internal employees and external applicants. This platform allows companies to manage job postings, applicant data, and streamline recruitment workflows through a centralized system.

## 🧩 Project Description

This project was developed as part of a collaborative effort to build a professional-grade internal job portal system.

- 👨‍💻 **Raihan Pratama** (me): Fullstack Developer – handled system architecture, frontend (React.js + Tailwind), backend (Express.js), and database integration (MySQL).
- 🧠 **Kory Despiani**: Contributed to backend and created the system flowchart.
- 📝 **Reja**: Supported frontend development, created the project proposal, and designed the presentation.

## ✨ Features

- View and manage internal job vacancies
- Submit job applications online
- Admin dashboard for managing job postings and applicant records
- Responsive and modern UI

## ⚙️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MySQL

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- MySQL server

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/trinity-vision.git
cd trinity-vision
```

2. **Install dependencies**

- Frontend:

```bash
cd client
npm install
```

- Backend:

```bash
cd server
npm install
```

3. **Database Setup**

- Create a MySQL database (e.g., `trinity_vision_db`)
- Run the SQL script to create tables if available
- Set up a `.env` file in the `server/` directory:

```
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=trinity_vision_db
PORT=5000
```

4. **Run the applications**

- Backend:

```bash
cd server
npm run start
```

- Frontend:

```bash
cd client
npm run dev
```

The app should now be running on `http://localhost:3000` (frontend) and `http://localhost:5000` (backend API).

## 📄 License

This project was created for educational purposes and portfolio demonstration.
