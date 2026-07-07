@echo off
echo Setting up Frontend for Sentiment Analysis Project
echo =================================================

cd frontend

echo Installing dependencies...
call npm install

echo Installing additional packages...
call npm install axios react-router-dom react-icons chart.js react-chartjs-2

echo Installing Tailwind CSS...
call npm install -D tailwindcss postcss autoprefixer
call npx tailwindcss init -p

echo Creating Tailwind config...
echo /** @type {import('tailwindcss').Config} */ > tailwind.config.js
echo module.exports = { >> tailwind.config.js
echo   content: [ >> tailwind.config.js
echo     "./src/**/*.{js,jsx,ts,tsx}", >> tailwind.config.js
echo   ], >> tailwind.config.js
echo   theme: { >> tailwind.config.js
echo     extend: {}, >> tailwind.config.js
echo   }, >> tailwind.config.js
echo   plugins: [], >> tailwind.config.js
echo } >> tailwind.config.js

echo Creating CSS files...
if not exist src\styles mkdir src\styles
echo @tailwind base; > src\styles\index.css
echo @tailwind components; >> src\styles\index.css
echo @tailwind utilities; >> src\styles\index.css
echo. >> src\styles\index.css
echo body { >> src\styles\index.css
echo   margin: 0; >> src\styles\index.css
echo   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', >> src\styles\index.css
echo     'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', >> src\styles\index.css
echo     sans-serif; >> src\styles\index.css
echo   -webkit-font-smoothing: antialiased; >> src\styles\index.css
echo   -moz-osx-font-smoothing: grayscale; >> src\styles\index.css
echo } >> src\styles\index.css

echo.
echo Setup Complete!
echo.
echo To start the frontend, run:
echo   cd frontend
echo   npm start
echo.
pause