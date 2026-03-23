@echo off
echo Starting LMS Backend on port 5000...
cd /d "%~dp0backend"
call node_modules\.bin\ts-node --project tsconfig.json src/index.ts
pause
