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
  lsof -ti :"$PORT" 2>/dev/null || true
}

do_stop() {
  local PIDS
  PIDS=$(get_pid)
  if [ -n "$PIDS" ]; then
    echo "Stopping dev server on port $PORT (PIDs: $(echo $PIDS))..."
    echo "$PIDS" | xargs kill 2>/dev/null || true
    sleep 1
    echo "$PIDS" | xargs kill -9 2>/dev/null || true
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

  local PIDS
  PIDS=$(get_pid)
  if [ -n "$PIDS" ]; then
    echo "Dev server already running (PIDs: $(echo $PIDS)) on port $PORT."
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
while [[ $# -gt 0 ]]; do
  case "$1" in
    --port)  PORT="${2:-5173}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) ARGS+=("$1"); shift ;;
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
    PIDS=$(get_pid)
    if [ -n "$PIDS" ]; then
      echo "Dev server running (PIDs: $(echo $PIDS)) on port $PORT."
    else
      echo "No dev server running on port $PORT."
    fi
    ;;
  *) echo "Unknown command: $CMD"; usage; exit 1 ;;
esac
