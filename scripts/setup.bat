@echo off
REM Training Plan Manager - Setup Script
REM Runs the interactive setup wizard inside Docker (no Node.js needed)
REM
REM Usage: scripts\setup.bat

cd /d "%~dp0.."

REM Ensure data directory exists
if not exist "data" mkdir data

REM Run setup inside Docker using the app image
docker run --rm -it -v "%cd%\data:/app/data" -w /app/setup training-plan-manager:2.1.0-dev node setup.js %*
