pipeline {
    agent any

    environment {
        PROJECT_KEY = "jen-son-1"
        SONAR_HOST_URL = "http://localhost:9000"
        SONAR_LOGIN = credentials('sonar-token') // Token Sonar enregistré dans Jenkins Credentials
    }

    stages {

        stage('SonarQube Analysis') {
            steps {
                script {
                    echo "🔹 Lancement de l'analyse SonarQube..."
                    
                    // Récupère le chemin vers l'installation Sonar Scanner configurée dans Jenkins
                    def scannerHome = tool 'sonar-scanner'

                    // Injecte les variables d'environnement de SonarQube
                    withSonarQubeEnv('SonarQube') {
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=${PROJECT_KEY} \
                            -Dsonar.projectVersion=${BUILD_NUMBER} \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.login=${SONAR_LOGIN}
                        """
                    }
                }
            }
        }

        stage('DevSecOps Framework Decision') {
            steps {
                script {
                    echo "🔹 Appel de l'API pour la décision du Framework..."
                    
                    def response = sh(
                        script: """
                        curl -s http://localhost:8000/analyze/sonar/${PROJECT_KEY}
                        """,
                        returnStdout: true
                    ).trim()

                    echo "Framework response: ${response}"

                    // Décision stricte basée sur le JSON
                    def json = new groovy.json.JsonSlurper().parseText(response)

                    if (json.decision == "FAIL") {
                        error "❌ Pipeline bloqué par le Framework DevSecOps"
                    } else {
                        echo "✅ Pipeline autorisé par le Framework"
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo '🔹 Build en cours...'
            }
        }

    }
}
