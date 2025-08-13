from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class CustomerInfo(BaseModel):
    nombre: str
    email: str
    telefono: str
    dni_rnc: str
    documento_tipo: str = "dni"  # dni, rnc, pasaporte
    contacto_preferido: str = "whatsapp"  # whatsapp, instagram
    whatsapp: Optional[str] = ""
    instagram: Optional[str] = ""

class ShippingInfo(BaseModel):
    provincia: str
    ciudad: str
    direccion: str
    codigo_postal: Optional[str] = ""
    referencias: Optional[str] = ""

class PaymentInfo(BaseModel):
    metodo_pago: str  # Visa, Mastercard, Apple Pay
    total: float

class OrderItem(BaseModel):
    id: int
    name: str
    price: float
    quantity: int
    selectedSize: str
    image: str

class OrderCreate(BaseModel):
    customer: CustomerInfo
    shipping: ShippingInfo
    payment: PaymentInfo
    items: List[OrderItem]

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str = Field(default_factory=lambda: f"AIR-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}")
    customer: CustomerInfo
    shipping: ShippingInfo
    payment: PaymentInfo
    items: List[OrderItem]
    status: str = "confirmed"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def dict(self, **kwargs):
        # Convert datetime objects to strings for MongoDB storage
        result = super().dict(**kwargs)
        result['created_at'] = self.created_at.isoformat()
        result['updated_at'] = self.updated_at.isoformat()
        return result