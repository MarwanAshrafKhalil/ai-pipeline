@echo off
set ACTION=
if "%1"=="--action" if not "%2"=="" set ACTION=%2
if "%1"=="start" set ACTION=start
if "%1"=="terminate" set ACTION=terminate

if "%ACTION%"=="start" (
  docker compose up -d --build
  echo Started. Frontend: http://localhost:3000  Backend: http://localhost:4000
) else if "%ACTION%"=="terminate" (
  docker compose down -v --remove-orphans
  echo Terminated.
) else (
  echo Usage: run.bat --action start ^| terminate
  echo    or: run.bat start ^| terminate
  exit /b 1
)
