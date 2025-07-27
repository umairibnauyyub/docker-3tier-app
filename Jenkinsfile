pipeline {
    agent any

    environment {
        SONARQUBE_SCANNER = 'SonarQubeScanner' // Jenkins Global Tool Config ka naam
        SONARQUBE_SERVER = 'MySonarServer'     // Jenkins SonarQube Servers config ka naam
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
                sh 'cat trivy-report.txt'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '🧪 Running SonarQube Analysis...'
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_AUTH_TOKEN')]) {
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        sh "${SONARQUBE_SCANNER}/bin/sonar-scanner \
                            -Dsonar.projectKey=docker-3tier-app \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=$SONAR_HOST_URL \
                            -Dsonar.login=$SONAR_AUTH_TOKEN"
                    }
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
            archiveArtifacts artifacts: 'trivy-report.txt', fingerprint: true
        }

        success {
            echo '✅ Pipeline succeeded: Trivy OK & SonarQube analysis done.'
        }

        failure {
            echo '❌ Pipeline failed somewhere. Check logs.'
        }
    }
}
