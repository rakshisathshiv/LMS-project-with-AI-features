@echo off
setlocal
cd /d "%~dp0"

echo === LMS setup ===

if not exist "backend\.env" (
  echo Creating backend\.env from .env.example...
  copy /Y "backend\.env.example" "backend\.env"
)

echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 exit /b 1

echo Applying database migrations...
call npx prisma migrate deploy
if errorlevel 1 exit /b 1

echo Seeding database...
call npx prisma db seed
if errorlevel 1 exit /b 1

cd ..\frontend
echo Installing frontend dependencies...
call npm install
if errorlevel 1 exit /b 1

cd ..
echo.
echo Setup complete.
echo   Demo login: demo@lms.com / password123
echo   Run start-backend.bat and start-frontend.bat in separate terminals.
pause
