#!/bin/bash
# NEXORA XR Color Theme Update Script
# This script systematically updates all purple/blue colors to gold theme

echo "🎨 Starting NEXORA XR Color Theme Update..."

# Define color mappings
declare -A COLOR_MAP=(
    ["rgba(130,90,220,"]="rgba(201,147,62,"
    ["rgba(168,85,247,"]="rgba(212,165,116,"
    ["rgba(120,180,255,"]="rgba(212,165,116,"
    ["rgba(96,165,250,"]="rgba(212,165,116,"
    ["rgba(200,130,255,"]="rgba(212,165,116,"
    ["rgba(180,120,255,"]="rgba(201,147,62,"
    ["rgba(236,72,153,"]="rgba(184,134,11,"
    ["rgba(140,100,220,"]="rgba(201,147,62,"
    ["rgba(99,102,241,"]="rgba(201,147,62,"
    ["rgba(180,100,220,"]="rgba(212,165,116,"
    ["rgba(100,60,200,"]="rgba(184,134,11,"
    ["rgba(124,58,237,"]="rgba(184,134,11,"
    ["rgba(109,40,217,"]="rgba(168,120,10,"
    ["rgba(56,189,248,"]="rgba(212,165,116,"
    ["rgba(14,165,233,"]="rgba(184,134,11,"
    ["rgba(219,39,119,"]="rgba(184,134,11,"
    ["#6b8ef0"]="#D4A574"
    ["#a07de8"]="#C9933E"
    ["#e06aac"]="#B8860B"
    ["#5ec4e0"]="#E6B973"
    ["#4a6fd8"]="#B8860B"
    ["#7b52c4"]="#C9933E"
    ["#c44a8f"]="#A67C00"
    ["#3d9bc8"]="#E6B973"
    ["#6b3fbf"]="#B8860B"
    ["#c4a5f0"]="#E6B973"
    ["#5a45a0"]="#A67C00"
)

# Files to update
FILES=(
    "components/Footer.tsx"
    "components/HUDOverlay.tsx"
    "components/FAQAccordion.tsx"
    "app/page.tsx"
    "app/about/page.tsx"
    "app/book-now/page.tsx"
    "app/contact/page.tsx"
    "app/faq/page.tsx"
    "app/faq/faqData.ts"
    "app/occasions/page.tsx"
    "app/pricing/page.tsx"
    "app/privacy/page.tsx"
    "app/story/[story]/page.tsx"
)

# Function to update colors in a file
update_file_colors() {
    local file=$1
    echo "  📝 Updating $file..."
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Apply each color mapping
    for old_color in "${!COLOR_MAP[@]}"; do
        new_color="${COLOR_MAP[$old_color]}"
        # Use sed for replacement (macOS compatible)
        sed -i '' "s/${old_color}/${new_color}/g" "$file"
    done
    
    echo "  ✅ $file updated"
}

# Update each file
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        update_file_colors "$file"
    else
        echo "  ⚠️  File not found: $file"
    fi
done

echo ""
echo "✨ Color theme update complete!"
echo "📋 Check COLOR_THEME_UPDATE_SUMMARY.md for details"
echo "🔙 Backup files created with .backup extension"
