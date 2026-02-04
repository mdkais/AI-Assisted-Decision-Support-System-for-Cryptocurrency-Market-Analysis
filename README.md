"# AI-Assisted-Decision-Support-System-for-Cryptocurrency-Market-Analysis"

How to Run

Task,Command- Backend

Create Virtual Environment **python -m venv venv**

Activate Venv (Windows) **venv\Scripts\activate**

Start Backend Server **uvicorn app.main:app --reload**

Install Core Dependencies **pip install fastapi uvicorn sqlalchemy psycopg2-binary requests pandas scikit-learn**

Install Security Tools **"pip install ""passlib\[bcrypt]"" ""python-jose\[cryptography]"" python-multipart"**

Install Email Validator **pip install email-validator**

Fix Bcrypt Conflict **pip uninstall bcrypt passlib then pip install bcrypt==4.0.1 passlib\[bcrypt]**

---

Task,Command- Frontend

Create React Project **npm create vite@latest . -- --template react**

Install UI \& Logic Libs **npm install axios react-router-dom recharts lucide-react**

Install Tailwind CSS **npm install -D tailwindcss postcss autoprefixer**

Initialize Tailwind **npx tailwindcss init -p**

Clean Install (Troubleshooting) **rmdir /s /q node_modules \&\& del package-lock.json \&\& npm install**

Start Frontend Server **npm run dev**

---

Task,Command- Database

Create Database **CREATE DATABASE crypto_db;**

Connect to Database **\\c crypto_db**

View Table Content **SELECT \* FROM users;**

Reset/Empty Table **TRUNCATE TABLE users;**

Delete Table (Reset Schema) **DROP TABLE users;**
