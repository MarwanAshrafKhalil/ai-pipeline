@echo off
REM Runtime requirement:
REM   run.bat --action start   -> builds and launches containers (Frontend + Backend)
REM   run.bat --action terminate -> stops and removes containers, volumes, and networks cleanly
REM All dependencies are isolated in Docker (no system installs required except Docker).

set ACTION=
if "%1"=="--action" if not "%2"=="" set ACTION=%2
if "%1"=="start" set ACTION=start
if "%1"=="terminate" set ACTION=terminate

if "%ACTION%"=="start" (
  docker compose up -d --build
  echo Started. Frontend: http://localhost:3000  Backend: http://localhost:4000
) else if "%ACTION%"=="terminate" (
  REM Remove containers, volumes, and project networks
  docker compose down -v --remove-orphans
  echo Terminated.
) else (
  echo Usage: run.bat --action start ^| terminate
  echo    or: run.bat start ^| terminate
  exit /b 1
)
