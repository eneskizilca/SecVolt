from pydantic import BaseModel
from typing import Optional, List

# Basic data points
class EVSEStatus(BaseModel):
    timestamp: str
    voltage: float
    current: float
    power: float
    status: str
    anomaly: Optional[str] = None

# For Attack Injection
class AttackPayload(BaseModel):
    type: str  # "dos", "theft", "none"
    duration: int = 10 # seconds

# Blockchain Block
class SecurityBlock(BaseModel):
    index: int
    timestamp: str
    event_type: str
    details: str
    previous_hash: str
    hash: str
