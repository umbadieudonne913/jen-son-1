pipeline {
    agent any

    environment {
        PROJECT_KEY = "jen-son-1"
    }

    stages {

        stage('DevSecOps Framework Decision') {
            steps {
                script {
                    def response = sh(
                        script: """
                        curl -s http://localhost:8000/analyze/sonar/${PROJECT_KEY}
                        """,
                        returnStdout: true
                    ).trim()

                    echo "Framework response: ${response}"

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
