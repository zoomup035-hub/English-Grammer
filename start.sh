#!/bin/bash

# English Grammar Master - Quick Start Script
# This script starts a local server for the app

echo "🚀 Starting English Grammar Master..."
echo ""

# Check if port 8000 is available
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 8000 is already in use!"
    echo "Trying port 8001..."
    PORT=8001
else
    PORT=8000
fi

echo "📡 Starting server on port $PORT..."
echo ""
echo "✅ App will be available at:"
echo "   http://localhost:$PORT"
echo ""
echo "💡 Tips:"
echo "   - Open the URL in your browser"
echo "   - Press Ctrl+C to stop the server"
echo "   - For PWA features, use Chrome or Edge"
echo ""
echo "----------------------------------------"
echo ""

# Start Python HTTP server
python3 -m http.server $PORT
