"""
Setup script for IPGrok Python Backend
Run this to initialize the backend
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a shell command and print status"""
    print(f"\n{'='*60}")
    print(f"🔧 {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} - SUCCESS")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - FAILED")
        print(f"Error: {e.stderr}")
        return False

def main():
    """Main setup function"""
    print("""
    ╔════════════════════════════════════════╗
    ║   IPGrok Backend Setup - Python        ║
    ║   Setting up your backend API...       ║
    ╚════════════════════════════════════════╝
    """)
    
    # Check Python version
    print(f"Python version: {sys.version}")
    
    # Step 1: Create virtual environment
    if not os.path.exists('venv'):
        if not run_command(
            f"{sys.executable} -m venv venv",
            "Creating virtual environment"
        ):
            print("⚠️  Failed to create venv, continuing without it...")
    
    # Step 2: Install dependencies
    pip_cmd = "venv/bin/pip" if os.path.exists('venv') else "pip"
    if not run_command(
        f"{pip_cmd} install -r requirements.txt",
        "Installing dependencies"
    ):
        print("❌ Failed to install dependencies")
        return False
    
    # Step 3: Check AWS credentials
    print(f"\n{'='*60}")
    print("🔐 Checking AWS credentials")
    print(f"{'='*60}")
    
    aws_configured = run_command(
        "aws sts get-caller-identity",
        "Verifying AWS credentials"
    )
    
    if not aws_configured:
        print("""
        ⚠️  AWS credentials not configured!
        
        Please configure AWS credentials:
        
        Option 1: AWS CLI
            aws configure
        
        Option 2: Environment variables
            Copy env.example to .env and fill in your credentials
        """)
    
    # Step 4: Create DynamoDB tables
    if aws_configured:
        python_cmd = "venv/bin/python" if os.path.exists('venv') else "python"
        run_command(
            f"{python_cmd} config/dynamodb.py",
            "Creating DynamoDB tables"
        )
    
    # Summary
    print(f"\n{'='*60}")
    print("🎉 Setup Complete!")
    print(f"{'='*60}")
    print("""
    Next steps:
    
    1. If AWS not configured:
       aws configure
    
    2. Start the server:
       python app.py
       
    3. Test the API:
       curl http://localhost:3001/health
    
    4. View documentation:
       cat README.md
    
    Happy coding! 🚀
    """)

if __name__ == '__main__':
    main()

