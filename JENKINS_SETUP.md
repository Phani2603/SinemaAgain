# Jenkins Setup Guide for SinemaAgain

## Prerequisites
- Jenkins server installed and running
- Git installed on Jenkins server
- Internet access for npm packages

## Step-by-Step Setup Instructions

### 1. Install Required Jenkins Plugins

Go to **Jenkins Dashboard → Manage Jenkins → Manage Plugins → Available**

Install these plugins:
- ✅ **NodeJS Plugin** (for Node.js support)
- ✅ **Git Plugin** (usually pre-installed)
- ✅ **Pipeline Plugin** (usually pre-installed)
- ✅ **Credentials Plugin** (usually pre-installed)
- ✅ **Build Timeout Plugin** (optional, recommended)

Click "Install without restart" or "Download now and install after restart"

### 2. Configure Node.js Tool

1. Go to **Manage Jenkins → Tools** (or **Global Tool Configuration**)
2. Scroll down to **NodeJS installations** section
3. Click **Add NodeJS**
4. Configure:
   - **Name**: `NodeJS-Latest` ⚠️ (MUST match exactly)
   - **Install automatically**: ✅ Check this
   - **Installer**: Select "Install from nodejs.org"
   - **Version**: Select `20.x.x` (latest LTS available)
   - **Global npm packages to install**: leave empty or optionally add `npm@latest`
5. Click **Apply** and **Save**

**⚠️ CRITICAL:** 
- The name must be exactly `NodeJS-Latest` to match the Jenkinsfile!
- Make sure "Install automatically" is checked
- If you don't see NodeJS section, verify the NodeJS Plugin is installed

### 3. Add TMDB API Credentials

1. Go to **Manage Jenkins → Manage Credentials**
2. Click on **(global)** domain
3. Click **Add Credentials**

**First Credential (TMDB API Key):**
- Kind: `Secret text`
- Scope: `Global`
- Secret: `[Your TMDB v3 API Key]`
- ID: `tmdb-api-key`
- Description: `TMDB API Key for SinemaAgain`

**Second Credential (TMDB Read Access Token):**
- Kind: `Secret text`
- Scope: `Global`
- Secret: `[Your TMDB v4 Read Access Token]`
- ID: `tmdb-read-token`
- Description: `TMDB Read Access Token for SinemaAgain`

Click **OK** for both.

### 4. Create Jenkins Pipeline Job

1. Go to **Jenkins Dashboard**
2. Click **New Item**
3. Enter item name: `SinemaAgain-Pipeline`
4. Select **Pipeline**
5. Click **OK**

### 5. Configure Pipeline Job

In the job configuration page:

**General Section:**
- ✅ Check "GitHub project"
- Project url: `https://github.com/Phani2603/SinemaAgain`

**Build Triggers:** (optional)
- ✅ Check "GitHub hook trigger for GITScm polling" (if you want auto-builds)
- ✅ Check "Poll SCM" with schedule: `H/5 * * * *` (check every 5 minutes)

**Pipeline Section:**
- Definition: `Pipeline script from SCM`
- SCM: `Git`
- Repository URL: `https://github.com/Phani2603/SinemaAgain.git`
- Branch Specifier: `*/main`
- Script Path: `Jenkinsfile`

Click **Save**

### 6. Configure Port Access (if needed)

If Jenkins is on a remote server, you might need to:

1. **Open port 3000** in firewall:
   ```bash
   # On Ubuntu/Debian
   sudo ufw allow 3000
   
   # On CentOS/RHEL
   sudo firewall-cmd --permanent --add-port=3000/tcp
   sudo firewall-cmd --reload
   ```

2. **Configure Jenkins reverse proxy** (optional):
   - Add location block in nginx/apache config
   - Proxy `/sinema` to `localhost:3000`

### 7. Run Your First Build

1. Go to your **SinemaAgain-Pipeline** job
2. Click **Build Now**
3. Watch the **Console Output** for progress
4. Look for the success message with URLs:
   ```
   ✅ Server started successfully!
   📱 Application is now accessible at:
      🌐 Network: http://YOUR_JENKINS_IP:3000
      🏠 Local: http://localhost:3000
   ```

### 8. Access Your Application

After successful build:
- **If Jenkins is local**: `http://localhost:3000`
- **If Jenkins is remote**: `http://YOUR_JENKINS_SERVER_IP:3000`
- **Via browser**: Open the URL shown in build logs

### Troubleshooting

**Build Fails at Dependencies:**
```bash
# SSH into Jenkins server and run:
sudo npm install -g npm@latest
```

**Port 3000 already in use:**
```bash
# Kill existing processes:
sudo pkill -f "npm start"
sudo pkill -f "node"
```

**Permission issues:**
```bash
# Give Jenkins user permissions:
sudo chown -R jenkins:jenkins /var/lib/jenkins/workspace/
```

**Node.js not found:**
- Verify NodeJS plugin is installed (version 1.6.5 or later)
- Check Tools → NodeJS installations
- Ensure the name is exactly `NodeJS-Latest`
- Verify "Install automatically" is checked
- Restart Jenkins service if needed

**Windows-specific issues:**
- On Windows Jenkins, the tools path uses `;` separator instead of `:`
- Commands use `bat` instead of `sh`
- Process management uses `taskkill` instead of `pkill`

## Expected Output

When successful, you'll see:
```
✅ Server started successfully!
📱 Application is now accessible at:
   🌐 Network: http://192.168.1.100:3000
   🏠 Local: http://localhost:3000
   💻 Jenkins Server: http://127.0.0.1:3000

=== Server Response Test ===
HTTP Status: 200
Response Time: 0.234s
```

## Managing the Server

**To stop the server:**
```bash
pkill -f "npm start"
```

**To check server status:**
```bash
ps aux | grep "npm start"
curl http://localhost:3000
```

**To view logs:**
```bash
tail -f /var/lib/jenkins/workspace/SinemaAgain-Pipeline/server.log
```

Your Next.js application will now be deployed and accessible via Jenkins!