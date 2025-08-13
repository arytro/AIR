# Configuración de Email para Air Store

## ✅ Sistema de Notificaciones Implementado

Tu sitio web Air ya tiene implementado el sistema completo de notificaciones por email que incluye:

### 📧 **Funcionalidades de Email:**
1. **Notificación al administrador** (chantella.off@gmail.com) con cada nueva orden
2. **Confirmación al cliente** con detalles de su pedido
3. **Información completa** de productos, cliente, envío y contacto adicional

### 🔧 **Para Activar el Sistema de Email:**

**PASO 1: Configurar Gmail App Password**
1. Ve a tu cuenta Google (chantella.off@gmail.com)
2. Seguridad → Verificación en 2 pasos (activarla si no está activa)
3. Contraseñas de aplicaciones → Generar nueva contraseña
4. Selecciona "Correo" y "Otro dispositivo personalizado"
5. Escribe "Air Store" y genera la contraseña

**PASO 2: Actualizar Variables de Entorno**
Edita el archivo `/app/backend/.env` y reemplaza:
```
GMAIL_USER=chantella.off@gmail.com
GMAIL_PASS=tu_contraseña_de_aplicacion_aqui
```

### 📋 **Contenido de los Emails:**

**Email a chantella.off@gmail.com incluye:**
- ✅ Información completa del cliente (nombre, email, teléfono, DNI/RNC)
- ✅ **WhatsApp o Instagram** del cliente (campo nuevo que agregaste)
- ✅ Dirección completa de envío con referencias
- ✅ Lista detallada de productos ordenados con imágenes
- ✅ Método de pago seleccionado
- ✅ Total de la orden
- ✅ Número de orden único
- ✅ Diseño profesional en HTML

**Email al cliente incluye:**
- ✅ Confirmación de orden
- ✅ Número de orden para seguimiento
- ✅ Resumen de productos
- ✅ Información de envío
- ✅ Mensaje de agradecimiento

### 🛒 **Nuevo Formulario de Checkout:**
- ✅ Campo para elegir WhatsApp o Instagram
- ✅ Validación de todos los campos requeridos
- ✅ Integración completa con el backend
- ✅ Estados de carga durante el procesamiento
- ✅ Manejo de errores

### 🔄 **Flujo Completo:**
1. Cliente completa checkout con información personal
2. **Elige WhatsApp o Instagram** para contacto adicional
3. Selecciona método de pago (Visa/Mastercard/Apple Pay)
4. Sistema procesa orden y la guarda en base de datos
5. **EMAIL AUTOMÁTICO a chantella.off@gmail.com** con todos los detalles
6. Email de confirmación al cliente
7. Pantalla de éxito con número de orden

### 🚀 **Para Probar el Sistema:**
1. Configura la contraseña de Gmail (pasos arriba)
2. Reinicia el backend: `sudo supervisorctl restart backend`
3. Haz una orden de prueba en el sitio
4. Revisa tu email chantella.off@gmail.com

### 📱 **Información de Contacto Adicional:**
Ahora cuando los clientes hagan pedidos, podrás ver:
- Su WhatsApp para contactarlos directamente
- Su Instagram para darles seguimiento
- Esta info aparece destacada en el email de notificación

¡El sistema está 100% listo! Solo necesitas configurar la contraseña de Gmail y empezar a recibir órdenes.