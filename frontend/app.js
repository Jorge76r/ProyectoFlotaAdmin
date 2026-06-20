// ==========================================================================
// CONFIGURACIÓN DE SUPABASE (Colocá aquí tus datos reales)
// ==========================================================================
const SUPABASE_URL = 'https://tu-proyecto.supabase.co'; 
const SUPABASE_KEY = 'tu-anon-key-super-larga-de-supabase';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================================================
// 1. CONTROL DE NAVEGACIÓN
// ==========================================================================
function cambiarPestana(seccionDestino) {
    document.getElementById('sec-dashboard').classList.add('hidden');
    document.getElementById('sec-vehiculos').classList.add('hidden');
    document.getElementById('sec-mantenimiento').classList.add('hidden');
    document.getElementById('sec-alertas').classList.add('hidden');

    document.getElementById('btn-dashboard').classList.remove('active');
    document.getElementById('btn-vehiculos').classList.remove('active');
    document.getElementById('btn-mantenimiento').classList.remove('active');
    document.getElementById('btn-alertas').classList.remove('active');

    if (seccionDestino === 'dashboard') {
        document.getElementById('sec-dashboard').classList.remove('hidden');
        document.getElementById('btn-dashboard').classList.add('active');
        cargarDashboard();
    } else if (seccionDestino === 'vehiculos') {
        document.getElementById('sec-vehiculos').classList.remove('hidden');
        document.getElementById('btn-vehiculos').classList.add('active');
        cargarVehiculos();
    } else if (seccionDestino === 'mantenimiento') {
        document.getElementById('sec-mantenimiento').classList.remove('hidden');
        document.getElementById('btn-mantenimiento').classList.add('active');
    } else if (seccionDestino === 'alertas') {
        document.getElementById('sec-alertas').classList.remove('hidden');
        document.getElementById('btn-alertas').classList.add('active');
        cargarAlertasCriticas();
    }
}

// ==========================================================================
// 2. CONEXIÓN DIRECTA A SUPABASE
// ==========================================================================

// GET: Alimentar el Dashboard
async function cargarDashboard() {
    try {
        const { data: vehiculos, error } = await _supabase.from('vehiculos').select('*');
        if (error) throw error;
        
        document.getElementById('total-unidades').innerText = vehiculos.length;
        document.getElementById('total-viaje').innerText = vehiculos.filter(c => c.estado === 'en_viaje').length;
        document.getElementById('total-taller').innerText = vehiculos.filter(c => c.estado === 'en_mantenimiento').length;
    } catch (error) {
        console.error("Error en Dashboard:", error.message);
    }
}

// GET: Cargar la tabla de camiones
async function cargarVehiculos() {
    try {
        const { data: vehiculos, error } = await _supabase.from('vehiculos').select('*');
        if (error) throw error;
        
        const tbody = document.getElementById('tabla-vehiculos');
        tbody.innerHTML = '';

        if(vehiculos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No hay camiones en la base de datos.</td></tr>`;
            return;
        }

        vehiculos.forEach(camion => {
            tbody.innerHTML += `
                <tr>
                    <td><strong>${camion.placa}</strong></td>
                    <td>${camion.modelo}</td>
                    <td>${parseInt(camion.kilometraje).toLocaleString()} km</td>
                    <td><span class="estado-badge estado-${camion.estado}">${camion.estado.replace('_', ' ')}</span></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al obtener vehículos:", error.message);
    }
}

// POST: Insertar camión desde el formulario
document.getElementById('form-vehiculo').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const nuevoCamion = {
        placa: document.getElementById('placa').value,
        modelo: document.getElementById('modelo').value,
        kilometraje: parseInt(document.getElementById('kilometraje').value),
        estado: document.getElementById('estado').value
    };

    try {
        const { error } = await _supabase.from('vehiculos').insert([nuevoCamion]);
        if (error) throw error;

        alert("¡Camión registrado con éxito en Supabase!");
        this.reset();
        cargarVehiculos();
    } catch (error) {
        console.error("Error al insertar:", error.message);
        alert("Error al guardar: " + error.message);
    }
});

// ENGINE: Alertas por kilometraje preventivo
async function cargarAlertasCriticas() {
    try {
        const { data: vehiculos, error } = await _supabase.from('vehiculos').select('*');
        if (error) throw error;
        
        const tbody = document.querySelector('#sec-alertas tbody');
        tbody.innerHTML = '';

        const unidadesEnRiesgo = vehiculos.filter(c => c.kilometraje > 50000);

        if(unidadesEnRiesgo.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: green; font-weight: bold; padding: 20px;">Flota segura sin alertas.</td></tr>`;
            return;
        }

        unidadesEnRiesgo.forEach(camion => {
            tbody.innerHTML += `
                <tr>
                    <td><strong>${camion.placa}</strong></td>
                    <td><span class="estado-badge alert-critica">Crítica</span></td>
                    <td>Kilometraje actual: ${parseInt(camion.kilometraje).toLocaleString()} km. Superó el límite preventivo. Requiere revisión técnica de motor.</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error en alertas:", error.message);
    }
}

// Carga inicial
document.addEventListener('DOMContentLoaded', () => {
    cargarDashboard();
});