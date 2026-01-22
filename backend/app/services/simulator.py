import pandas as pd
import random
import os
from datetime import datetime
from app.services.blockchain import logger
from app.services.ids_engine import ids

DATA_FILE = "data/kaggle_data.csv"

class Simulator:
    def __init__(self):
        self.df = None
        self.index = 0
        self.active_attack = None
        self.load_data()

    def load_data(self):
        if os.path.exists(DATA_FILE):
            try:
                self.df = pd.read_csv(DATA_FILE)
                print(f"Loaded {DATA_FILE} successfully.")
            except Exception as e:
                print(f"Error loading CSV: {e}")
                self.df = None
        else:
            print(f"{DATA_FILE} not found. Running in Pure Simulation Mode.")
            self.df = None

    def set_attack(self, attack_type: str):
        self.active_attack = attack_type
        if attack_type != "none":
            logger.add_block("ATTACK_INJECTED", f"User manually triggered {attack_type}")

    def get_next_sample(self):
        # 1. Get Base Data (Real or Simulated)
        data = self._read_next_row()
        
        # 2. Inject Attack (If Active)
        if self.active_attack == "dos":
            data['current'] = 120.5 # Dangerous level
            data['power'] = (data['voltage'] * data['current']) / 1000
        
        elif self.active_attack == "theft":
            data['current'] = 0.1 # Fake low reading
            data['power'] = 0.0
            
        # 3. Running IDS Analysis
        anomaly = ids.analyze_packet(data)
        
        if anomaly:
            data['anomaly'] = anomaly
            data['status'] = "Alert"
            # Log to Blockchain only on new detection to avoid spamming? 
            # For demo, let's log criticals.
            # logger.add_block("IDS_ALERT", anomaly) 
            # Commented out to avoid infinite loop of blocks if polling fast, 
            # but in production, we would log this.
        
        return data

    def _read_next_row(self):
        # Fallback to pure random if no CSV
        if self.df is None:
            return self._generate_dummy()
            
        # Read from CSV
        if self.index >= len(self.df):
            self.index = 0
            
        row = self.df.iloc[self.index]
        self.index += 1
        
        try:
            # Reconstruct logic
            fmt = "%H:%M"
            # Handle potential format issues or missing keys
            t1 = datetime.strptime(str(row.get('Charging_Start_Time', '12:00')), fmt)
            t2 = datetime.strptime(str(row.get('Charging_End_Time', '13:00')), fmt)
            duration = (t2 - t1).seconds / 3600.0
            if duration <= 0: duration = 1
            
            energy_kwh = float(row.get('Energy_Consumed_kWh', 0))
            voltage = 220 + random.uniform(-3, 3)
            current = (energy_kwh * 1000) / (voltage * duration)
            if current > 80: current = 80
            if current < 0: current = 0
            
            return {
                "timestamp": datetime.now().isoformat(),
                "voltage": voltage,
                "current": current,
                "power": energy_kwh,
                "status": f"{row.get('Vehicle_Type', 'EV')} Charging",
                "anomaly": None
            }
        except:
            return self._generate_dummy()

    def _generate_dummy(self):
        return {
            "timestamp": datetime.now().isoformat(),
            "voltage": 220 + random.uniform(-2, 2),
            "current": 16 + random.uniform(-0.5, 0.5),
            "power": 3.5,
            "status": "Simulation Mode",
            "anomaly": None
        }

sim_instance = Simulator()
