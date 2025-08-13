from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Import our models and services
from models.order import Order, OrderCreate
from services.email_service import EmailService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize services
email_service = EmailService()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define Models for existing endpoints
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Existing routes
@api_router.get("/")
async def root():
    return {"message": "Air Store API - Ready to serve!"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# NEW ORDER ENDPOINTS
@api_router.post("/orders")
async def create_order(order_data: OrderCreate):
    """
    Crear nueva orden y enviar notificación por email
    """
    try:
        # Crear objeto Order
        order = Order(
            customer=order_data.customer,
            shipping=order_data.shipping,
            payment=order_data.payment,
            items=order_data.items
        )
        
        # Guardar en base de datos
        order_dict = order.dict()
        result = await db.orders.insert_one(order_dict)
        
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Error guardando la orden")
        
        # Enviar email de notificación a chantella.off@gmail.com
        notification_sent = email_service.send_order_notification(order)
        
        # Enviar confirmación al cliente
        confirmation_sent = email_service.send_customer_confirmation(order)
        
        logger.info(f"Orden creada: {order.order_number}, Email notificación: {notification_sent}, Email confirmación: {confirmation_sent}")
        
        return {
            "order_id": order.order_number,
            "status": "confirmed",
            "message": "Orden creada exitosamente",
            "notification_sent": notification_sent,
            "confirmation_sent": confirmation_sent
        }
        
    except Exception as e:
        logger.error(f"Error creando orden: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error procesando la orden: {str(e)}")

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    """
    Obtener detalles de una orden específica
    """
    try:
        order = await db.orders.find_one({"order_number": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
        
        return order
        
    except Exception as e:
        logger.error(f"Error obteniendo orden {order_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error obteniendo la orden")

@api_router.get("/orders")
async def get_all_orders(limit: int = 50, skip: int = 0):
    """
    Obtener todas las órdenes (para administración)
    """
    try:
        orders = await db.orders.find().skip(skip).limit(limit).sort("created_at", -1).to_list(limit)
        total_orders = await db.orders.count_documents({})
        
        return {
            "orders": orders,
            "total": total_orders,
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo órdenes: {str(e)}")
        raise HTTPException(status_code=500, detail="Error obteniendo las órdenes")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()