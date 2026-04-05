pipeline {
    agent any

    environment {
        PROJECT_KEY = "jen-son-1"
        SONAR_HOST_URL = "http://192.168.213.137:9000"
        SONAR_LOGIN = credentials('sonar-token')
        FRAMEWORK_URL = "http://192.168.49.2:8000"  # URL de ton framework
        SONAR_CONFIG_ID = "1"  # ID de la configuration SonarQube dans ton framework
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

        stage('Attendre analyse SonarQube') {
            steps {
                script {
                    echo "🔹 Attente de la fin de l'analyse SonarQube..."
                    timeout(time: 5, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: false
                    }
                }
            }
        }

        stage('Récupérer métriques SonarQube') {
            steps {
                script {
                    echo "🔹 Récupération des métriques SonarQube depuis le framework..."
                    
                    // Récupère les métriques depuis l'API du framework
                    def metricsResponse = sh(
                        script: """
                        curl -s http://localhost:8000/sonar/metrics/${SONAR_CONFIG_ID}
                        """,
                        returnStdout: true
                    ).trim()
                    
                    echo "Métriques récupérées: ${metricsResponse}"
                    
                    // Stocker les métriques pour l'étape suivante
                    env.SONAR_METRICS = metricsResponse
                }
            }
        }

        stage('DevSecOps Framework Decision') {
            steps {
                script {
                    echo "🔹 Appel de l'API d'évaluation pour la décision..."
                    
                    // Extraire les métriques du JSON
                    def metrics = new groovy.json.JsonSlurper().parseText(env.SONAR_METRICS)
                    
                    // Construire le payload pour l'API d'évaluation
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
                    
                    echo "Payload: ${payloadJson}"
                    
                    // Appel à l'API d'évaluation
                    def response = sh(
                        script: """
                        curl -s -X POST ${FRAMEWORK_URL}/evaluation/decide \
                            -H "Content-Type: application/json" \
                            -d '${payloadJson}'
                        """,
                        returnStdout: true
                    ).trim()
                    
                    echo "Réponse du framework: ${response}"
                    
                    // Analyser la décision
                    def decision = new groovy.json.JsonSlurper().parseText(response)
                    
                    echo "📊 Score: ${decision.total_score}% (seuil: ${decision.pass_threshold}%)"
                    echo "📝 Raison: ${decision.reason}"
                    
                    // Afficher les détails des règles appliquées
                    if (decision.rule_details) {
                        echo "📋 Règles appliquées:"
                        decision.rule_details.each { rule ->
                            if (rule.condition_met) {
                                echo "   - ${rule.name}: ${rule.metric_type} ${rule.operator} ${rule.threshold_value} (impact: ${rule.applied_impact})"
                            }
                        }
                    }
                    
                    // Décision stricte
                    if (decision.decision == "REJECTED") {
                        error "❌ Pipeline REJETÉ par le Framework DevSecOps! Score: ${decision.total_score}% < ${decision.pass_threshold}%"
                    } else {
                        echo "✅ Pipeline APPROUVÉ par le Framework! Score: ${decision.total_score}% ≥ ${decision.pass_threshold}%"
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo '🔹 Build en cours...'
                echo '🚀 Déploiement autorisé par le framework!'
            }
        }

        stage('Déploiement') {
            steps {
                echo '🔹 Déploiement en cours...'
                echo '✅ Application déployée avec succès!'
            }
        }
    }
    
    post {
        success {
            echo "🎉 Pipeline terminé avec succès!"
        }
        failure {
            echo "💥 Pipeline échoué! Consultez les logs pour plus de détails."
        }
    }
}
