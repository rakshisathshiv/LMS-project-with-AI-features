@echo off
echo Starting LMS Backend on port 5000...
cd /d "%~dp0backend"
call npm run dev
pause
