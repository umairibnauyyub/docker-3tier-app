pipeline {
    agent any

    environment {
        IMAGE_NAME = "ci-cd-3tier-prod-backend"
        IMAGE_TAG = "latest"
    }

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
                sh '''
                docker image ls
                trivy image $IMAGE_NAME:$IMAGE_TAG --exit-code 1 --severity HIGH,CRITICAL --format table --output trivy-report.txt
                '''
            }
        }

        stage('Run') {
            when {
                expression { fileExists('trivy-report.txt') && !readFile('trivy-report.txt').contains('HIGH') }
            }
            steps {
                echo 'Trivy scan passed. Starting app using Docker Compose...'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'trivy-report.txt', fingerprint: true
        }
        failure {
            echo "❌ Pipeline failed: High/Critical vulnerabilities found in Trivy scan."
        }
    }
}
