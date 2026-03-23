INSERT INTO brands (id, name) VALUES (1, 'Audi');
INSERT INTO brands (id, name) VALUES (2, 'Porsche');
INSERT INTO brands (id, name) VALUES (3, 'BMW');

INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type, body_type, status, badge, badge_type, is_saved)
VALUES (1, 1, 'RS6 Avant', 2024, 145000.00, 600, 12000, '12.4 L/100km', 'AUTOMATIC', 'GASOLINE', 'STATION_WAGON', 'AVAILABLE', 'Premium', 'success', false);

INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type, body_type, status, badge, badge_type, is_saved)
VALUES (2, 2, '911 Carrera GTS', 2023, 168000.00, 480, 5500, '10.8 L/100km', 'AUTOMATIC', 'GASOLINE', 'COUPE', 'AVAILABLE', 'New', 'info', true);

INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type, body_type, status, badge, badge_type, is_saved)
VALUES (3, 3, 'M4 Competition', 2024, 115000.00, 510, 0, '10.2 L/100km', 'AUTOMATIC', 'GASOLINE', 'COUPE', 'AVAILABLE', 'Trending', 'warning', false);

INSERT INTO car_details (id, color, description) VALUES (1, 'Nardo Grey', 'Un familiar con alma de superdeportivo. Unidad impecable con escape deportivo RS.');
INSERT INTO car_details (id, color, description) VALUES (2, 'Guards Red', 'El deportivo definitivo. Equipado con paquete Chrono y asientos deportivos eléctricos.');
INSERT INTO car_details (id, color, description) VALUES (3, 'Isle of Man Green', 'Nuevo a estrenar. Entrega inmediata en concesionario oficial Marmotor.');

INSERT INTO car_images (car_id, url, is_main) VALUES (1, 'https://images.unsplash.com/photo-1606148632349-564e8c3938f3?auto=format&fit=crop&q=80&w=1000', true);
INSERT INTO car_images (car_id, url, is_main) VALUES (1, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000', false);

INSERT INTO car_images (car_id, url, is_main) VALUES (2, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000', true);
INSERT INTO car_images (car_id, url, is_main) VALUES (2, 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?auto=format&fit=crop&q=80&w=1000', false);

INSERT INTO car_images (car_id, url, is_main) VALUES (3, 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1000', true);

INSERT INTO history_events (car_id, year, title, icon, is_completed) VALUES (1, 2024, 'Revisión pre-entrega', 'check-circle', true);
INSERT INTO history_events (car_id, year, title, icon, is_completed) VALUES (1, 2024, 'Cambio de neumáticos', 'tool', true);
INSERT INTO history_events (car_id, year, title, icon, is_completed) VALUES (2, 2023, 'Salida de fábrica', 'factory', true);
INSERT INTO history_events (car_id, year, title, icon, is_completed) VALUES (3, 2024, 'Llegada a Marmotor', 'map-pin', true);

INSERT INTO car_detail_features (car_detail_id, features) VALUES (1, 'Tracción Quattro'), (1, 'Techo Panorámico'), (1, 'Matrix LED');
INSERT INTO car_detail_features (car_detail_id, features) VALUES (2, 'Sport Chrono'), (2, 'Frenos Cerámicos');
INSERT INTO car_detail_features (car_detail_id, features) VALUES (3, 'Driving Assistant'), (3, 'Head-up Display');