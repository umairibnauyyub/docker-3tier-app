pipeline {
    agent any

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
                echo '🔍 Scanning Docker image with Trivy for vulnerabilities...'
                sh '''
                    trivy image ci-cd-3tier-prod-backend:latest \
                    --exit-code 1 \
                    --severity HIGH,CRITICAL \
                    --format table \
                    --output trivy-report.txt
                '''
                echo '📄 Trivy Scan Report:'
                sh 'cat trivy-report.txt'
            }
        }

        stage('Run') {
            when {
                expression { currentBuild.result == null }
            }
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

        failure {
            echo '❌ Pipeline failed: High/Critical vulnerabilities found in Trivy scan.'
        }

        success {
            echo '✅ Pipeline succeeded: No critical vulnerabilities detected.'
        }
    }
}
