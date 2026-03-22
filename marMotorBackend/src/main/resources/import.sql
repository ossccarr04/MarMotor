-- 1. Insertar Marcas
INSERT INTO brands (name, country) VALUES ('Porsche', 'Germany');
INSERT INTO brands (name, country) VALUES ('Tesla', 'USA');

-- 2. Insertar Coches
INSERT INTO cars (model, year, price, power, mileage, consumption, badge, badge_type, transmission, fuel_type, body_type, status, description, brand_id)
VALUES ('911 Carrera', 2024, 125000.00, 385, 0, '10.3L/100km', 'New', 'success', 'AUTOMATIC', 'GASOLINE', 'COUPE', 'AVAILABLE', 'The iconic sports car.', 1);

INSERT INTO cars (model, year, price, power, mileage, consumption, badge, badge_type, transmission, fuel_type, body_type, status, description, brand_id)
VALUES ('Model 3', 2023, 45000.00, 283, 15000, '14kWh/100km', 'Used', 'warning', 'AUTOMATIC', 'ELECTRIC', 'SEDAN', 'AVAILABLE', 'Performance electric sedan.', 2);

-- 3. Insertar CarDetails
INSERT INTO car_details (car_id, color, description) VALUES (1, 'Guards Red', 'Full leather interior in Black, Sport Chrono Package.');
INSERT INTO car_details (car_id, color, description) VALUES (2, 'Pearl White', 'Autopilot included, Premium Interior.');

-- 4. Insertar Características
INSERT INTO car_features (car_detail_id, feature) VALUES (1, 'Sport Exhaust System');
INSERT INTO car_features (car_detail_id, feature) VALUES (1, 'Bose Surround Sound');
INSERT INTO car_features (car_detail_id, feature) VALUES (2, 'Glass Roof');
INSERT INTO car_features (car_detail_id, feature) VALUES (2, 'Heated Seats');

-- 5. Insertar Imágenes (Usando Unsplash Source para fotos aleatorias de los modelos específicos)
-- Porsche 911
INSERT INTO car_images (car_id, url, is_main) VALUES (1, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000', true);
INSERT INTO car_images (car_id, url, is_main) VALUES (1, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000', false);

-- Tesla Model 3
INSERT INTO car_images (car_id, url, is_main) VALUES (2, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000', true);
INSERT INTO car_images (car_id, url, is_main) VALUES (2, 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=1000', false);

-- 6. Insertar Eventos de Historial
INSERT INTO history_events (year, title, icon, is_completed, car_id) VALUES (2024, 'Production Started', 'factory', true, 1);
INSERT INTO history_events (year, title, icon, is_completed, car_id) VALUES (2024, 'Quality Check', 'check', true, 1);
INSERT INTO history_events (year, title, icon, is_completed, car_id) VALUES (2023, 'Initial Purchase', 'shopping_cart', true, 2);

-- 7. Insertar Usuarios
INSERT INTO users (username, password, role) VALUES ('admin', '$2a$10$xyz', 'ADMIN');
INSERT INTO users (username, password, role) VALUES ('user1', '$2a$10$abc', 'USER');

-- 8. Insertar Favoritos
INSERT INTO favorites (user_id, car_id) VALUES (2, 1);