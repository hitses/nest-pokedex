<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" /></a>
</p>

# Requisitos

1. NestJS
2. Nest CLI
3. Docker
4. MongoDB

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar `npm install`
3. Ejecutar `npm i -g @nestjs/cli`
4. Ejecutar `docker-compose up -d`
5. Clonar el archivo **.env.template** y renombrarlo a **.env**
6. Añadir las variables de entorno en el archivo **.env**
7. Ejecutar `npm run start:dev`
8. Reconstruir base de datos con el endpoint `http://localhost:3000/api/seed`
