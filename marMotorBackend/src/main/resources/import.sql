-- MARCAS
INSERT INTO brands (id, name) VALUES (1, 'Audi');
INSERT INTO brands (id, name) VALUES (2, 'Porsche');
INSERT INTO brands (id, name) VALUES (3, 'BMW');
INSERT INTO brands (id, name) VALUES (4, 'Mercedes-Benz');
INSERT INTO brands (id, name) VALUES (5, 'Ferrari');
INSERT INTO brands (id, name) VALUES (6, 'Lamborghini');
INSERT INTO brands (id, name) VALUES (7, 'Tesla');
INSERT INTO brands (id, name) VALUES (8, 'Ford');
INSERT INTO brands (id, name) VALUES (9, 'Aston Martin');
INSERT INTO brands (id, name) VALUES (10, 'Land Rover');

-- COMBUSTIBLES
INSERT INTO fuel_types (id, name) VALUES (1, 'GASOLINA');
INSERT INTO fuel_types (id, name) VALUES (2, 'DIESEL');
INSERT INTO fuel_types (id, name) VALUES (3, 'ELECTRICO');
INSERT INTO fuel_types (id, name) VALUES (4, 'HIBRIDO');
INSERT INTO fuel_types (id, name) VALUES (5, 'HIBRIDO ENCHUFABLE');
INSERT INTO fuel_types (id, name) VALUES (6, 'GAS NATURAL');

-- CARROCERÍAS
INSERT INTO body_types (id, name) VALUES (1, 'COMPACT');
INSERT INTO body_types (id, name) VALUES (2, 'STATION WAGON');
INSERT INTO body_types (id, name) VALUES (3, 'COUPE');
INSERT INTO body_types (id, name) VALUES (4, 'SUV');
INSERT INTO body_types (id, name) VALUES (5, 'SEDAN');
INSERT INTO body_types (id, name) VALUES (6, 'CONVERTIBLE');




INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (1, 1, 'RS6 Avant', 2024, 145000.00, 600, 12000, '12.4 L/100km', 'AUTOMATIC', 1, 2, 'AVAILABLE', 'New', 'success');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (2, 2, '911 Carrera GTS', 2023, 168000.00, 480, 5500, '10.8 L/100km', 'AUTOMATIC', 1, 3, 'AVAILABLE', 'Featured', 'warning');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (3, 3, 'M4 Competition', 2024, 115000.00, 510, 0, '10.2 L/100km', 'AUTOMATIC', 1, 3, 'AVAILABLE', 'New', 'success');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (4, 4, 'AMG G63', 2024, 210000.00, 585, 0, '16.2 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'New', 'success');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (5, 4, 'EQS 580', 2023, 125000.00, 523, 1500, '0.0 L/100km', 'AUTOMATIC', 3, 5, 'AVAILABLE', NULL, NULL);
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (6, 5, 'SF90 Stradale', 2024, 485000.00, 1000, 120, '6.1 L/100km', 'AUTOMATIC', 4, 3, 'AVAILABLE', 'Featured', 'warning');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (7, 5, 'F8 Tributo', 2022, 295000.00, 720, 8900, '12.9 L/100km', 'AUTOMATIC', 1, 3, 'AVAILABLE', NULL, NULL);
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (8, 6, 'Urus Performante', 2024, 315000.00, 666, 50, '14.1 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'New', 'success');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (9, 6, 'Huracan STO', 2023, 380000.00, 640, 1200, '13.9 L/100km', 'AUTOMATIC', 1, 3, 'AVAILABLE', 'Featured', 'warning');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (10, 7, 'Model S Plaid', 2024, 105000.00, 1020, 0, '0.0 L/100km', 'AUTOMATIC', 3, 5, 'AVAILABLE', 'New', 'success');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (11, 7, 'Model Y Performance', 2023, 58000.00, 534, 12500, '0.0 L/100km', 'AUTOMATIC', 3, 4, 'AVAILABLE', NULL, NULL);
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (12, 8, 'Mustang Mach 1', 2022, 62000.00, 460, 22000, '12.0 L/100km', 'MANUAL', 1, 3, 'AVAILABLE', NULL, NULL);
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (13, 8, 'Ranger Raptor', 2024, 75000.00, 292, 0, '13.8 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'New', 'success');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (14, 9, 'Vantage V8', 2023, 165000.00, 510, 4500, '11.5 L/100km', 'AUTOMATIC', 1, 3, 'AVAILABLE', 'Featured', 'warning');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (15, 9, 'DBX 707', 2024, 245000.00, 707, 0, '14.2 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'Featured', 'warning');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (16, 10, 'Defender 110 V8', 2024, 140000.00, 525, 100, '14.5 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'New', 'success');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (17, 10, 'Range Rover Sport', 2023, 110000.00, 350, 15000, '8.2 L/100km', 'AUTOMATIC', 2, 4, 'AVAILABLE', NULL, NULL);
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (18, 1, 'RS Q8', 2024, 162000.00, 600, 0, '13.2 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'New', 'success');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (19, 2, 'Taycan Turbo S', 2023, 185000.00, 761, 5200, '0.0 L/100km', 'AUTOMATIC', 3, 5, 'AVAILABLE', 'Featured', 'warning');
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, badge, badge_type) VALUES (20, 3, 'X5 M Competition', 2024, 158000.00, 625, 0, '12.9 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'New', 'success');




INSERT INTO car_details (car_id, color, description) VALUES (1, 'Nardo Grey', 'Icono de Audi Sport. El familiar definitivo con tracción Quattro.');
INSERT INTO car_details (car_id, color, description) VALUES (2, 'Guards Red', 'Pura esencia Porsche. Unidad con escape deportivo y paquete Chrono.');
INSERT INTO car_details (car_id, color, description) VALUES (3, 'Isle of Man Green', 'BMW M original. Color de lanzamiento, nuevo a estrenar.');
INSERT INTO car_details (car_id, color, description) VALUES (4, 'Obsidian Black', 'El Clase G por excelencia. Lujo y potencia bruta V8.');
INSERT INTO car_details (car_id, color, description) VALUES (5, 'High-Tech Silver', 'Berlina de lujo eléctrica. El futuro de Mercedes-Benz.');
INSERT INTO car_details (car_id, color, description) VALUES (6, 'Rosso Corsa', 'Híbrido de 1000 caballos. La joya de Maranello.');
INSERT INTO car_details (car_id, color, description) VALUES (7, 'Giallo Modena', 'Último V8 central de Ferrari. Sonido y diseño inigualables.');
INSERT INTO car_details (car_id, color, description) VALUES (8, 'Arancio Borealis', 'Super SUV con ADN de circuito. Configuración Performante.');
INSERT INTO car_details (car_id, color, description) VALUES (9, 'Verde Citrea', 'Homologado para calle, alma de GT3. Fibra de carbono extrema.');
INSERT INTO car_details (car_id, color, description) VALUES (10, 'Midnight Cherry', 'La berlina más rápida del mundo. 0-100 en 2 segundos.');
INSERT INTO car_details (car_id, color, description) VALUES (11, 'Quicksilver', 'SUV eléctrico líder en ventas. Práctico y muy potente.');
INSERT INTO car_details (car_id, color, description) VALUES (12, 'Fighter Jet Gray', 'Edición limitada Mach 1. Cambio manual para puristas.');
INSERT INTO car_details (car_id, color, description) VALUES (13, 'Code Orange', 'Pick-up de alto rendimiento. Suspensión Fox Racing.');
INSERT INTO car_details (car_id, color, description) VALUES (14, 'China Grey', 'Diseño británico atemporal. Motor V8 biturbo.');
INSERT INTO car_details (car_id, color, description) VALUES (15, 'Apex Grey', '707 CV de puro lujo SUV.');
INSERT INTO car_details (car_id, color, description) VALUES (16, 'Carpathian Grey', 'V8 sobrealimentado. El todoterreno total con acabados Premium.');
INSERT INTO car_details (car_id, color, description) VALUES (17, 'Charente Grey', 'Elegancia y confort dinámico. Consumo eficiente diésel.');
INSERT INTO car_details (car_id, color, description) VALUES (18, 'Java Green', 'SUV deportivo con prestaciones de circuito.');
INSERT INTO car_details (car_id, color, description) VALUES (19, 'Frozen Blue', 'Deportivo eléctrico. Aceleración instantánea Porsche.');
INSERT INTO car_details (car_id, color, description) VALUES (20, 'Marina Bay Blue', 'Dinámica M en formato SUV. Unidad cargada de extras.');



INSERT INTO car_features (car_detail_id, feature) VALUES (1, 'Tracción Quattro');
INSERT INTO car_features (car_detail_id, feature) VALUES (1, 'Techo Panorámico');
INSERT INTO car_features (car_detail_id, feature) VALUES (1, 'Frenos Carbocerámicos');
INSERT INTO car_features (car_detail_id, feature) VALUES (2, 'Sport Chrono');
INSERT INTO car_features (car_detail_id, feature) VALUES (2, 'Eje trasero direccional');
INSERT INTO car_features (car_detail_id, feature) VALUES (2, 'Asientos Calefactables');
INSERT INTO car_features (car_detail_id, feature) VALUES (4, 'Escape deportivo AMG');
INSERT INTO car_features (car_detail_id, feature) VALUES (4, 'Llantas 22 pulgadas');
INSERT INTO car_features (car_detail_id, feature) VALUES (6, 'Paquete Assetto Fiorano');
INSERT INTO car_features (car_detail_id, feature) VALUES (6, 'Interior en Carbono');
INSERT INTO car_features (car_detail_id, feature) VALUES (10, 'Autopilot Premium');
INSERT INTO car_features (car_detail_id, feature) VALUES (10, 'Interior Blanco');



INSERT INTO car_images (id, car_id, url, is_main) VALUES (1, 1, 'https://images.unsplash.com/photo-1606148632349-564e8c3938f3?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (2, 2, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (3, 3, 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (4, 4, 'https://images.unsplash.com/photo-1520050206274-a1af4463404a?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (5, 5, 'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (6, 6, 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (7, 7, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (8, 8, 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (9, 9, 'https://images.unsplash.com/photo-1632243193044-670c39970932?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (10, 10, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (11, 11, 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (12, 12, 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (13, 13, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (14, 14, 'https://images.unsplash.com/photo-1603577372334-903ff05a721a?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (15, 15, 'https://images.unsplash.com/photo-1627454819213-f7724a697ce7?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (16, 16, 'https://images.unsplash.com/photo-1605515298946-d062f2e9da53?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (17, 17, 'https://images.unsplash.com/photo-1610452331707-160086701831?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (18, 18, 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (19, 19, 'https://images.unsplash.com/photo-1614200024991-aa5687842d4b?q=80&w=1000', true);
INSERT INTO car_images (id, car_id, url, is_main) VALUES (20, 20, 'https://images.unsplash.com/photo-1619362224246-382946927844?q=80&w=1000', true);


INSERT INTO history_events (id, car_id, year, title, icon, is_completed) VALUES (1, 1, 2024, 'Revisión técnica', 'check', true);
INSERT INTO history_events (id, car_id, year, title, icon, is_completed) VALUES (2, 2, 2023, 'Salida de fábrica', 'factory', true);
INSERT INTO history_events (id, car_id, year, title, icon, is_completed) VALUES (3, 3, 2024, 'Llegada a concesionario', 'map-pin', true);
INSERT INTO history_events (id, car_id, year, title, icon, is_completed) VALUES (4, 4, 2024, 'Control de calidad', 'shield', true);
INSERT INTO history_events (id, car_id, year, title, icon, is_completed) VALUES (5, 6, 2024, 'Prueba en circuito', 'activity', true);