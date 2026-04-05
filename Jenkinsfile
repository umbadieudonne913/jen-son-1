pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "http://192.168.213.137:9000"
        SONAR_LOGIN = credentials('sonar-token')
        FRAMEWORK_URL = "http://127.0.0.1:8000"
        PROJECT_KEY = "jen-son-1"
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
                    
                    sleep(time: 5, unit: 'SECONDS')
                    
                    def response = sh(
                        script: """
                        curl -s ${FRAMEWORK_URL}/evaluation/decide/sonar/${PROJECT_KEY}/${env.JOB_NAME}
                        """,
                        returnStdout: true
                    ).trim()

                    echo "Framework response: ${response}"

                    if (response.contains('"decision":"FAIL"')) {
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
