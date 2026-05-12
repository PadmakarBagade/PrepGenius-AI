#!/bin/bash
# setup.sh - One-command setup script for AI Study Planner
# Run: bash setup.sh

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   🎓 AI Study Planner Setup Script     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Copy .env.example if .env doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created backend/.env (please fill in your credentials)"
fi

cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

# Copy .env.example if .env doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created frontend/.env (please fill in your credentials)"
fi

cd ..

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   ✅ Setup Complete!                        ║"
echo "╠════════════════════════════════════════════╣"
echo "║   Next Steps:                              ║"
echo "║   1. Run your database.sql in MySQL        ║"
echo "║   2. Fill in backend/.env with your keys   ║"
echo "║   3. Fill in frontend/.env with your keys  ║"
echo "║   4. cd backend && npm run dev             ║"
echo "║   5. cd frontend && npm run dev            ║"
echo "╚════════════════════════════════════════════╝"
echo ""
