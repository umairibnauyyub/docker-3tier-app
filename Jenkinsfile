pipeline {
    agent any

    environment {
        SONARQUBE_URL = 'http://localhost:9000' // Replace if needed
        SONAR_TOKEN = credentials('sonar-token') // Jenkins credentials ke under token save karo
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

        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Running SonarQube analysis...'
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=docker-3tier-app \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONARQUBE_URL \
                        -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Run App') {
            steps {
                echo '🚀 Running app using Docker Compose...'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        success {
            echo '✅ Build and Sonar analysis done!'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}
