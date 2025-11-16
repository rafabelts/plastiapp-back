-- EVENT TYPE
CREATE TABLE event_type (
  event_type_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- USER TYPE
CREATE TABLE user_type (
  user_type_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- USER
CREATE TABLE "user" (
  user_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  birth_date DATE,
  user_type_id INT NOT NULL,
  created_by_id INT,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  FOREIGN KEY (user_type_id) REFERENCES user_type(user_type_id),
  FOREIGN KEY (created_by_id) REFERENCES "user"(user_id)
);

CREATE TABLE refresh_token (
  refresh_token_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  revoked_at TIMESTAMP NULL
);

-- EVENT
CREATE TABLE event (
  event_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  goal TEXT NOT NULL,
  event_type_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  FOREIGN KEY (event_type_id) REFERENCES event_type(event_type_id)
);

-- USER CREATES EVENT (relación "add")
CREATE TABLE user_creates_event(
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY (user_id, event_id),
  FOREIGN KEY (user_id) REFERENCES "user"(user_id),
  FOREIGN KEY (event_id) REFERENCES event(event_id)
); 

-- USER PARTICIPATES EVENT (relación "participate")
CREATE TABLE user_participates_event (
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  date_added DATE NOT NULL,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY (user_id, event_id),
  FOREIGN KEY (user_id) REFERENCES "user"(user_id),
  FOREIGN KEY (event_id) REFERENCES event(event_id)
);

-- BARTER
CREATE TABLE barter (
  barter_id SERIAL PRIMARY KEY,
  date_time TIMESTAMP NOT NULL,
  folio TEXT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

-- PLASTIC
CREATE TABLE plastic (
  plastic_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- PRODUCT CATEGORY (DEBE IR ANTES DE PRODUCT)
CREATE TABLE product_category (
  product_category_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- PRODUCT
CREATE TABLE product (
  product_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category_id INT,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES product_category(product_category_id)
);

-- DELIVER DETAIL
CREATE TABLE deliver_detail (
  barter_id INT NOT NULL,
  plastic_id INT NOT NULL,
  quantity INT NOT NULL,
  subtotal NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY (barter_id, plastic_id),
  FOREIGN KEY (barter_id) REFERENCES barter(barter_id),
  FOREIGN KEY (plastic_id) REFERENCES plastic(plastic_id)
);

-- EXCHANGE DETAIL
CREATE TABLE exchange_detail (
  barter_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  subtotal NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY (barter_id, product_id),
  FOREIGN KEY (barter_id) REFERENCES barter(barter_id),
  FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- EVENT HAS BARTER
CREATE TABLE event_has_barter (
  event_id INT NOT NULL,
  barter_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY (event_id, barter_id),
  FOREIGN KEY (event_id) REFERENCES event(event_id),
  FOREIGN KEY (barter_id) REFERENCES barter(barter_id)
);

-- EVENT HAS PLASTIC
CREATE TABLE event_has_plastic(
  event_id INT NOT NULL,
  plastic_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY (event_id, plastic_id),
  FOREIGN KEY (event_id) REFERENCES event(event_id),
  FOREIGN KEY (plastic_id) REFERENCES plastic(plastic_id)
);

-- EVENT HAS PRODUCT
CREATE TABLE event_has_product(
  event_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City') NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY (event_id, product_id),
  FOREIGN KEY (event_id) REFERENCES event(event_id),
  FOREIGN KEY (product_id) REFERENCES product(product_id)
);
