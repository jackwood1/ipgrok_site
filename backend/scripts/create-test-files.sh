#!/bin/bash

# Script to create test files for speed testing
# Usage: ./create-test-files.sh

echo "🚀 Creating speed test files..."

# Create 10MB test file
echo "📦 Creating 10MB.test file..."
dd if=/dev/urandom of=10MB.test bs=1m count=10 2>/dev/null

# Verify file size
FILE_SIZE=$(wc -c < 10MB.test)
EXPECTED_SIZE=$((10 * 1024 * 1024))

if [ "$FILE_SIZE" -eq "$EXPECTED_SIZE" ]; then
    echo "✅ 10MB.test created successfully (${FILE_SIZE} bytes)"
else
    echo "⚠️  Warning: File size is ${FILE_SIZE} bytes (expected ${EXPECTED_SIZE})"
fi

echo ""
echo "📤 To upload to S3, run:"
echo "   aws s3 cp 10MB.test s3://download-test-files-ipgrok/10MB.test --acl public-read"
echo ""
echo "🔍 To verify CORS access:"
echo "   curl -I https://download-test-files-ipgrok.s3.us-east-2.amazonaws.com/10MB.test"
echo ""
echo "✅ Done!"

