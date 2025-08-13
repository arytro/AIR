import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ShoppingCart, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import CheckoutForm from './CheckoutForm';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartItemsCount,
    isCartOpen,
    setIsCartOpen 
  } = useCart();
  
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = (cartId, change) => {
    const item = cartItems.find(item => item.cartId === cartId);
    if (item) {
      updateQuantity(cartId, item.quantity + change);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(price);
  };

  if (showCheckout) {
    return <CheckoutForm onBack={() => setShowCheckout(false)} />;
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {getCartItemsCount() > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-emerald-600 text-white text-xs"
            >
              {getCartItemsCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Mi Carrito ({getCartItemsCount()} productos)
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex-1 overflow-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-slate-500 mb-6">
                Agrega algunos productos para comenzar tu compra
              </p>
              <Button 
                onClick={() => setIsCartOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.cartId} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-slate-500 mb-2">
                          Talla: {item.selectedSize}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.cartId, -1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.cartId, 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-red-500 hover:text-red-600 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatPrice(item.price)} c/u
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-emerald-600">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>

                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg"
                  onClick={() => setShowCheckout(true)}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceder al Checkout
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;