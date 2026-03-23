@echo off
echo Starting LMS Frontend on port 3000...
cd /d "%~dp0frontend"
call npm run dev
pause
