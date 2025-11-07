pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  tools {
    nodejs 'NodeJS-Latest'   // ← exact case-sensitive name you configured
  }

  environment {
    NEXT_PUBLIC_TMDB_API_KEY            = credentials('tmdb-api-key')
    NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN  = credentials('tmdb-read-token')
    CI = 'false'
    NEXT_TELEMETRY_DISABLED = '1'
    NODE_OPTIONS = '--max_old_space_size=4096'
  }

  stages {
    stage('Checkout') {
      steps {
        ansiColor('xterm') {
          echo '📥 Checking out source code...'
          git branch: 'main', url: 'https://github.com/Phani2603/SinemaAgain.git'
        }
      }
    }

    stage('Install Dependencies') {
      steps {
        ansiColor('xterm') {
          script {
            if (isUnix()) {
              sh 'if [ -f package-lock.json ]; then npm ci; else npm install; fi'
            } else {
              bat 'if exist package-lock.json ( npm ci ) else ( npm install )'
            }
          }
        }
      }
    }

    stage('Lint (non-blocking)') {
      steps {
        ansiColor('xterm') {
          script {
            if (isUnix()) {
              sh 'npm run lint || echo "Lint warnings detected; proceeding"'
            } else {
              bat 'npm run lint || echo Lint warnings detected; proceeding'
            }
          }
        }
      }
    }

    stage('Build') {
      steps {
        ansiColor('xterm') {
          echo '🏗️ Building Next.js application...'
          script {
            if (isUnix()) { sh 'npm run build' } else { bat 'npm run build' }
          }
        }
      }
    }
  }

  post {
    success {
      echo '🎉 Pipeline green. Archiving build outputs.'
      archiveArtifacts artifacts: '.next/**', allowEmptyArchive: false
      archiveArtifacts artifacts: 'package.json', fingerprint: true
    }
    failure {
      ansiColor('xterm') {
        echo '❌ Pipeline failed—surfacing context.'
        script {
          if (isUnix()) {
            sh 'node -v || true; npm -v || true'
          } else {
            bat 'node -v & npm -v'
          }
        }
      }
    }
    always {
      cleanWs(deleteDirs: false, notFailBuild: true)
    }
  }
}
