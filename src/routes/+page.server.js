import { createPool, sql } from '@vercel/postgres'
import { POSTGRES_URL } from '$env/static/private'
import bcrypt from 'bcrypt';

async function seed() {

  const reset = await sql`
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
SET FOREIGN_KEY_CHECKS = 1;
  `

console.log('Reseted');

  const createUserTable = await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      lastname VARCHAR(255)  NOT NULL,
      ci VARCHAR(11) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `
  console.log(`Created "users" table`)


  const password = 'admin'; // Cambia esto a la contraseña deseada
  const hashedPassword = await bcrypt.hash(password, 10);
  const users = await Promise.all([
    sql`
          INSERT INTO users (name, lastname, ci, password)
          VALUES ('Juan', 'Donquis', '30847627', ${hashedPassword})
          ON CONFLICT (ci) DO NOTHING;
      `,
      sql`
          INSERT INTO users (name, lastname, ci, password)
          VALUES ('Juan', 'Villasmil', '27253194', ${hashedPassword})
          ON CONFLICT (ci) DO NOTHING;
      `,
  ])
  console.log(`Seeded ${users.length} users`)

  // ------------------------------------------ USERS

  const createPatientTable = await sql`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      ci VARCHAR(11) UNIQUE NOT NULL,
      address VARCHAR(255),
      phone_number VARCHAR(255) NOT NULL,
      sex VARCHAR(1) NOT NULL,
      age VARCHAR(3) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `
  console.log(`Created "patients" table`)


  const patients = await Promise.all([
    sql`
          INSERT INTO patients (name, lastname, ci, address, phone_number, sex, age)
          VALUES ('Jose', 'Rodriguez', '12345678', 'Calle Falsa 123', '123456789', 'M', '30')
          ON CONFLICT (ci) DO NOTHING;
      `,
  ])
  console.log(`Seeded ${users.length} users`)



  return {
    reset,
    createUserTable,
    users,
    createPatientTable,
    patients,
  }
}

export async function load() {
  const db = createPool({ connectionString: POSTGRES_URL })
  const startTime = Date.now()

  try {
    const { rows: users } = await db.query('SELECT * FROM users')
    const duration = Date.now() - startTime
    return {
      users: users,
      duration: duration,
    }
  } catch (error) {
    if (error?.message === `relation "users" does not exist`) {
      console.log(
        'Table does not exist, creating and seeding it with dummy data now...'
      )
      // Table is not created yet
      await seed()
      const { rows: users } = await db.query('SELECT * FROM users')
      const duration = Date.now() - startTime
      return {
        users: users,
        duration: duration,
      }
    } else {
      throw error
    }
  }
}
