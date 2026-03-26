-- 1. TABLAS MAESTRAS
INSERT INTO brands (id, name) VALUES (1, 'Audi');
INSERT INTO brands (id, name) VALUES (2, 'Porsche');
INSERT INTO brands (id, name) VALUES (3, 'BMW');
INSERT INTO fuel_types (id, name) VALUES (1, 'GASOLINE');
INSERT INTO body_types (id, name) VALUES (2, 'STATION WAGON');
INSERT INTO body_types (id, name) VALUES (3, 'COUPE');

-- 2. COCHES
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (1, 1, 'RS6 Avant', 2024, 145000.00, 600, 12000, '12.4 L/100km', 'AUTOMATIC', 1, 2, 'AVAILABLE', 'Premium', 'success');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (2, 2, '911 Carrera GTS', 2023, 168000.00, 480, 5500, '10.8 L/100km', 'AUTOMATIC', 1, 3, 'AVAILABLE', 'New', 'info');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (3, 3, 'M4 Competition', 2024, 115000.00, 510, 0, '10.2 L/100km', 'AUTOMATIC', 1, 3, 'AVAILABLE', 'Trending', 'warning');

-- 3. DETALLES (car_id como PK)
INSERT INTO car_details (car_id, color, description) VALUES (1, 'Nardo Grey', 'Un familiar con alma de superdeportivo. Unidad impecable con escape deportivo RS.');
INSERT INTO car_details (car_id, color, description) VALUES (2, 'Guards Red', 'El deportivo definitivo. Equipado con paquete Chrono y asientos deportivos eléctricos.');
INSERT INTO car_details (car_id, color, description) VALUES (3, 'Isle of Man Green', 'Nuevo a estrenar. Entrega inmediata en concesionario oficial Marmotor.');

-- 4. CARACTERÍSTICAS (ElementCollection)
INSERT INTO car_features (car_detail_id, feature) VALUES (1, 'Tracción Quattro');
INSERT INTO car_features (car_detail_id, feature) VALUES (1, 'Techo Panorámico');
INSERT INTO car_features (car_detail_id, feature) VALUES (1, 'Matrix LED');
INSERT INTO car_features (car_detail_id, feature) VALUES (2, 'Sport Chrono');
INSERT INTO car_features (car_detail_id, feature) VALUES (2, 'Frenos Cerámicos');
INSERT INTO car_features (car_detail_id, feature) VALUES (3, 'Driving Assistant');
INSERT INTO car_features (car_detail_id, feature) VALUES (3, 'Head-up Display');

-- 5. IMÁGENES
INSERT INTO car_images (id, car_id, url, is_main) VALUES (1, 1, 'https://images.unsplash.com/photo-1606148632349-564e8c3938f3?auto=format&fit=crop&q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (2, 1, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000', false);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (3, 2, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (4, 2, 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?auto=format&fit=crop&q=80&w=1000', false);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (5, 3, 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1000', true);

-- 6. HISTORIAL
INSERT INTO history_events (id, car_id, year, title, icon, is_completed) VALUES (1, 1, 2024, 'Revisión pre-entrega', 'check-circle', true);
INSERT INTO history_events (id, car_id, year, title, icon, is_completed) VALUES (2, 1, 2024, 'Cambio de neumáticos', 'tool', true);
INSERT INTO history_events (id, car_id, year, title, icon, is_completed) VALUES (3, 2, 2023, 'Salida de fábrica', 'factory', true);
INSERT INTO history_events (id, car_id, year, title, icon, is_completed) VALUES (4, 3, 2024, 'Llegada a Marmotor', 'map-pin', true);