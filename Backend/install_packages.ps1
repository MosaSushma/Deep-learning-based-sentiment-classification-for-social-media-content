# install_packages.ps1
Write-Host "Installing Python packages..." -ForegroundColor Green

# Upgrade pip
python -m pip install --upgrade pip

# Install packages
$packages = @(
    "flask",
    "flask-cors", 
    "numpy",
    "scikit-learn",
    "pandas",
    "joblib",
    "python-dotenv"
)

foreach ($package in $packages) {
    Write-Host "Installing $package..." -ForegroundColor Yellow
    pip install $package
}

Write-Host "`n✅ All packages installed!" -ForegroundColor Green
Write-Host "Testing installation..." -ForegroundColor Cyan

# Test installation
python -c "
try:
    import flask
    import numpy
    import sklearn
    import pandas
    print('✅ All packages imported successfully!')
except Exception as e:
    print(f'❌ Error: {e}')
"