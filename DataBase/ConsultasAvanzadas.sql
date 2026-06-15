-- ============================================
-- CONSULTAS AVANZADAS - PROYECTO GESTION_FLOTA
-- ============================================

-- 1. Chofer con más viajes realizados
SELECT c.id, c.nombre, c.apellido, COUNT(v.id) AS total_viajes
FROM choferes c
JOIN viajes v ON c.id = v.chofer_id
GROUP BY c.id, c.nombre, c.apellido
ORDER BY total_viajes DESC
LIMIT 1;

-- 2. Vehículos con inspecciones vencidas (más de 1 año)
SELECT v.id, v.placa, i.fecha_inspeccion, i.estado_frenos
FROM vehiculos v
JOIN inspecciones i ON v.id = i.vehiculo_id
WHERE i.fecha_inspeccion < CURRENT_DATE - INTERVAL '1 year'
  AND i.apto_para_viaje = FALSE;

-- 3. Costos promedio de mantenimientos por tipo
SELECT m.tipo, AVG(m.costo) AS costo_promedio
FROM mantenimientos m
GROUP BY m.tipo
ORDER BY costo_promedio DESC;

-- 4. Viajes por mes y año
SELECT DATE_TRUNC('month', v.fecha_salida) AS mes, COUNT(*) AS total_viajes
FROM viajes v
GROUP BY mes
ORDER BY mes;

-- 5. Choferes sin viajes asignados
SELECT c.id, c.nombre, c.apellido
FROM choferes c
WHERE c.id NOT IN (
    SELECT v.chofer_id
    FROM viajes v
);

-- 6. Top 3 vehículos con mayor kilometraje
SELECT v.id, v.placa, v.kilometraje
FROM vehiculos v
ORDER BY v.kilometraje DESC
LIMIT 3;

-- 7. Choferes con inspecciones pendientes
SELECT c.id, c.nombre, c.apellido
FROM choferes c
LEFT JOIN inspecciones i ON c.id = i.chofer_id
WHERE i.apto_para_viaje IS NULL OR i.apto_para_viaje = FALSE;

-- 8. Total de viajes y distancia acumulada por chofer (CTE)
WITH viajes_por_chofer AS (
    SELECT v.chofer_id, COUNT(*) AS total_viajes, SUM(v.distancia_km) AS distancia_total
    FROM viajes v
    GROUP BY v.chofer_id
)
SELECT c.id, c.nombre, c.apellido, vp.total_viajes, vp.distancia_total
FROM choferes c
JOIN viajes_por_chofer vp ON c.id = vp.chofer_id
ORDER BY vp.distancia_total DESC;
