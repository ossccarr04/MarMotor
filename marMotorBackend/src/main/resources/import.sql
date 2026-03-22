-- 1. Insertar Marcas
INSERT INTO brands (name, country) VALUES ('Porsche', 'Germany');
INSERT INTO brands (name, country) VALUES ('Tesla', 'USA');

-- 2. Insertar Coches (IDs 1 y 2 generados automáticamente)
-- Campos: model, year, price, power, mileage, consumption, badge, badge_type, transmission, fuel_type, body_type, status, description, brand_id
INSERT INTO cars (model, year, price, power, mileage, consumption, badge, badge_type, transmission, fuel_type, body_type, status, description, brand_id) VALUES ('911 Carrera', 2024, 125000.00, 385, 0, '10.3L/100km', 'New', 'success', 'AUTOMATIC', 'GASOLINE', 'COUPE', 'AVAILABLE', 'The iconic sports car.', 1);
INSERT INTO cars (model, year, price, power, mileage, consumption, badge, badge_type, transmission, fuel_type, body_type, status, description, brand_id) VALUES ('Model 3', 2023, 45000.00, 283, 15000, '14kWh/100km', 'Used', 'warning', 'AUTOMATIC', 'ELECTRIC', 'SEDAN', 'AVAILABLE', 'Performance electric sedan.', 2);

-- 3. Insertar CarDetails (Relación @MapsId: el id debe coincidir con el del Car)
-- Campos: id (es el car_id), color, description
INSERT INTO car_details (car_id, color, description) VALUES (1, 'Guards Red', 'Full leather interior in Black, Sport Chrono Package.');
INSERT INTO car_details (car_id, color, description) VALUES (2, 'Pearl White', 'Autopilot included, Premium Interior.');

-- 4. Insertar Características (ElementCollection)
-- Campos: car_detail_id, feature
INSERT INTO car_features (car_detail_id, feature) VALUES (1, 'Sport Exhaust System');
INSERT INTO car_features (car_detail_id, feature) VALUES (1, 'Bose Surround Sound');
INSERT INTO car_features (car_detail_id, feature) VALUES (2, 'Glass Roof');
INSERT INTO car_features (car_detail_id, feature) VALUES (2, 'Heated Seats');

-- 5. Insertar Imágenes
-- Campos: car_id, url, is_main
INSERT INTO car_images (car_id, url, is_main) VALUES (1, 'https://example.com/porsche1.jpg', true);
INSERT INTO car_images (car_id, url, is_main) VALUES (1, 'https://example.com/porsche2.jpg', false);
INSERT INTO car_images (car_id, url, is_main) VALUES (2, 'https://example.com/tesla1.jpg', true);

-- 6. Insertar Eventos de Historial (Relacionado con CarDetail)
-- Campos: year, title, icon, is_completed, car_id (que apunta a car_detail)
INSERT INTO history_events (year, title, icon, is_completed, car_id) VALUES (2024, 'Production Started', 'factory', true, 1);
INSERT INTO history_events (year, title, icon, is_completed, car_id) VALUES (2024, 'Quality Check', 'check', true, 1);
INSERT INTO history_events (year, title, icon, is_completed, car_id) VALUES (2023, 'Initial Purchase', 'shopping_cart', true, 2);

-- 7. Insertar Usuarios
-- Campos: username, password, role
INSERT INTO users (username, password, role) VALUES ('admin', '$2a$10$xyz', 'ADMIN');
INSERT INTO users (username, password, role) VALUES ('user1', '$2a$10$abc', 'USER');

-- 8. Insertar Favoritos (ManyToMany)
-- Campos: user_id, car_id
INSERT INTO favorites (user_id, car_id) VALUES (2, 1);