pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building services using Docker Compose...'
                sh 'docker-compose build'
            }
        }

        stage('Trivy Scan') {
            steps {
                echo 'Scanning Docker image with Trivy...'
                // scan backend image
                sh '''
                    trivy image ci-cd-3tier-prod-backend:latest \
                    --exit-code 1 \
                    --severity HIGH,CRITICAL \
                    --format table \
                    --output trivy-report.txt
                '''
                // show the report in Jenkins Console
                sh 'cat trivy-report.txt'
            }
        }

        stage('Run') {
            when {
                expression { currentBuild.result == null } // Only run if previous stages did not fail
            }
            steps {
                echo 'Running app using Docker Compose...'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'trivy-report.txt', fingerprint: true
        }

        failure {
            echo '❌ Pipeline failed: High/Critical vulnerabilities found in Trivy scan.'
        }

        success {
            echo '✅ Pipeline succeeded with no critical vulnerabilities.'
        }
    }
}
