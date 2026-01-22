import hashlib
import json
from datetime import datetime

class BlockchainLogger:
    def __init__(self):
        self.chain = []
        self.create_genesis_block()

    def create_genesis_block(self):
        genesis_block = {
            "index": 0,
            "timestamp": datetime.now().isoformat(),
            "event_type": "GENESIS",
            "details": "Blockchain Initialized",
            "previous_hash": "0",
            "hash": self.calculate_hash(0, "0", datetime.now().isoformat(), "GENESIS")
        }
        self.chain.append(genesis_block)

    def calculate_hash(self, index, previous_hash, timestamp, event_type):
        value = f"{index}{previous_hash}{timestamp}{event_type}"
        return hashlib.sha256(value.encode()).hexdigest()

    def add_block(self, event_type, details):
        previous_block = self.chain[-1]
        index = len(self.chain)
        timestamp = datetime.now().isoformat()
        
        # SHA-256 Hash Chaining
        block_hash = self.calculate_hash(index, previous_block["hash"], timestamp, event_type)
        
        block = {
            "index": index,
            "timestamp": timestamp,
            "event_type": event_type,
            "details": details,
            "previous_hash": previous_block["hash"],
            "hash": block_hash
        }
        
        self.chain.append(block)
        return block

    def get_chain(self):
        return self.chain

# Global Instance
logger = BlockchainLogger()
