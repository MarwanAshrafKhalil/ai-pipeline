#!/usr/bin/env bash
set -e

# Accept --action start | --action terminate or positional start | terminate
ACTION=""
if [[ "$1" == "--action" && -n "${2:-}" ]]; then
  ACTION="$2"
elif [[ "$1" == "start" || "$1" == "terminate" ]]; then
  ACTION="$1"
fi

case "$ACTION" in
  start)
    docker compose up -d --build
    echo "Started. Frontend: http://localhost:3000  Backend: http://localhost:4000"
    ;;
  terminate)
    docker compose down -v --remove-orphans
    echo "Terminated."
    ;;
  *)
    echo "Usage: $0 --action start | terminate"
    echo "   or: $0 start | terminate"
    exit 1
    ;;
esac
