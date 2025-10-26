#!/bin/bash

echo "🎱 Lotto App Setup Script"
echo "========================"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled. Exiting..."
        exit 0
    fi
fi

# Create .env from example
echo "Creating .env file from template..."
cp .env.example .env

# Generate AUTH0_SECRET
echo ""
echo "Generating AUTH0_SECRET..."
AUTH0_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
sed -i '' "s/your-super-secret-key-min-32-characters-long/$AUTH0_SECRET/" .env
echo "✓ AUTH0_SECRET generated"

echo ""
echo "📋 Now you need to fill in the following values in .env:"
echo ""
echo "1. DATABASE_URL (from Supabase)"
echo "2. AUTH0_CLIENT_ID (from Auth0 Regular Web App)"
echo "3. AUTH0_ISSUER_BASE_URL (your Auth0 tenant URL)"
echo "4. AUTH0_M2M_DOMAIN (your Auth0 tenant domain)"
echo "5. AUTH0_M2M_AUDIENCE (your Auth0 API identifier)"
echo ""
echo "See SETUP_GUIDE.md for detailed instructions on getting these values."
echo ""

read -p "Press Enter to open .env file for editing..."
${EDITOR:-nano} .env

echo ""
read -p "Have you filled in all the required values? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please complete the .env file and run this script again."
    exit 0
fi

# Check if DATABASE_URL is set
source .env
if [[ $DATABASE_URL == *"user:password"* ]]; then
    echo "⚠️  DATABASE_URL still contains placeholder values!"
    echo "Please update it with your actual Supabase connection string."
    exit 1
fi

echo ""
echo "🔧 Setting up database..."
echo ""

# Generate Prisma Client
echo "Generating Prisma Client..."
npm run prisma:generate

# Run migrations
echo ""
echo "Running database migrations..."
npm run prisma:migrate

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Visit http://localhost:3000"
echo "3. Test M2M endpoints: ./scripts/test-m2m.sh"
echo ""
echo "📖 For full deployment instructions, see SETUP_GUIDE.md"
