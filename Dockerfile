# Use a imagem do Maven para construir o projeto
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app

# Copie o pom.xml e as dependências para baixar primeiro
COPY pom.xml .
RUN mvn dependency:go-offline

# Copie o restante do código e construa o WAR
COPY src ./src
RUN mvn clean package -DskipTests

# Use a imagem do Tomcat para rodar o aplicativo
FROM tomcat:10.1-jdk21
WORKDIR /usr/local/tomcat

# Copie o WAR gerado para o diretório webapps do Tomcat
COPY --from=build /app/target/TicTacToe.war ./webapps/

# Exponha a porta padrão do Tomcat
EXPOSE 8080

CMD ["catalina.sh", "run"]
