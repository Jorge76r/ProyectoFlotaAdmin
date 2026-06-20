// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// ============================================
// FUNCIONES DE NAVEGACIÓN
// ============================================

function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('#contenido > div').forEach(div => {
        div.classList.add('hidden');
    });
    
    // Mostrar la sección seleccionada
    const elemento = document.getElementById(seccion);
    if (elemento) {
        elemento.classList.remove('hidden');
    }
    
    // Cargar datos según la sección
    switch(seccion) {
        case 'dashboard': cargarDashboard(); break;
        case 'vehiculos': cargarVehiculos(); break;
        case 'choferes': cargarChoferes(); break;
        case 'inspecciones': cargarInspecciones(); break;
        case 'alertas': cargarAlertas(); break;
    }
}

// ============================================
// FUNCIONES DE FORMULARIOS
// ============================================

function mostrarFormulario(tipo) {
    const form = document.getElementById(`form-${tipo}`);
    if (form) {
        form.classList.remove('hidden');
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

function ocultarFormulario(tipo) {
    const form = document.getElementById(`form-${tipo}`);
    if (form) {
        form.classList.add('hidden');
        document.getElementById(`${tipo}Form`).reset();
    }
}

// ============================================
// DASHBOARD
// ============================================

async function cargarDashboard() {
    try {
        const [vehiculos, choferes, alertas] = await Promise.all([
            fetch(`${API_URL}/vehiculos`).then(r => r.json()),
            fetch(`${API_URL}/choferes`).then(r => r.json()),
            fetch(`${API_URL}/alertas`).then(r => r.json())
        ]);
        
        document.getElementById('total-vehiculos').textContent = vehiculos.data?.length || 0;
        document.getElementById('total-choferes').textContent = choferes.data?.length || 0;
        document.getElementById('total-alertas').textContent = alertas.data?.length || 0;
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
}

// ============================================
// VEHÍCULOS
// ============================================

async function cargarVehiculos() {
    try {
        const response = await fetch(`${API_URL}/vehiculos`);
        const data = await response.json();
        const vehiculos = data.data || [];
        
        const container = document.getElementById('lista-vehiculos');
        
        if (vehiculos.length === 0) {
            container.innerHTML = '<p style="color: #64748b; margin-top: 20px;">No hay vehículos registrados</p>';
            return;
        }
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Placa</th>
                        <th>Tipo</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Año</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        vehiculos.forEach(v => {
            html += `
                <tr>
                    <td>${v.id}</td>
                    <td><strong>${v.placa}</strong></td>
                    <td>${v.tipo}</td>
                    <td>${v.marca}</td>
                    <td>${v.modelo}</td>
                    <td>${v.anio}</td>
                    <td><span class="estado-badge estado-${v.estado}">${v.estado.replace('_', ' ')}</span></td>
                    <td>
                        <button class="btn-editar" onclick="editarVehiculo(${v.id})">✏️</button>
                        <button class="btn-eliminar" onclick="eliminarVehiculo(${v.id})">🗑️</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error cargando vehículos:', error);
    }
}

// Formulario para crear vehículo
document.getElementById('vehiculoForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        placa: document.getElementById('v-placa').value,
        tipo: document.getElementById('v-tipo').value,
        marca: document.getElementById('v-marca').value,
        modelo: document.getElementById('v-modelo').value,
        anio: parseInt(document.getElementById('v-anio').value),
        kilometraje: parseInt(document.getElementById('v-kilometraje').value) || 0,
        estado: document.getElementById('v-estado').value
    };
    
    try {
        const response = await fetch(`${API_URL}/vehiculos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('✅ Vehículo creado exitosamente');
            ocultarFormulario('vehiculo');
            cargarVehiculos();
        } else {
            const error = await response.json();
            alert('❌ Error: ' + (error.error || 'Error al crear vehículo'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión con el servidor');
    }
});

async function eliminarVehiculo(id) {
    if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;
    
    try {
        const response = await fetch(`${API_URL}/vehiculos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Vehículo eliminado');
            cargarVehiculos();
        } else {
            alert('❌ Error al eliminar');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    }
}

async function editarVehiculo(id) {
    // Mostrar formulario y cargar datos
    mostrarFormulario('vehiculo');
    // Aquí podrías cargar los datos del vehículo para editar
    alert('Función de edición en desarrollo');
}

// ============================================
// CHOFERES
// ============================================

async function cargarChoferes() {
    try {
        const response = await fetch(`${API_URL}/choferes`);
        const data = await response.json();
        const choferes = data.data || [];
        
        const container = document.getElementById('lista-choferes');
        
        if (choferes.length === 0) {
            container.innerHTML = '<p style="color: #64748b; margin-top: 20px;">No hay choferes registrados</p>';
            return;
        }
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Licencia</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        choferes.forEach(c => {
            html += `
                <tr>
                    <td>${c.id}</td>
                    <td><strong>${c.nombre} ${c.apellido}</strong></td>
                    <td>${c.licencia}</td>
                    <td>${c.telefono || '-'}</td>
                    <td>${c.email || '-'}</td>
                    <td>${c.activo ? '🟢 Activo' : '🔴 Inactivo'}</td>
                    <td>
                        <button class="btn-editar" onclick="editarChofer(${c.id})">✏️</button>
                        <button class="btn-eliminar" onclick="eliminarChofer(${c.id})">🗑️</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error cargando choferes:', error);
    }
}

// Formulario para crear chofer
document.getElementById('choferForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        nombre: document.getElementById('c-nombre').value,
        apellido: document.getElementById('c-apellido').value,
        licencia: document.getElementById('c-licencia').value,
        telefono: document.getElementById('c-telefono').value,
        email: document.getElementById('c-email').value,
        activo: document.getElementById('c-activo').value === 'true'
    };
    
    try {
        const response = await fetch(`${API_URL}/choferes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('✅ Chofer creado exitosamente');
            ocultarFormulario('chofer');
            cargarChoferes();
        } else {
            const error = await response.json();
            alert('❌ Error: ' + (error.error || 'Error al crear chofer'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión con el servidor');
    }
});

async function eliminarChofer(id) {
    if (!confirm('¿Estás seguro de eliminar este chofer?')) return;
    
    try {
        const response = await fetch(`${API_URL}/choferes/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Chofer eliminado');
            cargarChoferes();
        } else {
            alert('❌ Error al eliminar');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    }
}

async function editarChofer(id) {
    mostrarFormulario('chofer');
    alert('Función de edición en desarrollo');
}

// ============================================
// INSPECCIONES
// ============================================

async function cargarInspecciones() {
    try {
        const response = await fetch(`${API_URL}/inspecciones`);
        const data = await response.json();
        const inspecciones = data.data || [];
        
        const container = document.getElementById('lista-inspecciones');
        
        if (inspecciones.length === 0) {
            container.innerHTML = '<p style="color: #64748b; margin-top: 20px;">No hay inspecciones registradas</p>';
            return;
        }
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Vehículo</th>
                        <th>Chofer</th>
                        <th>Fecha</th>
                        <th>Apto</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        inspecciones.forEach(i => {
            const vehiculo = i.vehiculos ? `${i.vehiculos.marca} ${i.vehiculos.modelo}` : '-';
            const chofer = i.choferes ? `${i.choferes.nombre} ${i.choferes.apellido}` : '-';
            
            html += `
                <tr>
                    <td>${i.id}</td>
                    <td>${vehiculo}</td>
                    <td>${chofer}</td>
                    <td>${new Date(i.fecha_inspeccion).toLocaleDateString()}</td>
                    <td>${i.apto_para_viaje ? '✅ Sí' : '❌ No'}</td>
                    <td><span class="estado-badge ${i.apto_para_viaje ? 'estado-disponible' : 'estado-fuera_de_servicio'}">${i.apto_para_viaje ? 'Apto' : 'No Apto'}</span></td>
                    <td>
                        <button class="btn-eliminar" onclick="eliminarInspeccion(${i.id})">🗑️</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error cargando inspecciones:', error);
    }
}

// Formulario para crear inspección
document.getElementById('inspeccionForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        vehiculo_id: parseInt(document.getElementById('i-vehiculo').value),
        chofer_id: parseInt(document.getElementById('i-chofer').value),
        presion_llanta_delantera_izq: parseInt(document.getElementById('i-presion').value),
        presion_llanta_delantera_der: parseInt(document.getElementById('i-presion').value),
        presion_llanta_trasera_izq: parseInt(document.getElementById('i-presion').value),
        presion_llanta_trasera_der: parseInt(document.getElementById('i-presion').value),
        nivel_aceite: document.getElementById('i-aceite').value,
        nivel_hidraulico: document.getElementById('i-hidraulico').value,
        nivel_refrigerante: document.getElementById('i-refrigerante').value,
        estado_frenos: document.getElementById('i-frenos').value,
        kilometraje_actual: parseInt(document.getElementById('i-kilometraje').value),
        observaciones: document.getElementById('i-observaciones').value || ''
    };
    
    try {
        const response = await fetch(`${API_URL}/inspecciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(`✅ Inspección creada. Alertas generadas: ${result.alertas_generadas || 0}`);
            ocultarFormulario('inspeccion');
            cargarInspecciones();
        } else {
            const error = await response.json();
            alert('❌ Error: ' + (error.error || 'Error al crear inspección'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión con el servidor');
    }
});

async function eliminarInspeccion(id) {
    if (!confirm('¿Estás seguro de eliminar esta inspección?')) return;
    
    try {
        const response = await fetch(`${API_URL}/inspecciones/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Inspección eliminada');
            cargarInspecciones();
        } else {
            alert('❌ Error al eliminar');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    }
}

// ============================================
// ALERTAS
// ============================================

async function cargarAlertas() {
    try {
        const response = await fetch(`${API_URL}/alertas`);
        const data = await response.json();
        const alertas = data.data || [];
        
        const container = document.getElementById('lista-alertas');
        
        if (alertas.length === 0) {
            container.innerHTML = '<p style="color: #64748b; margin-top: 20px;">No hay alertas registradas</p>';
            return;
        }
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Vehículo</th>
                        <th>Tipo</th>
                        <th>Mensaje</th>
                        <th>Severidad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        alertas.forEach(a => {
            const vehiculo = a.vehiculos ? `${a.vehiculos.placa} (${a.vehiculos.marca})` : '-';
            const severidadClass = a.severidad === 'critica' ? 'alert-critica' : 
                                   a.severidad === 'advertencia' ? 'alert-advertencia' : 'alert-info';
            
            html += `
                <tr>
                    <td>${a.id}</td>
                    <td>${vehiculo}</td>
                    <td>${a.tipo}</td>
                    <td>${a.mensaje}</td>
                    <td><span class="estado-badge ${severidadClass}">${a.severidad}</span></td>
                    <td>${a.resuelta ? '✅ Resuelta' : '🔴 Activa'}</td>
                    <td>
                        ${!a.resuelta ? `<button class="btn-resolver" onclick="resolverAlerta(${a.id})">✅ Resolver</button>` : '-'}
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error cargando alertas:', error);
    }
}

async function resolverAlerta(id) {
    if (!confirm('¿Marcar esta alerta como resuelta?')) return;
    
    try {
        const response = await fetch(`${API_URL}/alertas/${id}/resolver`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            alert('✅ Alerta resuelta');
            cargarAlertas();
        } else {
            alert('❌ Error al resolver la alerta');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Cargar dashboard al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarDashboard();
});