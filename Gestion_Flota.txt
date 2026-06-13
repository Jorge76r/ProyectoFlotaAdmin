-- Tabla de choferes
CREATE TABLE choferes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    licencia TEXT UNIQUE NOT NULL,
    telefono TEXT,
    email TEXT,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de vehículos
CREATE TABLE vehiculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placa TEXT UNIQUE NOT NULL,
    tipo TEXT CHECK (tipo IN ('cabezal','plataforma','cisterna','furgon')),
    marca TEXT,
    modelo TEXT,
    anio INT,
    kilometraje DECIMAL,
    estado TEXT CHECK (estado IN ('disponible','en_viaje','en_mantenimiento','fuera_de_servicio')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de inspecciones
CREATE TABLE inspecciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehiculo_id UUID REFERENCES vehiculos(id),
    chofer_id UUID REFERENCES choferes(id),
    fecha_inspeccion TIMESTAMP NOT NULL,
    presion_llantas DECIMAL,
    nivel_aceite TEXT CHECK (nivel_aceite IN ('optimo','bajo','critico')),
    nivel_hidraulico TEXT CHECK (nivel_hidraulico IN ('optimo','bajo','critico')),
    nivel_refrigerante TEXT CHECK (nivel_refrigerante IN ('optimo','bajo','critico')),
    estado_frenos TEXT CHECK (estado_frenos IN ('bueno','regular','malo')),
    kilometraje_actual DECIMAL,
    apto_para_viaje BOOLEAN,
    observaciones TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mantenimientos
CREATE TABLE mantenimientos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehiculo_id UUID REFERENCES vehiculos(id),
    tipo TEXT,
    descripcion TEXT,
    kilometraje DECIMAL,
    proximo_mantenimiento DECIMAL,
    costo DECIMAL,
    fecha TIMESTAMP NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de viajes
CREATE TABLE viajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehiculo_id UUID REFERENCES vehiculos(id),
    chofer_id UUID REFERENCES choferes(id),
    inspeccion_id UUID REFERENCES inspecciones(id),
    origen TEXT NOT NULL,
    destino TEXT NOT NULL,
    distancia_km DECIMAL,
    consumo_estimado DECIMAL,
    fecha_salida TIMESTAMP,
    fecha_llegada TIMESTAMP,
    estado TEXT CHECK (estado IN ('programado','en_curso','completado','cancelado')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de alertas
CREATE TABLE alertas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehiculo_id UUID REFERENCES vehiculos(id),
    tipo TEXT,
    severidad TEXT CHECK (severidad IN ('info','advertencia','critica')),
    mensaje TEXT,
    resuelta BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
