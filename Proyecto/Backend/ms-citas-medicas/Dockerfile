FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", \
  "-Dspring.data.mongodb.uri=mongodb://mongodb:27017/db-PetDate", \
  "-Dms-usuarios.url=http://ms-usuarios:8081", \
  "-Dms-mascotas.url=http://ms-mascotas:8082", \
  "-jar", "app.jar"]
