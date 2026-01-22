class IDSEngine:
    def __init__(self):
        self.rules = {
            "MAX_CURRENT": 60.0, # Amps
            "MIN_CURRENT_CHARGING": 0.5 # Amps
        }

    def analyze_packet(self, data: dict):
        """
        Hybrid Detection Logic:
        1. Rule-Based: Hard limits (Safety)
        2. Scenario-Based: Logical inconsistencies (Theft)
        """
        voltage = data.get('voltage', 0)
        current = data.get('current', 0)
        status = data.get('status', 'Unknown')
        
        # Rule 1: DoS / Safety Violation
        if current > self.rules["MAX_CURRENT"]:
            return "CRITICAL: DoS Attack (Overcurrent)"
        
        # Rule 2: Energy Theft (FDI)
        # Situation: Station claims "Charging" but current is suspiciously low (Reading manipulated)
        if "Charging" in status and current < self.rules["MIN_CURRENT_CHARGING"]:
            # In a real ML system, we'd check historical patterns here.
            # "Simulated ML" decision:
            return "ML-DETECT: Energy Theft (FDI)"
            
        return None

ids = IDSEngine()
