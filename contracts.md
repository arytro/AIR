# Contratos de API - Air Store

## Sistema de Órdenes y Notificaciones

### Objetivo
Implementar un backend que:
1. Procese órdenes de compra
2. Envíe emails de notificación a `chantella.off@gmail.com`
3. Gestione la información de productos y clientes

### APIs a Implementar

#### 1. POST /api/orders
**Descripción**: Crear una nueva orden
**Body**:
```json
{
  "customer": {
    "nombre": "string",
    "email": "string", 
    "telefono": "string",
    "dni_rnc": "string",
    "documento_tipo": "dni|rnc|pasaporte",
    "contacto_preferido": "whatsapp|instagram",
    "whatsapp": "string (opcional)",
    "instagram": "string (opcional)"
  },
  "shipping": {
    "provincia": "string",
    "ciudad": "string", 
    "direccion": "string",
    "codigo_postal": "string (opcional)",
    "referencias": "string (opcional)"
  },
  "payment": {
    "metodo_pago": "Visa|Mastercard|Apple Pay",
    "total": "number"
  },
  "items": [
    {
      "id": "number",
      "name": "string",
      "price": "number",
      "quantity": "number",
      "selectedSize": "string",
      "image": "string"
    }
  ]
}
```

**Response**: 
```json
{
  "order_id": "string",
  "status": "confirmed",
  "message": "Orden creada exitosamente"
}
```

#### 2. Sistema de Email
**Servicio**: Nodemailer con Gmail SMTP
**Destinatario**: chantella.off@gmail.com
**Asunto**: "Nueva Orden Air Store - #{order_id}"

**Contenido del Email**:
- Información del cliente
- Productos ordenados  
- Dirección de envío
- Método de pago
- Total de la orden
- Contacto adicional (WhatsApp/Instagram)

### Cambios en Frontend

#### Mock Data Reemplazados
- Eliminar uso de mock.js en componente CheckoutForm
- Conectar al endpoint real /api/orders
- Manejar respuestas de éxito y error

#### Integración Frontend-Backend
1. Al hacer clic en método de pago, enviar datos al backend
2. Mostrar loading state durante procesamiento
3. Mostrar confirmación de éxito con número de orden
4. Enviar email de confirmación al cliente y notificación al dueño

### Flujo de Datos
1. Usuario completa checkout
2. Frontend envía datos a POST /api/orders
3. Backend procesa orden y la guarda en MongoDB
4. Backend envía email a chantella.off@gmail.com con detalles
5. Backend responde con confirmación
6. Frontend muestra pantalla de éxito

### Configuración de Email
- **SMTP**: Gmail (smtp.gmail.com:587)
- **Credenciales**: Variable de entorno GMAIL_USER y GMAIL_PASS
- **Destinatario**: chantella.off@gmail.com
- **Remitente**: noreply@airstore.com

### Modelos de Base de Datos

#### Order Model
```javascript
{
  _id: ObjectId,
  order_number: String,
  customer: {
    nombre: String,
    email: String,
    telefono: String,
    dni_rnc: String,
    documento_tipo: String,
    contacto_preferido: String,
    whatsapp: String,
    instagram: String
  },
  shipping: {
    provincia: String,
    ciudad: String,
    direccion: String,
    codigo_postal: String,
    referencias: String
  },
  items: [{
    product_id: Number,
    name: String,
    price: Number,
    quantity: Number,
    selectedSize: String,
    image: String
  }],
  payment: {
    metodo_pago: String,
    total: Number
  },
  status: String, // 'pending', 'confirmed', 'shipped', 'delivered'
  created_at: Date,
  updated_at: Date
}
```