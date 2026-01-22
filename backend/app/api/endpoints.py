from fastapi import APIRouter
from app.services.simulator import sim_instance
from app.services.blockchain import logger
from app.models.schemas import EVSEStatus, AttackPayload, SecurityBlock
from typing import List
import pandas as pd
from fastapi.responses import StreamingResponse
import io

router = APIRouter()

@router.get("/status")
def get_service_status():
    """
    Simple health check.
    """
    return {"status": "online", "mode": "simulation" if sim_instance.df is None else "data_driven"}

@router.get("/live-data", response_model=EVSEStatus)
def get_live_data():
    """
    Returns real-time data from the stations.
    Processed by IDS before returning.
    """
    return sim_instance.get_next_sample()

@router.post("/inject-attack")
def inject_attack(payload: AttackPayload):
    """
    Allows the 'Attack Simulator' script or Frontend to trigger scenarios.
    """
    sim_instance.set_attack(payload.type)
    return {"message": f"Attack {payload.type} initiated"}

@router.post("/reset")
def reset_simulation():
    """
    Stops all active attacks.
    """
    sim_instance.set_attack("none")
    return {"message": "Simulation reset to normal"}

@router.get("/logs", response_model=List[SecurityBlock])
def get_blockchain():
    """
    Returns the tamper-evident ledger.
    """
    return logger.get_chain()

@router.get("/export-logs")
def export_logs():
    """
    Exports session history.
    """
    chain = logger.get_chain()
    df = pd.DataFrame(chain)
    
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    response = StreamingResponse(iter([stream.getvalue()]),
                                 media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=secvolt_audit_chain.csv"
    return response
