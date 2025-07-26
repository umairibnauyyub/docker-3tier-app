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
                echo 'Building Docker image...'
                sh 'docker build -t 3tier-app:latest .'
            }
        }
        stage('Run') {
            steps {
                echo 'Running Docker container...'
                sh 'docker run -d -p 8080:80 3tier-app:latest'
            }
        }
    }
}

