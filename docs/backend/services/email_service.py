import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime
import logging
from models.order import Order

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.email = os.getenv('GMAIL_USER', 'noreply@airstore.com')
        self.password = os.getenv('GMAIL_PASS', '')
        
    def send_order_notification(self, order: Order) -> bool:
        """
        Envía notificación de nueva orden a chantella.off@gmail.com
        """
        try:
            # Crear mensaje
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = "chantella.off@gmail.com"
            msg['Subject'] = f"🛍️ Nueva Orden Air Store - {order.order_number}"
            
            # Crear cuerpo del email
            body = self._create_order_email_body(order)
            msg.attach(MIMEText(body, 'html'))
            
            # Enviar email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email, self.password)
            text = msg.as_string()
            server.sendmail(self.email, "chantella.off@gmail.com", text)
            server.quit()
            
            logger.info(f"Email de orden enviado exitosamente para {order.order_number}")
            return True
            
        except Exception as e:
            logger.error(f"Error enviando email de orden {order.order_number}: {str(e)}")
            return False
    
    def send_customer_confirmation(self, order: Order) -> bool:
        """
        Envía confirmación de orden al cliente
        """
        try:
            # Crear mensaje
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = order.customer.email
            msg['Subject'] = f"✅ Confirmación de Orden Air - {order.order_number}"
            
            # Crear cuerpo del email para cliente
            body = self._create_customer_confirmation_body(order)
            msg.attach(MIMEText(body, 'html'))
            
            # Enviar email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email, self.password)
            text = msg.as_string()
            server.sendmail(self.email, order.customer.email, text)
            server.quit()
            
            logger.info(f"Email de confirmación enviado a cliente para {order.order_number}")
            return True
            
        except Exception as e:
            logger.error(f"Error enviando confirmación al cliente {order.order_number}: {str(e)}")
            return False
    
    def _create_order_email_body(self, order: Order) -> str:
        """
        Crea el cuerpo HTML del email de notificación de orden
        """
        
        # Calcular totales
        subtotal = sum(item.price * item.quantity for item in order.items)
        
        # Crear lista de productos
        items_html = ""
        for item in order.items:
            total_item = item.price * item.quantity
            items_html += f"""
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; vertical-align: top;">
                    <img src="{item.image}" alt="{item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                </td>
                <td style="padding: 12px; vertical-align: top;">
                    <strong>{item.name}</strong><br>
                    <span style="color: #6b7280; font-size: 14px;">Talla: {item.selectedSize}</span>
                </td>
                <td style="padding: 12px; text-align: center; vertical-align: top;">{item.quantity}</td>
                <td style="padding: 12px; text-align: right; vertical-align: top;">RD${item.price:,.2f}</td>
                <td style="padding: 12px; text-align: right; vertical-align: top; font-weight: bold;">RD${total_item:,.2f}</td>
            </tr>
            """
        
        # Información de contacto adicional
        contacto_adicional = ""
        if order.customer.contacto_preferido == "whatsapp" and order.customer.whatsapp:
            contacto_adicional = f"📱 WhatsApp: {order.customer.whatsapp}"
        elif order.customer.contacto_preferido == "instagram" and order.customer.instagram:
            contacto_adicional = f"📸 Instagram: @{order.customer.instagram}"
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nueva Orden Air Store</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
            
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 28px;">🛍️ Nueva Orden Recibida</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px;">Air Store</p>
            </div>

            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #10b981; margin-top: 0;">📋 Detalles de la Orden</h2>
                <p><strong>Número de Orden:</strong> {order.order_number}</p>
                <p><strong>Fecha:</strong> {datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
                <p><strong>Estado:</strong> <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">CONFIRMADA</span></p>
            </div>

            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #10b981; margin-top: 0;">👤 Información del Cliente</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <p><strong>Nombre:</strong> {order.customer.nombre}</p>
                        <p><strong>Email:</strong> {order.customer.email}</p>
                        <p><strong>Teléfono:</strong> {order.customer.telefono}</p>
                    </div>
                    <div>
                        <p><strong>Documento:</strong> {order.customer.documento_tipo.upper()} - {order.customer.dni_rnc}</p>
                        {f"<p><strong>Contacto Adicional:</strong> {contacto_adicional}</p>" if contacto_adicional else ""}
                    </div>
                </div>
            </div>

            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #10b981; margin-top: 0;">🚚 Dirección de Envío</h2>
                <p><strong>Provincia:</strong> {order.shipping.provincia}</p>
                <p><strong>Ciudad:</strong> {order.shipping.ciudad}</p>
                <p><strong>Dirección:</strong> {order.shipping.direccion}</p>
                {f"<p><strong>Código Postal:</strong> {order.shipping.codigo_postal}</p>" if order.shipping.codigo_postal else ""}
                {f"<p><strong>Referencias:</strong> {order.shipping.referencias}</p>" if order.shipping.referencias else ""}
            </div>

            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #10b981; margin-top: 0;">🛒 Productos Ordenados</h2>
                <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
                    <thead>
                        <tr style="background: #10b981; color: white;">
                            <th style="padding: 12px; text-align: left;">Imagen</th>
                            <th style="padding: 12px; text-align: left;">Producto</th>
                            <th style="padding: 12px; text-align: center;">Cantidad</th>
                            <th style="padding: 12px; text-align: right;">Precio Unit.</th>
                            <th style="padding: 12px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                </table>
            </div>

            <div style="background: #10b981; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="margin-top: 0;">💳 Resumen de Pago</h2>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Subtotal:</span>
                    <span>RD${subtotal:,.2f}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Envío (Caribe Turs):</span>
                    <span style="color: #bbf7d0;">GRATIS</span>
                </div>
                <hr style="border: 1px solid rgba(255,255,255,0.3); margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold;">
                    <span>Total:</span>
                    <span>RD${order.payment.total:,.2f}</span>
                </div>
                <p style="margin-top: 15px; margin-bottom: 0;"><strong>Método de Pago:</strong> {order.payment.metodo_pago}</p>
            </div>

            <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 10px; padding: 20px; text-align: center;">
                <h3 style="color: #1e40af; margin-top: 0;">📞 Próximos Pasos</h3>
                <p style="margin-bottom: 0; color: #1e40af;">
                    1. Contacta al cliente para confirmar la orden<br>
                    2. Prepara los productos para envío<br>
                    3. Coordina con Caribe Turs para la entrega
                </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 10px;">
                <p style="color: #6b7280; margin: 0;">Este email fue generado automáticamente por Air Store</p>
                <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">{datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</p>
            </div>

        </body>
        </html>
        """
    
    def _create_customer_confirmation_body(self, order: Order) -> str:
        """
        Crea el cuerpo HTML del email de confirmación para el cliente
        """
        
        # Crear lista de productos
        items_html = ""
        for item in order.items:
            total_item = item.price * item.quantity
            items_html += f"""
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; vertical-align: top;">
                    <strong>{item.name}</strong><br>
                    <span style="color: #6b7280; font-size: 14px;">Talla: {item.selectedSize}</span>
                </td>
                <td style="padding: 12px; text-align: center; vertical-align: top;">{item.quantity}</td>
                <td style="padding: 12px; text-align: right; vertical-align: top; font-weight: bold;">RD${total_item:,.2f}</td>
            </tr>
            """
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de Orden Air</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 28px;">✅ Orden Confirmada</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px;">¡Gracias por tu compra!</p>
            </div>

            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #10b981; margin-top: 0;">Hola {order.customer.nombre},</h2>
                <p>Tu orden ha sido recibida y confirmada exitosamente. A continuación encontrarás los detalles:</p>
                
                <p><strong>Número de Orden:</strong> {order.order_number}</p>
                <p><strong>Fecha:</strong> {datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
            </div>

            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #10b981; margin-top: 0;">🛒 Productos Ordenados</h2>
                <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
                    <thead>
                        <tr style="background: #10b981; color: white;">
                            <th style="padding: 12px; text-align: left;">Producto</th>
                            <th style="padding: 12px; text-align: center;">Cantidad</th>
                            <th style="padding: 12px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                </table>
                
                <div style="text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #10b981;">
                    <h3 style="color: #10b981; margin: 0;">Total: RD${order.payment.total:,.2f}</h3>
                </div>
            </div>

            <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 10px; padding: 20px;">
                <h3 style="color: #1e40af; margin-top: 0;">🚚 Información de Envío</h3>
                <p style="color: #1e40af; margin-bottom: 0;">
                    Tu orden será enviada mediante <strong>Caribe Turs</strong> a:<br>
                    {order.shipping.direccion}, {order.shipping.ciudad}, {order.shipping.provincia}
                </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 10px;">
                <h3 style="color: #10b981; margin-top: 0;">¡Gracias por elegir Air!</h3>
                <p style="color: #6b7280; margin: 0;">"Siéntete libre, siéntete en el aire con Air"</p>
            </div>

        </body>
        </html>
        """