# ProyectoFlotaAdmin
# Gestion_Flota

# 🚛 Sistema de Control Preventivo de Mantenimiento para Flotas de Carga Pesada

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)
![SQL](https://img.shields.io/badge/SQL-Queries-F29111?logo=databricks)

Sistema web para el registro, monitoreo y control preventivo de vehículos de carga pesada. Permite a los conductores registrar inspecciones técnicas pre-viaje, gestionar mantenimientos y planificar rutas, reduciendo el riesgo de fallas mecánicas en carretera.

---

## 📋 Información del Proyecto

| Campo | Detalle |
|---|---|
| **Institución** | CEUTEC – Sede Central, San Pedro Sula |
| **Docente** | María José Salinas Quiroz |
| **Sección** | 1214 |
| **Entrega** | 13/06/2026 |
---


## ⚙️ Funcionalidades Principales

- **Inspecciones pre-viaje:** Los conductores registran presión de llantas, nivel de aceite, frenos, hidráulico y refrigerante antes de cada ruta.
- **Evaluación automática:** El sistema determina si un vehículo está apto para salir a ruta según los datos registrados.
- **Alertas por severidad:** Generación automática de alertas clasificadas en `info`, `advertencia` o `crítica`.
- **Historial de mantenimientos:** Registro de cambios de aceite, frenos, llantas y servicios generales por vehículo.
- **Planificación de viajes:** Asignación de conductor, vehículo, origen, destino y cálculo de consumo estimado de combustible.
- **Estado en tiempo real:** Control del estado de cada vehículo (`disponible`, `en_viaje`, `en_mantenimiento`, `fuera_de_servicio`).

## 🗃️ Esquema de Base de Datos

El proyecto utiliza **PostgreSQL** (vía Supabase) con 6 tablas principales:

### `choferes`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT (PK) | Identificador único |
| `nombre` | TEXT | Nombre del conductor |
| `apellido` | TEXT | Apellido del conductor |
| `licencia` | TEXT UNIQUE | Número de licencia |
| `telefono` | TEXT | Número de contacto |
| `email` | TEXT | Correo electrónico |
| `activo` | BOOLEAN | Estado activo/inactivo |
| `creado_en` | TIMESTAMP | Fecha de registro |

### `vehiculos`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT (PK) | Identificador único |
| `placa` | TEXT UNIQUE | Matrícula del vehículo |
| `tipo` | TEXT | `cabezal`, `plataforma`, `cisterna`, `furgon` |
| `marca` | TEXT | Marca del vehículo |
| `modelo` | TEXT | Modelo específico |
| `anio` | INT | Año de fabricación |
| `kilometraje` | DECIMAL | Kilómetros totales recorridos |
| `estado` | TEXT | `disponible`, `en_viaje`, `en_mantenimiento`, `fuera_de_servicio` |

### `inspecciones`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT (PK) | Identificador único |
| `vehiculo_id` | INT (FK) | Vehículo inspeccionado |
| `chofer_id` | INT (FK) | Chofer que realiza la inspección |
| `fecha_inspeccion` | TIMESTAMP | Fecha y hora de la revisión |
| `presion_llantas` | DECIMAL | Presión promedio en PSI |
| `nivel_aceite` | TEXT | `optimo`, `bajo`, `critico` |
| `nivel_hidraulico` | TEXT | `optimo`, `bajo`, `critico` |
| `nivel_refrigerante` | TEXT | `optimo`, `bajo`, `critico` |
| `estado_frenos` | TEXT | `bueno`, `regular`, `malo` |
| `apto_para_viaje` | BOOLEAN | Si el vehículo puede salir a ruta |
| `observaciones` | TEXT | Comentarios del chofer |

### `mantenimientos`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT (PK) | Identificador único |
| `vehiculo_id` | INT (FK) | Vehículo que recibe el servicio |
| `tipo` | TEXT | Tipo de mantenimiento realizado |
| `descripcion` | TEXT | Detalles del servicio |
| `kilometraje` | DECIMAL | Kilometraje al momento del servicio |
| `proximo_mantenimiento` | DECIMAL | Kilometraje para el siguiente servicio |
| `costo` | DECIMAL | Costo del servicio |
| `fecha` | TIMESTAMP | Fecha del mantenimiento |

### `viajes`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT (PK) | Identificador único |
| `vehiculo_id` | INT (FK) | Vehículo asignado |
| `chofer_id` | INT (FK) | Conductor asignado |
| `inspeccion_id` | INT (FK) | Inspección previa al viaje |
| `origen` | TEXT | Ciudad o punto de salida |
| `destino` | TEXT | Ciudad o punto de llegada |
| `distancia_km` | DECIMAL | Kilómetros del recorrido |
| `consumo_estimado` | DECIMAL | Litros de combustible estimados |
| `estado` | TEXT | `programado`, `en_curso`, `completado`, `cancelado` |

### `alertas`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT (PK) | Identificador único |
| `vehiculo_id` | INT (FK) | Vehículo relacionado |
| `tipo` | TEXT | Categoría de la alerta |
| `severidad` | TEXT | `info`, `advertencia`, `critica` |
| `mensaje` | TEXT | Descripción del problema detectado |
| `resuelta` | BOOLEAN | Si la alerta fue atendida |

---

## 🔍 Consultas Avanzadas

El archivo `ConsultasAvanzadas.sql` incluye 8 consultas con JOINs, CTEs y funciones de agregación:

| # | Consulta | Técnica SQL |
|---|---|---|
| 1 | Chofer con más viajes realizados | `JOIN` + `GROUP BY` + `ORDER BY` |
| 2 | Vehículos con inspecciones vencidas (+1 año) | `JOIN` + `WHERE` con `INTERVAL` |
| 3 | Costo promedio de mantenimientos por tipo | `AVG` + `GROUP BY` |
| 4 | Viajes agrupados por mes y año | `DATE_TRUNC` + `GROUP BY` |
| 5 | Choferes sin viajes asignados | Subconsulta con `NOT IN` |
| 6 | Top 3 vehículos con mayor kilometraje | `ORDER BY DESC` + `LIMIT` |
| 7 | Choferes con inspecciones pendientes | `LEFT JOIN` + `IS NULL` |
| 8 | Distancia acumulada por chofer | CTE + `JOIN` |

---

## 🚀 Instalación

**1. Crear el esquema:**
```sql
\i Gestion_Flota.sql
```

**2. Insertar datos de prueba:**
```sql
\i Data.sql
```

**3. Ejecutar consultas avanzadas:**
```sql
\i ConsultasAvanzadas.sql
```

---

## 💡 Valor Agregado

- **Enfoque preventivo:** Alertas antes de que ocurra la falla, no después.
- **Integración mantenimiento-logística:** Vincula el estado mecánico con la planificación de rutas.
- **Escalabilidad:** Arquitectura lista para integrarse con sensores IoT.
- **Impacto directo:** Reduce accidentes por fallas mecánicas y costos correctivos.

---

## 🛠️ Tecnología

- **Base de datos:** PostgreSQL
- **Plataforma:** Supabase (Backend-as-a-Service)
- **Lenguaje:** SQL con extensiones PostgreSQL
