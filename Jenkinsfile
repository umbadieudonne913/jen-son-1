pipeline {
    agent any

    environment {
        PROJECT_KEY = "mon-projet" // 🔹 adapte selon ton projet Sonar
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/umbadieudonne913/jen-son-1.git'
            }
        }

        stage('DevSecOps Framework Decision') {
            steps {
                script {

                    // 🔹 appel à TON API
                    def response = sh(
                        script: """
                        curl -s http://localhost:8000/analyze/sonar/${PROJECT_KEY}
                        """,
                        returnStdout: true
                    ).trim()

                    echo "Framework response: ${response}"

                    // 🔻 Vérification décision
                    if (response.contains("FAIL")) {
                        error "❌ Pipeline bloqué par le Framework DevSecOps"
                    } else {
                        echo "✅ Pipeline autorisé par le Framework"
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Build en cours...'
            }
        }

    }
}
