#!/bin/bash
set -e
cd "$(dirname "$0")"

PORT=5173

usage() {
  echo "Usage: ./start.sh [command] [options]"
  echo ""
  echo "Commands:"
  echo "  start        Install, build, and start dev server (default)"
  echo "  stop         Stop running dev server"
  echo "  restart      Stop then start"
  echo "  build        Install deps and build only (no server)"
  echo "  install      Install dependencies only"
  echo "  clean        Remove node_modules, dist, and caches"
  echo "  reset        Clean + install + build + start"
  echo "  status       Show if dev server is running"
  echo ""
  echo "Options:"
  echo "  --no-open    Don't open browser on start"
  echo "  --no-build   Skip build step, start dev server directly"
  echo "  --port NUM   Use a different port (default: 5173)"
  echo "  -h, --help   Show this help"
}

get_pid() {
  lsof -ti :"$PORT" 2>/dev/null
}

do_stop() {
  local PID
  PID=$(get_pid)
  if [ -n "$PID" ]; then
    echo "Stopping dev server (PID $PID) on port $PORT..."
    kill "$PID" 2>/dev/null
    sleep 1
    kill -9 "$PID" 2>/dev/null
    echo "Stopped."
  else
    echo "No dev server running on port $PORT."
  fi
}

do_install() {
  if [ ! -d node_modules ]; then
    echo "Installing dependencies..."
    npm install
  else
    echo "Dependencies up to date."
  fi
}

do_build() {
  echo "Building..."
  npm run build
  echo "Build succeeded."
}

do_clean() {
  echo "Cleaning..."
  rm -rf node_modules dist .vite
  rm -rf src/**/*.tsbuildinfo tsconfig.tsbuildinfo
  echo "Cleaned node_modules, dist, and caches."
}

do_start() {
  local OPEN_FLAG="--open"
  local SKIP_BUILD=false

  for arg in "$@"; do
    case "$arg" in
      --no-open)  OPEN_FLAG="" ;;
      --no-build) SKIP_BUILD=true ;;
    esac
  done

  local PID
  PID=$(get_pid)
  if [ -n "$PID" ]; then
    echo "Dev server already running (PID $PID) on port $PORT."
    echo "Run './start.sh stop' first or './start.sh restart'."
    exit 1
  fi

  do_install

  if [ "$SKIP_BUILD" = false ]; then
    do_build
  fi

  echo "Starting dev server on port $PORT..."
  npx vite --port "$PORT" $OPEN_FLAG
}

# Parse --port and --help from any position
ARGS=()
for arg in "$@"; do
  case "$arg" in
    --port)  shift; PORT="${1:-5173}"; shift || true ;;
    -h|--help) usage; exit 0 ;;
    *) ARGS+=("$arg") ;;
  esac
done

CMD="${ARGS[0]:-start}"

case "$CMD" in
  start)   do_start "${ARGS[@]}" ;;
  stop)    do_stop ;;
  restart) do_stop; do_start "${ARGS[@]}" ;;
  build)   do_install; do_build ;;
  install) do_install ;;
  clean)   do_stop; do_clean ;;
  reset)   do_stop; do_clean; do_install; do_build; do_start "${ARGS[@]}" ;;
  status)
    PID=$(get_pid)
    if [ -n "$PID" ]; then
      echo "Dev server running (PID $PID) on port $PORT."
    else
      echo "No dev server running on port $PORT."
    fi
    ;;
  *) echo "Unknown command: $CMD"; usage; exit 1 ;;
esac
