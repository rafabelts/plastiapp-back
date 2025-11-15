-- EVENT TYPE
CREATE TABLE event_type (
  event_type_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- EVENT
CREATE TABLE event (
  event_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  goal TEXT NOT NULL,
  event_type_id INT NOT NULL,
  FOREIGN KEY (event_type_id) REFERENCES event_type(event_type_id)
);

-- USER TYPE
CREATE TABLE user_type (
  user_type_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
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
  FOREIGN KEY (user_type_id) REFERENCES user_type(user_type_id),
  FOREIGN KEY (created_by_id) REFERENCES "user"(user_id)
);

-- USER CREATES EVENT
CREATE TABLE user_creates_event(
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  PRIMARY KEY (user_id, event_id),
  FOREIGN KEY (user_id) REFERENCES "user"(user_id),
  FOREIGN KEY (event_id) REFERENCES event(event_id)
); 

-- USER PARTICIPATE EVENT
CREATE TABLE user_participates_event (
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    date_added DATE NOT NULL,
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
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

-- PLASTIC
CREATE TABLE plastic (
    plastic_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL
);

-- PRODUCT
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL
);

-- DELIVER DETAIL
CREATE TABLE deliver_detail (
    barter_id INT NOT NULL,
    plastic_id INT NOT NULL,
    quantity INT NOT NULL,
    subtotal NUMERIC(10,2),
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
    PRIMARY KEY (barter_id, product_id),
    FOREIGN KEY (barter_id) REFERENCES barter(barter_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- EVENT HAS BARTER
CREATE TABLE event_has_barter (
    event_id INT NOT NULL,
    barter_id INT NOT NULL,
    PRIMARY KEY (event_id, barter_id),
    FOREIGN KEY (event_id) REFERENCES event(event_id),
    FOREIGN KEY (barter_id) REFERENCES barter(barter_id)
);

-- EVENT HAS PLASTIC
CREATE TABLE event_has_plastic(
    event_id INT NOT NULL,
    plastic_id INT NOT NULL,
    PRIMARY KEY (event_id, plastic_id),
    FOREIGN KEY (event_id) REFERENCES event(event_id),
    FOREIGN KEY (plastic_id) REFERENCES plastic(plastic_id)
);

-- EVENT HAS PRODUCT
CREATE TABLE event_has_product(
    event_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (event_id, product_id),
    FOREIGN KEY (event_id) REFERENCES event(event_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);
