pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
    // Use the generic wrapper instead of the declarative ansiColor option
    wrap([$class: 'AnsiColorBuildWrapper', colorMapName: 'xterm'])
  }

  tools {
    nodejs 'NodeJS-Latest' // configure this in Manage Jenkins > Global Tool Config
  }

  environment {
    // Secrets: use Secret Text credentials in Jenkins with these IDs
    NEXT_PUBLIC_TMDB_API_KEY          = credentials('tmdb-api-key')
    NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN= credentials('tmdb-read-token')

    // CI sanity
    CI = 'false'
    NEXT_TELEMETRY_DISABLED = '1'
    NODE_OPTIONS = '--max_old_space_size=4096'
  }

  stages {
    stage('Checkout') {
      steps {
        echo '📥 Checking out source code...'
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[url: 'https://github.com/Phani2603/SinemaAgain.git']]
        ])
      }
    }

    stage('Node & NPM versions') {
      steps {
        sh label: 'Show Node/NPM versions (Unix)', script: 'node -v && npm -v', returnStatus: true
        bat label: 'Show Node/NPM versions (Windows)', script: 'node -v & npm -v', returnStatus: true
      }
    }

    stage('Install Dependencies') {
      steps {
        script {
          if (isUnix()) {
            // Using npm ci for clean, reproducible installs
            sh '''
              if [ -f package-lock.json ]; then
                npm ci
              else
                npm install
              fi
            '''
          } else {
            bat '''
              if exist package-lock.json (
                npm ci
              ) else (
                npm install
              )
            '''
          }
        }
      }
    }

    stage('Lint (non-blocking)') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run lint || echo "Lint warnings detected; proceeding"'
          } else {
            bat 'npm run lint || echo Lint warnings detected; proceeding'
          }
        }
      }
    }

    stage('Build') {
      steps {
        echo '🏗️ Building Next.js application...'
        script {
          // If your build fetches TMDB, ensure Jenkins has outbound network access
          if (isUnix()) {
            sh 'npm run build'
          } else {
            bat 'npm run build'
          }
        }
      }
    }

    stage('Smoke Test (Static)') {
      when { expression { return fileExists('.next') } }
      steps {
        echo '🫧 Basic sanity: ensure .next build artifacts exist'
        script {
          if (isUnix()) {
            sh 'test -d .next && echo ".next present"'
          } else {
            bat 'if exist .next (echo .next present) else (exit /b 1)'
          }
        }
      }
    }

    // Optional: ephemeral run to prove the server boots; kills afterward.
    stage('Ephemeral Boot & Health Check') {
      when { expression { return isUnix() } } // keep simple on Linux agents
      steps {
        echo '🚀 Booting Next.js briefly for health check...'
        script {
          sh '''
            # Ensure curl exists
            which curl >/dev/null 2>&1 || (echo "curl missing" && exit 1)

            # Start on ephemeral port to avoid collisions
            PORT=3000 nohup npm start > server.log 2>&1 &
            SVPID=$!
            echo $SVPID > server.pid

            # Wait up to ~30s for readiness
            for i in $(seq 1 30); do
              curl -fsS http://localhost:3000 >/dev/null 2>&1 && READY=1 && break || sleep 1
            done

            if [ "${READY:-0}" -ne 1 ]; then
              echo "❌ Server failed to become ready"
              tail -n +1 server.log || true
              kill $SVPID || true
              exit 1
            fi

            echo "✅ Health check OK"
            curl -s -o /dev/null -w "HTTP %{http_code} in %{time_total}s\\n" http://localhost:3000

            # Clean up (don’t hog the executor)
            kill $SVPID || true
            wait $SVPID 2>/dev/null || true
          '''
        }
      }
    }
  }

  post {
    success {
      echo '🎉 Pipeline green. Archiving build outputs.'
      archiveArtifacts artifacts: '.next/**', allowEmptyArchive: false
      archiveArtifacts artifacts: 'server.log', allowEmptyArchive: true
      archiveArtifacts artifacts: 'package.json', fingerprint: true
    }
    failure {
      echo '❌ Pipeline failed—surfacing context.'
      script {
        if (isUnix()) {
          sh '''
            echo "=== Diagnostics ==="
            node -v || true
            npm -v || true
            test -f server.log && tail -n +1 server.log || echo "No server.log"
          '''
        } else {
          bat '''
            echo === Diagnostics ===
            node -v
            npm -v
            if exist server.log ( type server.log ) else ( echo No server.log )
          '''
        }
      }
    }
    always {
      // Defensive cleanup if any stray node processes remain
      script {
        if (isUnix()) {
          sh 'test -f server.pid && (kill $(cat server.pid) || true); rm -f server.pid || true'
        } else {
          bat 'taskkill /F /IM node.exe 2>nul || echo No lingering node.exe'
        }
      }
      cleanWs(deleteDirs: false, notFailBuild: true)
    }
  }
}
