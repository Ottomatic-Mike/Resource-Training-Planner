#!/bin/bash
# Training Plan Manager - Setup Script
# Runs the interactive setup wizard inside Docker (no Node.js needed)
#
# Usage: scripts/setup.sh

cd "$(dirname "$0")/.."

# Ensure data directory exists
mkdir -p data

# Run setup inside Docker using the app image
docker run --rm -it -v "$(pwd)/data:/app/data" -w /app/setup training-plan-manager:2.1.0-dev node setup.js "$@"
