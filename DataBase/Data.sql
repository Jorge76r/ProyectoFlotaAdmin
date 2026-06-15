INSERT INTO vehiculos (placa, tipo, marca, modelo, anio, kilometraje, estado) VALUES
('HND-1001', 'cabezal', 'Volvo', 'FH16', 2020, 150000, 'disponible'),
('HND-1002', 'furgon', 'Mercedes', 'Actros', 2019, 200000, 'fuera_de_servicio'),
('HND-1003', 'plataforma', 'Toyota', 'Hilux', 2021, 50000, 'en_mantenimiento'),
('HND-1004', 'cisterna', 'Scania', 'P410', 2018, 250000, 'en_viaje'),
('HND-1005', 'cabezal', 'Kenworth', 'T680', 2022, 80000, 'disponible');

INSERT INTO choferes (nombre, apellido, licencia, telefono, email, activo) VALUES
('Carlos', 'Ramírez', 'LIC-987654', '5049991111', 'carlos@example.com', TRUE),
('Ana', 'Martínez', 'LIC-123456', '5049992222', 'ana@example.com', TRUE),
('José', 'Hernández', 'LIC-654321', '5049993333', 'jose@example.com', FALSE),
('María', 'López', 'LIC-777888', '5049994444', 'maria@example.com', TRUE),
('Luis', 'Castro', 'LIC-999000', '5049995555', 'luis@example.com', TRUE);

INSERT INTO inspecciones (vehiculo_id, chofer_id, fecha_inspeccion, presion_llantas, nivel_aceite, nivel_hidraulico, nivel_refrigerante, estado_frenos, kilometraje_actual, apto_para_viaje, observaciones) VALUES
(1, 1, NOW(), 32.5, 'optimo', 'optimo', 'optimo', 'bueno', 150200, TRUE, 'Todo en orden'),
(2, 2, NOW(), 30.0, 'bajo', 'optimo', 'optimo', 'regular', 200500, FALSE, 'Aceite bajo'),
(3, 3, NOW(), 33.0, 'optimo', 'optimo', 'optimo', 'bueno', 50500, TRUE, 'Sin problemas'),
(4, 4, NOW(), 31.0, 'critico', 'bajo', 'optimo', 'malo', 250300, FALSE, 'Frenos desgastados'),
(5, 5, NOW(), 34.0, 'optimo', 'optimo', 'optimo', 'bueno', 80200, TRUE, 'Revisión completa');

INSERT INTO mantenimientos (vehiculo_id, tipo, descripcion, kilometraje, proximo_mantenimiento, costo, fecha) VALUES
(1, 'Cambio de aceite', 'Aceite sintético 15W40', 150000, 160000, 120.50, NOW()),
(2, 'Cambio de frenos', 'Pastillas delanteras', 200000, 210000, 350.00, NOW()),
(3, 'Cambio de llantas', 'Reemplazo de llantas traseras', 50000, 60000, 800.00, NOW()),
(4, 'Servicio general', 'Revisión completa de motor', 250000, 260000, 1500.00, NOW());

INSERT INTO viajes (vehiculo_id, chofer_id, inspeccion_id, origen, destino, distancia_km, consumo_estimado, fecha_salida, fecha_llegada, estado) VALUES
(1, 1, 1, 'San Pedro Sula', 'Tegucigalpa', 400, 120, NOW(), NOW() + interval '6 hours', 'programado'),
(2, 2, 2, 'La Ceiba', 'Choluteca', 600, 180, NOW(), NOW() + interval '10 hours', 'en_curso'),
(3, 3, 3, 'Puerto Cortés', 'Comayagua', 300, 90, NOW(), NOW() + interval '5 hours', 'completado'),
(4, 4, 4, 'Santa Rosa', 'Danlí', 450, 130, NOW(), NOW() + interval '7 hours', 'cancelado');

INSERT INTO alertas (vehiculo_id, tipo, severidad, mensaje, resuelta) VALUES
(2, 'Mantenimiento', 'critica', 'Cambio urgente de frenos', FALSE),
(3, 'Inspección', 'advertencia', 'Revisar presión de llantas', TRUE),
(4, 'Sistema', 'info', 'Próximo mantenimiento programado', FALSE),
(5, 'Mantenimiento', 'advertencia', 'Aceite bajo detectado', FALSE);
