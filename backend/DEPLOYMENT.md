# MUST E-Portal Laravel Deployment Guide

This guide provides step-by-step instructions for deploying the Laravel backend for the MUST E-Portal application.

## 🎯 Pre-Deployment Checklist

- [ ] PHP 8.1+ installed on server
- [ ] MySQL 8.0+ configured
- [ ] Composer installed
- [ ] SSL certificate configured
- [ ] Domain name pointed to server
- [ ] Google/Facebook OAuth apps configured

## 🚀 Production Deployment

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y php8.1 php8.1-cli php8.1-fpm php8.1-mysql php8.1-xml php8.1-mbstring php8.1-curl php8.1-zip php8.1-gd php8.1-intl

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install MySQL
sudo apt install mysql-server-8.0
sudo mysql_secure_installation
```

### 2. Application Deployment

```bash
# Clone repository
git clone <your-repo-url> /var/www/must-portal-api
cd /var/www/must-portal-api

# Install dependencies
composer install --optimize-autoloader --no-dev

# Set permissions
sudo chown -R www-data:www-data /var/www/must-portal-api
sudo chmod -R 755 /var/www/must-portal-api
sudo chmod -R 775 /var/www/must-portal-api/storage
sudo chmod -R 775 /var/www/must-portal-api/bootstrap/cache
```

### 3. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure .env file
nano .env
```

Required `.env` settings:
```env
APP_NAME="MUST E-Portal API"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.must.ac.mw

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=must_portal_prod
DB_USERNAME=must_user
DB_PASSWORD=secure_password

# OAuth Settings
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://api.must.ac.mw/api/auth/google/callback

FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=https://api.must.ac.mw/api/auth/facebook/callback

# Frontend URL
FRONTEND_URL=https://portal.must.ac.mw
```

### 4. Database Setup

```bash
# Create database user
mysql -u root -p
```

```sql
CREATE DATABASE must_portal_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'must_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON must_portal_prod.* TO 'must_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed --force

# Install Passport
php artisan passport:install --force
```

### 5. Web Server Configuration

#### Apache Configuration

Create `/etc/apache2/sites-available/must-portal-api.conf`:

```apache
<VirtualHost *:80>
    ServerName api.must.ac.mw
    DocumentRoot /var/www/must-portal-api/public
    
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName api.must.ac.mw
    DocumentRoot /var/www/must-portal-api/public

    SSLEngine on
    SSLCertificateFile /path/to/ssl/certificate.crt
    SSLCertificateKeyFile /path/to/ssl/private.key
    SSLCertificateChainFile /path/to/ssl/ca_bundle.crt

    <Directory /var/www/must-portal-api/public>
        AllowOverride All
        Require all granted
    </Directory>

    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'"

    ErrorLog ${APACHE_LOG_DIR}/must-portal-api_error.log
    CustomLog ${APACHE_LOG_DIR}/must-portal-api_access.log combined
</VirtualHost>
```

```bash
# Enable site and modules
sudo a2ensite must-portal-api.conf
sudo a2enmod rewrite ssl headers
sudo systemctl restart apache2
```

#### Nginx Configuration (Alternative)

Create `/etc/nginx/sites-available/must-portal-api`:

```nginx
server {
    listen 80;
    server_name api.must.ac.mw;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.must.ac.mw;
    root /var/www/must-portal-api/public;

    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'" always;

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/must-portal-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Optimization for Production

```bash
# Clear and cache configurations
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Generate optimized autoloader
composer dump-autoload --optimize

# Set up queue workers (if using queues)
sudo nano /etc/systemd/system/must-portal-worker.service
```

Queue worker service file:
```ini
[Unit]
Description=MUST Portal Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/must-portal-api
ExecStart=/usr/bin/php /var/www/must-portal-api/artisan queue:work --sleep=3 --tries=3
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start worker
sudo systemctl enable must-portal-worker
sudo systemctl start must-portal-worker
```

### 7. Set Up Monitoring

#### Log Rotation

Create `/etc/logrotate.d/must-portal`:
```
/var/www/must-portal-api/storage/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

#### Health Check Script

Create `/usr/local/bin/must-portal-health.sh`:
```bash
#!/bin/bash
curl -f https://api.must.ac.mw/api/health || echo "API is down" | mail -s "MUST Portal API Alert" admin@must.ac.mw
```

Make it executable and add to cron:
```bash
sudo chmod +x /usr/local/bin/must-portal-health.sh
sudo crontab -e
# Add: */5 * * * * /usr/local/bin/must-portal-health.sh
```

## 🔧 Post-Deployment Tasks

### 1. Verify Installation

```bash
# Test API endpoints
curl https://api.must.ac.mw/api/health

# Check database connection
php artisan tinker
>>> \App\Models\User::count()
```

### 2. Create Admin Users

```bash
php artisan tinker
```

```php
// Create admin user
$admin = \App\Models\User::create([
    'name' => 'System Administrator',
    'email' => 'admin@must.ac.mw',
    'password' => bcrypt('secure_admin_password'),
    'provider' => 'email',
]);
$admin->assignRole('admin');


```

### 3. Configure Backup

Create backup script `/usr/local/bin/backup-must-portal.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/must-portal"
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u must_user -p'secure_password' must_portal_prod > $BACKUP_DIR/database_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/application_$DATE.tar.gz /var/www/must-portal-api --exclude=node_modules --exclude=.git

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

Add to cron for daily backups:
```bash
sudo chmod +x /usr/local/bin/backup-must-portal.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-must-portal.sh
```

## 🔒 Security Considerations

### 1. Firewall Configuration

```bash
# UFW firewall setup
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 3306 # MySQL (restrict to localhost)
sudo ufw enable
```

### 2. Fail2Ban Configuration

```bash
sudo apt install fail2ban
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 600
findtime = 600
maxretry = 3

[apache-auth]
enabled = true
port = http,https
logpath = /var/log/apache2/*error.log

[apache-badbots]
enabled = true
port = http,https
logpath = /var/log/apache2/*access.log
```

### 3. Regular Security Updates

```bash
# Set up automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 📊 Performance Optimization

### 1. PHP-FPM Optimization

Edit `/etc/php/8.1/fpm/pool.d/www.conf`:
```ini
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
```

### 2. MySQL Optimization

Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:
```ini
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
max_connections = 200
query_cache_size = 64M
query_cache_type = 1
```

### 3. Redis Cache (Optional)

```bash
sudo apt install redis-server
```

Update `.env`:
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

## 🔄 Update Procedure

### 1. Backup Before Update

```bash
# Run backup script
/usr/local/bin/backup-must-portal.sh
```

### 2. Update Application

```bash
cd /var/www/must-portal-api

# Put in maintenance mode
php artisan down

# Pull latest changes
git pull origin main

# Install dependencies
composer install --optimize-autoloader --no-dev

# Run migrations
php artisan migrate --force

# Clear caches
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Bring back online
php artisan up
```

## 🆘 Troubleshooting

### Common Issues

1. **500 Internal Server Error**
   - Check Laravel logs: `tail -f /var/www/must-portal-api/storage/logs/laravel.log`
   - Verify file permissions
   - Check .env configuration

2. **Database Connection Issues**
   - Verify MySQL credentials
   - Check MySQL service: `sudo systemctl status mysql`
   - Test connection: `mysql -u must_user -p must_portal_prod`

3. **OAuth Issues**
   - Verify client IDs and secrets
   - Check redirect URIs match exactly
   - Ensure HTTPS is properly configured

4. **Performance Issues**
   - Check server resources: `htop`
   - Review slow query log
   - Optimize database queries

### Log Locations

- Laravel: `/var/www/must-portal-api/storage/logs/laravel.log`
- Apache: `/var/log/apache2/must-portal-api_error.log`
- Nginx: `/var/log/nginx/error.log`
- MySQL: `/var/log/mysql/error.log`

## 📞 Support Contacts

- **System Administrator**: admin@must.ac.mw
- **Technical Support**: support@must.ac.mw
- **Emergency**: +265-xxx-xxxx-xxx 