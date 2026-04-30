id="mongo-init-script"
db = db.getSiblingDB('petdate');

db.createCollection('usuarios');

db.usuarios.insertMany([
  {
    nombre: "Juan Perez",
    correo: "juan@test.com",
    contrasena: "123456",
    fechaRegistro: new Date()
  },
  {
    nombre: "Maria Lopez",
    correo: "maria@test.com",
    contrasena: "abcdef",
    fechaRegistro: new Date()
  }
]);