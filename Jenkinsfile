pipeline {
    agent any
    
    environment {
        NEXT_PUBLIC_TMDB_API_KEY = credentials('tmdb-api-key')
        NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN = credentials('tmdb-read-token')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                git branch: 'main', url: 'https://github.com/Phani2603/SinemaAgain.git'
            }
        }
        
        stage('Setup Node.js') {
            steps {
                echo '🔧 Setting up Node.js environment...'
                // Use Node.js tool configured in Jenkins
                script {
                    def nodeHome = tool name: 'NodeJS-Latest', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                    if (isUnix()) {
                        env.PATH = "${nodeHome}/bin:${env.PATH}"
                    } else {
                        env.PATH = "${nodeHome};${env.PATH}"
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                script {
                    if (isUnix()) {
                        sh 'npm --version'
                        sh 'node --version'
                        sh 'npm install'
                    } else {
                        bat 'npm --version'
                        bat 'node --version'
                        bat 'npm install'
                    }
                }
            }
        }
        
        stage('Lint Code') {
            steps {
                echo '🔍 Running code linting...'
                script {
                    if (isUnix()) {
                        sh 'npm run lint || echo "Linting issues found but continuing"'
                    } else {
                        bat 'npm run lint || echo "Linting issues found but continuing"'
                    }
                }
            }
        }
        
        stage('Build Application') {
            steps {
                echo '🏗️ Building Next.js application...'
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                    } else {
                        bat 'npm run build'
                    }
                }
            }
        }
        
        stage('Stop Previous Instance') {
            steps {
                echo '🛑 Stopping any previous server instances...'
                script {
                    if (isUnix()) {
                        sh '''
                            # Kill any existing Next.js processes
                            pkill -f "npm start" || true
                            pkill -f "next start" || true
                            sleep 2
                        '''
                    } else {
                        bat '''
                            @echo off
                            REM Kill any existing Next.js processes
                            taskkill /F /IM node.exe 2>nul || echo No Node processes found
                            timeout 2 >nul
                        '''
                    }
                }
            }
        }
        
        stage('Deploy & Start Server') {
            steps {
                echo '🚀 Starting the application server...'
                script {
                    if (isUnix()) {
                        // Start the server in background (Linux/Mac)
                        sh '''
                            nohup npm start > server.log 2>&1 &
                            echo $! > server.pid
                        '''
                        
                        // Wait for server to start
                        echo 'Waiting for server to start...'
                        sleep(20)
                        
                        // Get server information
                        def jenkinsIP = sh(
                            script: "hostname -I | awk '{print \$1}' || echo '127.0.0.1'",
                            returnStdout: true
                        ).trim()
                        
                        // Health check
                        def healthCheck = sh(
                            script: 'curl -f http://localhost:3000 --connect-timeout 15 --max-time 30',
                            returnStatus: true
                        )
                        
                        if (healthCheck == 0) {
                            echo "✅ Server started successfully!"
                            echo "📱 Application is now accessible at:"
                            echo "   🌐 Network: http://${jenkinsIP}:3000"
                            echo "   🏠 Local: http://localhost:3000"
                            echo "   💻 Jenkins Server: http://127.0.0.1:3000"
                            
                            // Show recent server logs
                            sh '''
                                echo "=== Recent Server Logs ==="
                                tail -10 server.log || echo "No logs available yet"
                            '''
                            
                            // Test the application response
                            sh '''
                                echo "=== Server Response Test ==="
                                curl -s -o /dev/null -w "HTTP Status: %{http_code}\\nResponse Time: %{time_total}s\\n" http://localhost:3000
                            '''
                            
                        } else {
                            sh '''
                                echo "❌ Server health check failed. Server logs:"
                                cat server.log || echo "No server logs available"
                            '''
                            error "Server failed to start properly"
                        }
                    } else {
                        // Start the server in background (Windows)
                        bat '''
                            @echo off
                            echo Starting npm server...
                            start /B npm start > server.log 2>&1
                        '''
                        
                        // Wait for server to start
                        echo 'Waiting for server to start...'
                        sleep(20)
                        
                        // Health check (Windows)
                        def healthCheck = bat(
                            script: 'curl -f http://localhost:3000 --connect-timeout 15 --max-time 30',
                            returnStatus: true
                        )
                        
                        if (healthCheck == 0) {
                            echo "✅ Server started successfully!"
                            echo "📱 Application is now accessible at:"
                            echo "   🏠 Local: http://localhost:3000"
                            echo "   💻 Jenkins Server: http://127.0.0.1:3000"
                            
                            // Show recent server logs
                            bat '''
                                echo === Recent Server Logs ===
                                if exist server.log (
                                    more server.log
                                ) else (
                                    echo No logs available yet
                                )
                            '''
                            
                            // Test the application response
                            bat '''
                                echo === Server Response Test ===
                                curl -s -o nul -w "HTTP Status: %%{http_code}" http://localhost:3000
                            '''
                            
                        } else {
                            bat '''
                                echo ❌ Server health check failed. Server logs:
                                if exist server.log (
                                    type server.log
                                ) else (
                                    echo No server logs available
                                )
                            '''
                            error "Server failed to start properly"
                        }
                    }
                }
            }
        }
        
        stage('Keep Server Running') {
            steps {
                echo '⏰ Server will continue running for access...'
                echo '🔗 You can now access your application!'
                echo '📝 To stop the server manually, run: pkill -f "npm start"'
                
                script {
                    // Store server info for easy access
                    if (isUnix()) {
                        def jenkinsIP = sh(
                            script: "hostname -I | awk '{print \$1}' || echo '127.0.0.1'",
                            returnStdout: true
                        ).trim()
                        
                        writeFile file: 'SERVER_INFO.txt', text: """
SinemaAgain Server Information
=============================
Status: RUNNING
Started: ${new Date()}
URLs:
  - Network: http://${jenkinsIP}:3000
  - Local: http://localhost:3000
  - Jenkins: http://127.0.0.1:3000

To stop server: pkill -f "npm start"
Server PID file: server.pid
Server logs: server.log
"""
                    } else {
                        writeFile file: 'SERVER_INFO.txt', text: """
SinemaAgain Server Information
=============================
Status: RUNNING
Started: ${new Date()}
URLs:
  - Local: http://localhost:3000
  - Jenkins: http://127.0.0.1:3000

To stop server: taskkill /F /IM node.exe
Server logs: server.log
"""
                    }
                    
                    archiveArtifacts artifacts: 'SERVER_INFO.txt', fingerprint: true
                }
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completed successfully!'
            echo '✅ SinemaAgain is now deployed and running!'
            
            // Archive important files
            archiveArtifacts artifacts: '.next/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'server.log', allowEmptyArchive: true
            archiveArtifacts artifacts: 'package.json', fingerprint: true
        }
        
        failure {
            echo '❌ Pipeline failed!'
            
            // Show error logs
            script {
                if (isUnix()) {
                    sh '''
                        echo "=== Error Investigation ==="
                        if [ -f server.log ]; then
                            echo "Server logs:"
                            cat server.log
                        fi
                        
                        echo "Process list:"
                        ps aux | grep -E "(node|npm)" || true
                    '''
                    
                    // Cleanup on failure
                    sh 'pkill -f "npm start" || true'
                } else {
                    bat '''
                        echo === Error Investigation ===
                        if exist server.log (
                            echo Server logs:
                            type server.log
                        )
                        
                        echo Process list:
                        tasklist /FI "IMAGENAME eq node.exe" 2>nul || echo No node processes found
                    '''
                    
                    // Cleanup on failure
                    bat 'taskkill /F /IM node.exe 2>nul || echo No node processes to kill'
                }
            }
        }
        
        always {
            // Clean up old log files (keep last 5 builds)  
            script {
                if (isUnix()) {
                    sh '''
                        find . -name "server.log.*" -mtime +5 -delete || true
                        find . -name "server.pid.*" -mtime +5 -delete || true
                    '''
                } else {
                    bat '''
                        forfiles /p . /m server.log.* /d -5 /c "cmd /c del @path" 2>nul || echo No old logs to clean
                        forfiles /p . /m server.pid.* /d -5 /c "cmd /c del @path" 2>nul || echo No old pid files to clean
                    '''
                }
            }
        }
    }
}