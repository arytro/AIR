import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutForm = ({ onBack }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: info, 2: payment, 3: success
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [formData, setFormData] = useState({
    // Información personal
    email: '',
    dni_rnc: '',
    documento_tipo: 'dni',
    nombre: '',
    telefono: '',
    
    // Redes sociales (opcional)
    contacto_preferido: 'whatsapp', // whatsapp o instagram
    whatsapp: '',
    instagram: '',
    
    // Dirección
    provincia: '',
    ciudad: '',
    direccion: '',
    codigo_postal: '',
    referencias: '',
    
    // Método de pago
    metodo_pago: ''
  });

  const provinciasRD = [
    'Azua', 'Baoruco', 'Barahona', 'Dajabón', 'Distrito Nacional', 
    'Duarte', 'Elías Piña', 'El Seibo', 'Espaillat', 'Hato Mayor',
    'Hermanas Mirabal', 'Independencia', 'La Altagracia', 'La Romana',
    'La Vega', 'María Trinidad Sánchez', 'Monseñor Nouel', 'Monte Cristi',
    'Monte Plata', 'Pedernales', 'Peravia', 'Puerto Plata', 'Samaná',
    'San Cristóbal', 'San José de Ocoa', 'San Juan', 'San Pedro de Macorís',
    'Sánchez Ramírez', 'Santiago', 'Santiago Rodríguez', 'Santo Domingo',
    'Valverde'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(price);
  };

  const validateStep1 = () => {
    const required = ['email', 'dni_rnc', 'nombre', 'telefono', 'provincia', 'ciudad', 'direccion'];
    return required.every(field => formData[field].trim());
  };

  const handleContinue = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePayment = async (method) => {
    setFormData(prev => ({ ...prev, metodo_pago: method }));
    setIsProcessing(true);
    
    try {
      const orderData = {
        customer: {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          dni_rnc: formData.dni_rnc,
          documento_tipo: formData.documento_tipo,
          contacto_preferido: formData.contacto_preferido,
          whatsapp: formData.whatsapp,
          instagram: formData.instagram
        },
        shipping: {
          provincia: formData.provincia,
          ciudad: formData.ciudad,
          direccion: formData.direccion,
          codigo_postal: formData.codigo_postal,
          referencias: formData.referencias
        },
        payment: {
          metodo_pago: method,
          total: getCartTotal()
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          image: item.image
        }))
      };

      console.log('Enviando orden:', orderData);

      const response = await axios.post(`${API}/orders`, orderData);
      
      if (response.data.order_id) {
        setOrderNumber(response.data.order_id);
        setStep(3);
        clearCart();
        
        toast({
          title: "¡Pedido realizado con éxito!",
          description: `Orden ${response.data.order_id} confirmada. Recibirás un email de confirmación.`,
          duration: 5000,
        });
      }
      
    } catch (error) {
      console.error('Error procesando la orden:', error);
      toast({
        title: "Error procesando la orden",
        description: error.response?.data?.detail || "Hubo un problema procesando tu pedido. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center">
          <CardContent className="pt-12 pb-8">
            <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              ¡Pedido Confirmado!
            </h2>
            <p className="text-slate-600 mb-6">
              Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación
              y actualizaciones sobre el envío.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600">
                <strong>Total pagado:</strong> {formatPrice(getCartTotal())}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Método de pago:</strong> {formData.metodo_pago}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Entrega en:</strong> {formData.provincia}, {formData.ciudad}
              </p>
            </div>
            <Button 
              onClick={onBack}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Volver a la tienda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al carrito
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Finalizar Compra</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="space-y-6">
              {/* Información Personal */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre Completo *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo Electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="documento_tipo">Tipo de Documento</Label>
                      <Select 
                        value={formData.documento_tipo} 
                        onValueChange={(value) => handleInputChange('documento_tipo', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dni">DNI (Dominicano)</SelectItem>
                          <SelectItem value="rnc">RNC (Empresa)</SelectItem>
                          <SelectItem value="pasaporte">Pasaporte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dni_rnc">
                        {formData.documento_tipo === 'rnc' ? 'RNC' : 'DNI/Pasaporte'} *
                      </Label>
                      <Input
                        id="dni_rnc"
                        value={formData.dni_rnc}
                        onChange={(e) => handleInputChange('dni_rnc', e.target.value)}
                        placeholder={formData.documento_tipo === 'rnc' ? '123-45678-9' : '123-1234567-8'}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      placeholder="(809) 123-4567"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contacto Adicional */}
              <Card>
                <CardHeader>
                  <CardTitle>Contacto Adicional (Opcional)</CardTitle>
                  <p className="text-sm text-slate-600">
                    Comparte tu Instagram o WhatsApp para mantenernos en contacto
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contacto_preferido">Método de Contacto Preferido</Label>
                    <Select 
                      value={formData.contacto_preferido} 
                      onValueChange={(value) => handleInputChange('contacto_preferido', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.contacto_preferido === 'whatsapp' && (
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={formData.whatsapp}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                        placeholder="(809) 123-4567 o +1 809 123 4567"
                      />
                    </div>
                  )}

                  {formData.contacto_preferido === 'instagram' && (
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={formData.instagram}
                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                        placeholder="@tu_usuario (sin el @)"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dirección de Envío */}
              <Card>
                <CardHeader>
                  <CardTitle>Dirección de Envío</CardTitle>
                  <p className="text-sm text-slate-600">
                    Enviamos mediante Caribe Turs a toda República Dominicana
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="provincia">Provincia *</Label>
                      <Select 
                        value={formData.provincia} 
                        onValueChange={(value) => handleInputChange('provincia', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona provincia" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinciasRD.map((provincia) => (
                            <SelectItem key={provincia} value={provincia}>
                              {provincia}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ciudad">Ciudad *</Label>
                      <Input
                        id="ciudad"
                        value={formData.ciudad}
                        onChange={(e) => handleInputChange('ciudad', e.target.value)}
                        placeholder="Tu ciudad"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="direccion">Dirección Completa *</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      placeholder="Calle, número, sector"
                    />
                  </div>

                  <div>
                    <Label htmlFor="codigo_postal">Código Postal</Label>
                    <Input
                      id="codigo_postal"
                      value={formData.codigo_postal}
                      onChange={(e) => handleInputChange('codigo_postal', e.target.value)}
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <Label htmlFor="referencias">Referencias/Especificaciones de Casa</Label>
                    <Textarea
                      id="referencias"
                      value={formData.referencias}
                      onChange={(e) => handleInputChange('referencias', e.target.value)}
                      placeholder="Ej: Casa amarilla, portón negro, al lado del colmado..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleContinue}
                disabled={!validateStep1()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-3"
              >
                Continuar al Pago
              </Button>
            </div>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
                <p className="text-sm text-slate-600">
                  Selecciona tu método de pago preferido
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Visa */}
                  <Button
                    variant="outline"
                    className="h-20 p-4 hover:border-emerald-500 hover:bg-emerald-50"
                    onClick={() => handlePayment('Visa')}
                  >
                    <div className="text-center">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <span className="font-semibold text-blue-600">VISA</span>
                    </div>
                  </Button>

                  {/* Mastercard */}
                  <Button
                    variant="outline"
                    className="h-20 p-4 hover:border-emerald-500 hover:bg-emerald-50"
                    onClick={() => handlePayment('Mastercard')}
                  >
                    <div className="text-center">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-red-500" />
                      <span className="font-semibold text-red-500">MASTERCARD</span>
                    </div>
                  </Button>

                  {/* Apple Pay */}
                  <Button
                    variant="outline"
                    className="h-20 p-4 hover:border-emerald-500 hover:bg-emerald-50"
                    onClick={() => handlePayment('Apple Pay')}
                  >
                    <div className="text-center">
                      <Smartphone className="h-8 w-8 mx-auto mb-2 text-slate-800" />
                      <span className="font-semibold text-slate-800">APPLE PAY</span>
                    </div>
                  </Button>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={() => setStep(1)}
                  className="w-full"
                >
                  Volver a información personal
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartId} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      Talla: {item.selectedSize} • Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span className="text-emerald-600">GRATIS</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-emerald-600">{formatPrice(getCartTotal())}</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-lg">
                <p className="text-xs text-emerald-700">
                  🚚 Envío gratuito mediante Caribe Turs a toda República Dominicana
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;