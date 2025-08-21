# Use uma imagem base oficial com Java
FROM openjdk:21-jdk-slim

# Adicione o volume para o contêiner
VOLUME /tmp

# Copia o arquivo .jar da sua aplicação para o contêiner
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Roda a aplicação com o Java
ENTRYPOINT ["java","-jar","/app.jar"]