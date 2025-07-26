import bcrypt from "bcryptjs"

const run = async () => {
  const hash = await bcrypt.hash("password123", 10)
  console.log("Hash generado:", hash)
}

run()
/*
 * Este script es para generar un hash de una contraseña.
 * Úsalo para crear hashes seguros que puedas almacenar en tu base de datos.
 */