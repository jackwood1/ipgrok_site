#!/usr/bin/env python3
"""
Script to create test files for speed testing
Usage: python3 create-test-files.py
"""

import os
import sys

def create_test_file(size_mb, filename):
    """Create a test file of specified size in MB"""
    size_bytes = size_mb * 1024 * 1024
    
    print(f"📦 Creating {filename} ({size_mb}MB)...")
    
    try:
        # Create file with random data
        with open(filename, 'wb') as f:
            # Write in chunks for better performance
            chunk_size = 1024 * 1024  # 1MB chunks
            chunks = size_mb
            
            for i in range(chunks):
                f.write(os.urandom(chunk_size))
                if (i + 1) % 5 == 0:  # Progress every 5MB
                    print(f"   Progress: {i + 1}/{chunks} MB written...")
        
        # Verify file size
        actual_size = os.path.getsize(filename)
        if actual_size == size_bytes:
            print(f"✅ {filename} created successfully ({actual_size:,} bytes)")
            return True
        else:
            print(f"⚠️  Warning: File size is {actual_size:,} bytes (expected {size_bytes:,})")
            return False
            
    except Exception as e:
        print(f"❌ Error creating {filename}: {e}")
        return False

def main():
    print("🚀 Creating speed test files...\n")
    
    # Create 10MB test file
    success = create_test_file(10, "10MB.test")
    
    if success:
        print("\n" + "="*60)
        print("📤 To upload to S3, run:")
        print("   aws s3 cp 10MB.test s3://download-test-files-ipgrok/10MB.test --acl public-read")
        print("\n🔍 To verify CORS access:")
        print("   curl -I https://download-test-files-ipgrok.s3.us-east-2.amazonaws.com/10MB.test")
        print("\n✅ All done!")
        print("="*60)
        sys.exit(0)
    else:
        print("\n❌ Failed to create test files")
        sys.exit(1)

if __name__ == "__main__":
    main()

