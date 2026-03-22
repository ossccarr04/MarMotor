INSERT INTO brands (name) VALUES ('Audi'), ('Porsche'), ('BMW');

INSERT INTO cars (brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type, body_type, status, badge, badge_type, is_saved)
VALUES (1, 'RS6 Avant', 2024, 150000.00, 600, 5000, '12.5L/100km', 'AUTOMATIC', 'GASOLINE', 'HATCHBACK', 'AVAILABLE', 'Premium', 'success', false);

INSERT INTO cars (brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type, body_type, status, badge, badge_type, is_saved)
VALUES (2, '911 Carrera GTS', 2023, 175000.00, 480, 1200, '10.8L/100km', 'AUTOMATIC', 'GASOLINE', 'COUPE', 'AVAILABLE', 'Nuevo', 'info', true);

INSERT INTO car_details (car_id, color, description)
VALUES (1, 'Nardo Grey', 'El Audi RS6 Avant combina la practicidad de un familiar con el alma de un superdeportivo. Tracción Quattro y motor V8 bi-turbo.');

INSERT INTO car_details (car_id, color, description)
VALUES (2, 'Guards Red', 'El icono de la conducción deportiva. Esta unidad GTS incluye el paquete Sport Design y escape deportivo de serie.');

INSERT INTO car_features (car_detail_id, feature) VALUES
                                                      (1, 'Frenos Carbocerámicos'), (1, 'Sonido Bang & Olufsen'), (1, 'Eje trasero direccional'),
                                                      (2, 'Paquete Chrono'), (2, 'Asientos Sport Plus'), (2, 'Sistema de elevación de eje delantero');

INSERT INTO history_events (car_id, year, title, icon, is_completed) VALUES
                                                                         (1, 2024, 'Entrega de vehículo', 'car', true),
                                                                         (1, 2024, 'Revisión 5.000km', 'wrench', true),
                                                                         (2, 2023, 'Salida de fábrica (Stuttgart)', 'factory', true),
                                                                         (2, 2024, 'Mantenimiento preventivo', 'check', true);


INSERT INTO car_images (car_id, url, is_main) VALUES
                                                  (1, 'https://images.unsplash.com/photo-1606148632349-564e8c3938f3?q=80&w=1200', true),
                                                  (1, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200', false),
                                                  (1, 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1200', false);

INSERT INTO car_images (car_id, url, is_main) VALUES
                                                  (2, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200', true),
                                                  (2, 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?q=80&w=1200', false),
                                                  (2, 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200', false);