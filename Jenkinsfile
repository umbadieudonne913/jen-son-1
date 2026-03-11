pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/umbadieudonne913/jen-son-1.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage("Quality Gate") {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build') {
            steps {
                sh 'echo Build OK'
            }
        }

    }
}
