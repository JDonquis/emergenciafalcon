 CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      lastname VARCHAR(255)  NOT NULL,
      ci VARCHAR(11) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO users (name, lastname, ci, password)
          VALUES ('Juan', 'Donquis', '30847627', 'admin')
          ON CONFLICT (ci) DO NOTHING;

INSERT INTO users (name, lastname, ci, password)
          VALUES ('Juan', 'Villasmil', '27253194', 'admin')
          ON CONFLICT (ci) DO NOTHING;

-- ////////////////////////////////////////////////// USERS


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

INSERT INTO patients (name, lastname, ci, address, phone_number, sex, age)
          VALUES ('Jose', 'Rodriguez', '12345678', 'Calle Falsa 123', '123456789', 'M', '30')
          ON CONFLICT (ci) DO NOTHING

-- ////////////////////////////////////////////////// PATIENTS
