# S3 CORS Configuration for Speed Tests

## Overview
The IPGrok speed tests require downloading test files from your S3 bucket. To allow the browser to access these files from your domain (www.ipgrok.com), you need to configure CORS (Cross-Origin Resource Sharing) on your S3 bucket.

## Required S3 Buckets

1. **download-test-files-ipgrok** - For download speed tests
2. **upload-test-files-ipgrok** - For upload speed tests (optional if using backend)

## Step-by-Step CORS Configuration

### Option 1: AWS Console (Easiest)

1. **Go to S3 Console:**
   - Navigate to https://console.aws.amazon.com/s3/
   - Select your bucket: `download-test-files-ipgrok`

2. **Configure CORS:**
   - Click on the "Permissions" tab
   - Scroll down to "Cross-origin resource sharing (CORS)"
   - Click "Edit"
   - Paste the following configuration:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "HEAD"
        ],
        "AllowedOrigins": [
            "https://www.ipgrok.com",
            "https://ipgrok.com",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000"
        ],
        "ExposeHeaders": [
            "Content-Length",
            "Content-Type",
            "ETag"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

3. **Make Bucket Public (for test files):**
   - Go to "Permissions" → "Block public access"
   - Uncheck "Block all public access"
   - Confirm the changes
   
4. **Add Bucket Policy:**
   - Go to "Permissions" → "Bucket policy"
   - Add this policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::download-test-files-ipgrok/*"
        }
    ]
}
```

### Option 2: AWS CLI

```bash
# Configure CORS
aws s3api put-bucket-cors \
  --bucket download-test-files-ipgrok \
  --cors-configuration file://cors-config.json

# Make bucket public
aws s3api delete-public-access-block \
  --bucket download-test-files-ipgrok

# Add bucket policy
aws s3api put-bucket-policy \
  --bucket download-test-files-ipgrok \
  --policy file://bucket-policy.json
```

## Creating Test Files

### Option 1: Using dd (Linux/Mac)

```bash
# Create 50MB test file
dd if=/dev/urandom of=50MB.test bs=1M count=50

# Upload to S3
aws s3 cp 50MB.test s3://download-test-files-ipgrok/50MB.test \
  --content-type application/octet-stream \
  --cache-control "public, max-age=31536000"

# Verify upload
aws s3 ls s3://download-test-files-ipgrok/
```

### Option 2: Using Python Script

Save as `create-test-file.py`:

```python
#!/usr/bin/env python3
import os

# Create 50MB file with random data
size_mb = 50
filename = f'{size_mb}MB.test'

with open(filename, 'wb') as f:
    f.write(os.urandom(size_mb * 1024 * 1024))

print(f'Created {filename}')
print(f'Upload with: aws s3 cp {filename} s3://download-test-files-ipgrok/')
```

Run:
```bash
python3 create-test-file.py
aws s3 cp 50MB.test s3://download-test-files-ipgrok/50MB.test
```

### Option 3: Using Node.js Script

```javascript
const fs = require('fs');
const crypto = require('crypto');

const sizeMB = 50;
const data = crypto.randomBytes(sizeMB * 1024 * 1024);
fs.writeFileSync('50MB.test', data);

console.log('Created 50MB.test');
console.log('Upload with: aws s3 cp 50MB.test s3://download-test-files-ipgrok/');
```

## Testing CORS Configuration

### Test 1: Verify File is Accessible
```bash
curl -I https://download-test-files-ipgrok.s3.us-east-2.amazonaws.com/50MB.test
```

Should return:
```
HTTP/1.1 200 OK
Content-Type: application/octet-stream
Content-Length: 52428800
Access-Control-Allow-Origin: *
```

### Test 2: Verify CORS Headers
```bash
curl -H "Origin: https://www.ipgrok.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://download-test-files-ipgrok.s3.us-east-2.amazonaws.com/50MB.test
```

Should return:
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://www.ipgrok.com
Access-Control-Allow-Methods: GET, HEAD
Access-Control-Max-Age: 3000
```

### Test 3: Test from Browser Console
Open browser console on www.ipgrok.com and run:
```javascript
fetch('https://download-test-files-ipgrok.s3.us-east-2.amazonaws.com/50MB.test')
  .then(r => console.log('✅ Success!', r.status))
  .catch(e => console.error('❌ Failed:', e));
```

## Troubleshooting

### Error: 403 Forbidden
- Check bucket policy allows public read
- Verify file exists in the bucket
- Check bucket region matches URL

### Error: CORS Policy Blocked
- Verify CORS configuration is saved
- Check allowed origins include your domain
- Clear browser cache and try again
- Wait a few minutes for S3 changes to propagate

### Error: 404 Not Found
- File doesn't exist - create and upload test files
- Check file path and bucket name
- Verify bucket exists in us-east-2 region

## Alternative: Use CloudFront CDN

For better global performance, put CloudFront in front of your S3 bucket:

1. Create CloudFront distribution
2. Point origin to your S3 bucket
3. Enable CORS on CloudFront
4. Update frontend to use CloudFront URL

## Current Status

**Expected Files:**
- `50MB.test` - For download speed testing

**Current Fallback:**
- If S3 files unavailable, uses 200 Mbps estimate
- Upload estimated at 15-20% of download speed
- Tests still complete, just with estimated values

## Questions?

If you encounter issues:
1. Check S3 bucket permissions
2. Verify CORS configuration
3. Test with curl commands above
4. Check CloudWatch logs for S3 access denials

