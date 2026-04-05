pipeline {
    agent any

    environment {
        PROJECT_KEY = "jen-son-1"
        SONAR_HOST_URL = "http://192.168.213.137:9000"
        SONAR_LOGIN = credentials('sonar-token')
        FRAMEWORK_URL = "http://127.0.0.1:8000"
        SONAR_CONFIG_ID = "1"
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
                    
                    // Récupérer les métriques SonarQube depuis ton framework
                    def metricsResponse = sh(
                        script: """
                        curl -s ${FRAMEWORK_URL}/sonar/metrics/${SONAR_CONFIG_ID}
                        """,
                        returnStdout: true
                    ).trim()
                    
                    def metrics = new groovy.json.JsonSlurper().parseText(metricsResponse)
                    
                    // Construire la requête pour la décision
                    def payload = [
                        pipeline_type: "jenkins",
                        pipeline_name: env.JOB_NAME,
                        project_name: PROJECT_KEY,
                        metrics: [
                            quality_gate: metrics.quality_gate,
                            bugs: metrics.reliability,
                            vulnerabilities: metrics.security,
                            code_smells: metrics.maintainability,
                            security_hotspots: metrics.security_hotspots,
                            coverage: metrics.coverage,
                            duplications: metrics.duplications
                        ]
                    ]
                    
                    def payloadJson = new groovy.json.JsonOutput().toJson(payload)
                    
                    def response = sh(
                        script: """
                        curl -s -X POST ${FRAMEWORK_URL}/evaluation/decide \
                            -H "Content-Type: application/json" \
                            -d '${payloadJson}'
                        """,
                        returnStdout: true
                    ).trim()

                    echo "Framework response: ${response}"

                    def json = new groovy.json.JsonSlurper().parseText(response)

                    if (json.decision == "REJECTED") {
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
