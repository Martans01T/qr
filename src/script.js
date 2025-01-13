// Configuración de Supabase
const supabaseUrl = 'https://uqgtbxcixrmtmfchmvpg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxZ3RieGNpeHJtdG1mY2htdnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3OTkxOTgsImV4cCI6MjA1MjM3NTE5OH0.57Krez4Xv_sVLxbOOimjkLpeKoRcBjXn7aWVJzrJQzE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Obtener el ID del empleado de la URL
function getEmpleadoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Formatear fechas al formato local
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Función principal para validar empleado
async function validarEmpleado() {
    const empleadoId = getEmpleadoId();
    const loader = document.getElementById('loader');
    const contenido = document.getElementById('contenido');
    const errorMensaje = document.getElementById('error-mensaje');

    if (!empleadoId) {
        loader.style.display = 'none';
        errorMensaje.style.display = 'block';
        return;
    }

    try {
        const { data: empleado, error } = await supabase
            .from('empleados')
            .select('*')
            .eq('id', empleadoId)
            .single();

        if (error || !empleado) {
            throw new Error('Empleado no encontrado');
        }

        // Verificar si el carnet está vigente
        const fechaValidez = new Date(empleado.fecha_validez);
        const esValido = fechaValidez >= new Date();

        // Actualizar la interfaz
        document.getElementById('foto-empleado').src = empleado.foto_url;
        document.getElementById('nombre-empleado').textContent = empleado.nombre;
        document.getElementById('cedula-empleado').textContent = empleado.cedula;
        document.getElementById('fecha-ingreso').textContent = formatearFecha(empleado.fecha_ingreso);
        document.getElementById('fecha-validez').textContent = formatearFecha(empleado.fecha_validez);

        const estadoValidacion = document.getElementById('estado-validacion');
        estadoValidacion.textContent = esValido ? '✓ Carnet Válido' : '✗ Carnet Vencido';
        estadoValidacion.className = `estado ${esValido ? 'valido' : 'invalido'}`;

        loader.style.display = 'none';
        contenido.style.display = 'block';
    } catch (error) {
        loader.style.display = 'none';
        errorMensaje.style.display = 'block';
    }
}

// Iniciar la validación cuando se carga la página
document.addEventListener('DOMContentLoaded', validarEmpleado); 