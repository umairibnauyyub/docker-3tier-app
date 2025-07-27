pipeline {
    agent any

    environment {
        SONARQUBE_SCANNER = 'SonarQubeScanner' // Jenkins > Global Tool Config m jo naam diya
        SONARQUBE_SERVER = 'MySonarServer'     // Jenkins > SonarQube servers config ka naam
    }

    stages {
        stage('Clone') {
            steps {
                echo '📥 Cloning repository...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo '🔧 Building services using Docker Compose...'
                sh 'docker-compose build'
            }
        }

        stage('Trivy Scan') {
            steps {
                echo '🔍 Scanning Docker image with Trivy (non-blocking)...'
                sh '''
                    trivy image ci-cd-3tier-prod-backend:latest \
                    --exit-code 0 \
                    --severity HIGH,CRITICAL \
                    --format table \
                    --output trivy-report.txt || true
                '''
                echo '📄 Trivy Scan Report:'
                sh 'cat trivy-report.txt'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '🧪 Running SonarQube Analysis...'
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    sh "${SONARQUBE_SCANNER}/bin/sonar-scanner \
                        -Dsonar.projectKey=docker-3tier-app \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONAR_AUTH_TOKEN"
                }
            }
        }

        stage('Run') {
            steps {
                echo '🚀 Running app using Docker Compose...'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            echo '📦 Archiving Trivy scan report...'
            archiveArtifacts artifacts: 'trivy-report.txt', fingerprint: true
        }

        success {
            echo '✅ Pipeline succeeded: Trivy report generated, SonarQube analysis done.'
        }

        failure {
            echo '❌ Pipeline failed somewhere. Check logs.'
        }
    }
}
