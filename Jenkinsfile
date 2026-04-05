pipeline {
    agent any

    environment {
        PROJECT_KEY = "jen-son-1"
        SONAR_HOST_URL = "http://192.168.213.137:9000"
        SONAR_LOGIN = credentials('sonar-token')
        FRAMEWORK_URL = "http://127.0.0.1:8000"
        SONAR_CONFIG_ID = "2"
    }

    stages {

        stage('SonarQube Analysis') {
            steps {
                script {
                    echo "🔹 Lancement de l'analyse SonarQube..."
                    
                    def scannerHome = tool 'sonar-scanner'

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
                    
                    // Attendre un peu que SonarQube traite les données
                    sleep(time: 5, unit: 'SECONDS')
                    
                    // Récupérer les métriques
                    def metricsResponse = sh(
                        script: """
                        curl -s ${FRAMEWORK_URL}/sonar/metrics/${SONAR_CONFIG_ID}
                        """,
                        returnStdout: true
                    ).trim()
                    
                    echo "Metrics response: ${metricsResponse}"
                    
                    // Construire manuellement le JSON pour la requête POST
                    def payload = """
                    {
                        "pipeline_type": "jenkins",
                        "pipeline_name": "${env.JOB_NAME}",
                        "project_name": "${PROJECT_KEY}",
                        "metrics": ${metricsResponse}
                    }
                    """
                    
                    echo "Payload: ${payload}"
                    
                    def response = sh(
                        script: """
                        curl -s -X POST ${FRAMEWORK_URL}/evaluation/decide \
                            -H "Content-Type: application/json" \
                            -d '${payload}'
                        """,
                        returnStdout: true
                    ).trim()

                    echo "Framework response: ${response}"

                    if (response.contains('"decision":"REJECTED"') || response.contains('"decision": "REJECTED"')) {
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
