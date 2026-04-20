-- 1. TABLAS MAESTRAS
INSERT INTO brands (id, name) VALUES (1, 'Audi'), (2, 'Porsche'), (3, 'BMW'), (4, 'Mercedes-Benz'), (5, 'Ferrari'), (6, 'Lamborghini'), (7, 'Tesla'), (8, 'Ford'), (9, 'Aston Martin'), (10, 'Land Rover');

INSERT INTO fuel_types (id, name) VALUES (1, 'GASOLINA'), (2, 'DIESEL'), (3, 'ELECTRICO'), (4, 'HIBRIDO'), (5, 'HIBRIDO ENCHUFABLE'), (6, 'GAS NATURAL');

INSERT INTO body_types (id, name) VALUES (1, 'COMPACT'), (2, 'STATION WAGON'), (3, 'COUPE'), (4, 'SUV'), (5, 'SEDAN'), (6, 'CONVERTIBLE');

-- 2. COCHES (Estructura limpia con 'label')
INSERT INTO cars (id, brand_id, model, year, price, power, mileage, consumption, transmission, fuel_type_id, body_type_id, status, label, fecha_creacion, fecha_venta) VALUES
                                                                                                                                                                           (1, 1, 'RS6 Avant', 2024, 145000.00, 600, 12000, '12.4 L/100km', 'AUTOMATIC', 1, 2, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (2, 2, '911 Carrera GTS', 2023, 168000.00, 480, 5500, '10.8 L/100km', 'AUTOMATIC', 1, 3, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (3, 3, 'M4 Competition', 2024, 115000.00, 510, 0, '10.2 L/100km', 'AUTOMATIC', 1, 3, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (4, 4, 'AMG G63', 2024, 210000.00, 585, 0, '16.2 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (5, 4, 'EQS 580', 2023, 125000.00, 523, 1500, '0.0 L/100km', 'AUTOMATIC', 3, 5, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (6, 5, 'SF90 Stradale', 2024, 485000.00, 1000, 120, '6.1 L/100km', 'AUTOMATIC', 4, 3, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (7, 5, 'F8 Tributo', 2022, 295000.00, 720, 8900, '12.9 L/100km', 'AUTOMATIC', 1, 3, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (8, 6, 'Urus Performante', 2024, 315000.00, 666, 50, '14.1 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (9, 6, 'Huracan STO', 2023, 380000.00, 640, 1200, '13.9 L/100km', 'AUTOMATIC', 1, 3, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (10, 7, 'Model S Plaid', 2024, 105000.00, 1020, 0, '0.0 L/100km', 'AUTOMATIC', 3, 5, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (11, 7, 'Model Y Performance', 2023, 58000.00, 534, 12500, '0.0 L/100km', 'AUTOMATIC', 3, 4, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (12, 8, 'Mustang Mach 1', 2022, 62000.00, 460, 22000, '12.0 L/100km', 'MANUAL', 1, 3, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (13, 8, 'Ranger Raptor', 2024, 75000.00, 292, 0, '13.8 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (14, 9, 'Vantage V8', 2023, 165000.00, 510, 4500, '11.5 L/100km', 'AUTOMATIC', 1, 3, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (15, 9, 'DBX 707', 2024, 245000.00, 707, 0, '14.2 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (16, 10, 'Defender 110 V8', 2024, 140000.00, 525, 100, '14.5 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (17, 10, 'Range Rover Sport', 2023, 110000.00, 350, 15000, '8.2 L/100km', 'AUTOMATIC', 2, 4, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (18, 1, 'RS Q8', 2024, 162000.00, 600, 0, '13.2 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (19, 2, 'Taycan Turbo S', 2023, 185000.00, 761, 5200, '0.0 L/100km', 'AUTOMATIC', 3, 5, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL),
                                                                                                                                                                           (20, 3, 'X5 M Competition', 2024, 158000.00, 625, 0, '12.9 L/100km', 'AUTOMATIC', 1, 4, 'AVAILABLE', 'NONE', CURRENT_TIMESTAMP, NULL);

-- 3. DETALLES
INSERT INTO car_details (car_id, color, description) VALUES
                                                         (1, 'Nardo Grey', 'Icono de Audi Sport. El familiar definitivo con tracción Quattro.'),
                                                         (2, 'Guards Red', 'Pura esencia Porsche. Unidad con escape deportivo y paquete Chrono.'),
                                                         (3, 'Isle of Man Green', 'BMW M original. Color de lanzamiento, nuevo a estrenar.'),
                                                         (4, 'Obsidian Black', 'El Clase G por excelencia. Lujo y potencia bruta V8.'),
                                                         (5, 'High-Tech Silver', 'Berlina de lujo eléctrica. El futuro de Mercedes-Benz.'),
                                                         (6, 'Rosso Corsa', 'Híbrido de 1000 caballos. La joya de Maranello.'),
                                                         (7, 'Giallo Modena', 'Último V8 central de Ferrari. Sonido y diseño inigualables.'),
                                                         (8, 'Arancio Borealis', 'Super SUV con ADN de circuito. Configuración Performante.'),
                                                         (9, 'Verde Citrea', 'Homologado para calle, alma de GT3. Fibra de carbono extrema.'),
                                                         (10, 'Midnight Cherry', 'La berlina más rápida del mundo. 0-100 en 2 segundos.'),
                                                         (11, 'Quicksilver', 'SUV eléctrico líder en ventas. Práctico y muy potente.'),
                                                         (12, 'Fighter Jet Gray', 'Edición limitada Mach 1. Cambio manual para puristas.'),
                                                         (13, 'Code Orange', 'Pick-up de alto rendimiento. Suspensión Fox Racing.'),
                                                         (14, 'China Grey', 'Diseño británico atemporal. Motor V8 biturbo.'),
                                                         (15, 'Apex Grey', '707 CV de puro lujo SUV.'),
                                                         (16, 'Carpathian Grey', 'V8 sobrealimentado. El todoterreno total con acabados Premium.'),
                                                         (17, 'Charente Grey', 'Elegancia y confort dinámico. Consumo eficiente diésel.'),
                                                         (18, 'Java Green', 'SUV deportivo con prestaciones de circuito.'),
                                                         (19, 'Frozen Blue', 'Deportivo eléctrico. Aceleración instantánea Porsche.'),
                                                         (20, 'Marina Bay Blue', 'Dinámica M en formato SUV. Unidad cargada de extras.');

-- 4. CARACTERÍSTICAS
INSERT INTO car_features (car_detail_id, feature) VALUES
                                                      (1, 'Tracción Quattro'), (1, 'Techo Panorámico'), (1, 'Frenos Carbocerámicos'),
                                                      (2, 'Sport Chrono'), (2, 'Eje trasero direccional'), (2, 'Asientos Calefactables'),
                                                      (4, 'Escape deportivo AMG'), (4, 'Llantas 22 pulgadas'),
                                                      (6, 'Paquete Assetto Fiorano'), (6, 'Interior en Carbono'),
                                                      (10, 'Autopilot Premium'), (10, 'Interior Blanco');

-- 5. IMÁGENES
INSERT INTO car_images (id, car_id, url, is_main) VALUES
                                                      (1, 1, 'https://images.unsplash.com/photo-1606148632349-564e8c3938f3?q=80&w=1000', true),
                                                      (2, 2, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000', true),
                                                      (3, 3, 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1000', true),
                                                      (4, 4, 'https://images.unsplash.com/photo-1520050206274-a1af4463404a?q=80&w=1000', true),
                                                      (5, 5, 'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?q=80&w=1000', true),
                                                      (6, 6, 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1000', true),
                                                      (7, 7, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000', true),
                                                      (8, 8, 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1000', true),
                                                      (9, 9, 'https://images.unsplash.com/photo-1632243193044-670c39970932?q=80&w=1000', true),
                                                      (10, 10, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000', true),
                                                      (11, 11, 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000', true),
                                                      (12, 12, 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=1000', true),
                                                      (13, 13, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000', true),
                                                      (14, 14, 'https://images.unsplash.com/photo-1603577372334-903ff05a721a?q=80&w=1000', true),
                                                      (15, 15, 'https://images.unsplash.com/photo-1627454819213-f7724a697ce7?q=80&w=1000', true),
                                                      (16, 16, 'https://images.unsplash.com/photo-1605515298946-d062f2e9da53?q=80&w=1000', true),
                                                      (17, 17, 'https://images.unsplash.com/photo-1610452331707-160086701831?q=80&w=1000', true),
                                                      (18, 18, 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?q=80&w=1000', true),
                                                      (19, 19, 'https://images.unsplash.com/photo-1614200024991-aa5687842d4b?q=80&w=1000', true),
                                                      (20, 20, 'https://images.unsplash.com/photo-1619362224246-382946927844?q=80&w=1000', true);

-- 6. HISTORIAL
INSERT INTO history_events (id, car_id, year, title, icon, is_completed) VALUES
                                                                             (1, 1, 2024, 'Revisión técnica', 'check', true),
                                                                             (2, 2, 2023, 'Salida de fábrica', 'factory', true),
                                                                             (3, 3, 2024, 'Llegada a concesionario', 'map-pin', true),
                                                                             (4, 4, 2024, 'Control de calidad', 'shield', true),
                                                                             (5, 6, 2024, 'Prueba en circuito', 'activity', true);