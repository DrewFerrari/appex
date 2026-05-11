#!/bin/bash

# AppEx Affiliation Portal - Database Setup Script
# This script sets up the PostgreSQL database and runs migrations

echo "🚀 AppEx Affiliation Portal - Database Setup"
echo "=========================================="

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   On Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "   On macOS: brew install postgresql"
    echo "   On Windows: Download from https://www.postgresql.org/download/windows/"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 -U postgres &> /dev/null; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL service."
    echo "   On Ubuntu/Debian: sudo systemctl start postgresql"
    echo "   On macOS: brew services start postgresql"
    echo "   On Windows: Start PostgreSQL service from Services"
    exit 1
fi

echo "✅ PostgreSQL is running on localhost:5432"

# Create database
echo "📦 Creating database 'appex_affiliate_portal'..."
createdb -h localhost -p 5432 -U postgres appex_affiliate_portal 2>/dev/null || echo "Database already exists"

# Run setup script
echo "🔧 Running database setup script..."
psql -h localhost -p 5432 -U postgres -d appex_affiliate_portal -f scripts/database-setup.sql

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "📋 Database Summary:"
    echo "   - Database: appex_affiliate_portal"
    echo "   - User: postgres"
    echo "   - Tables: 11 tables created"
    echo "   - Indexes: Performance indexes created"
    echo "   - Admin User: admin@appexaffiliation.com (password: admin123)"
    echo "   - Test User: user@appexaffiliation.com (password: user123)"
    echo ""
    echo "🎉 Database is ready for the application!"
else
    echo "❌ Database setup failed!"
    echo "   Please check the error messages above."
    exit 1
fi

# Test connection with application credentials
echo "🔍 Testing database connection with application credentials..."
psql -h localhost -p 5432 -U postgres -d appex_affiliate_portal -c "SELECT 'Connection successful!' as status;" &> /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database connection test passed!"
else
    echo "❌ Database connection test failed!"
    echo "   Please check your PostgreSQL configuration."
fi

echo ""
echo "🚀 Next Steps:"
echo "   1. Install dependencies: cd api && npm install"
echo "   2. Test connections: node scripts/test-connections.js"
echo "   3. Start backend: cd api && npm run dev"
echo "   4. Start frontend: cd web && npm run dev"
