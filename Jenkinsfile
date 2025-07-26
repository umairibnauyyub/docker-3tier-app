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

        stage('Run') {
            steps {
                echo 'Running app using Docker Compose...'
                sh 'docker-compose up -d'
            }
        }
    }
}
