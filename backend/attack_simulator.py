import requests
import time
import sys

API_URL = "http://localhost:8000/api/inject-attack"

def print_menu():
    print("\nXXX --- [ RED TEAM ATTACK CONSOLE ] --- XXX")
    print("1. Inject DoS Attack (Overcurrent > 120A)")
    print("2. Inject Energy Theft (FDI / Low Current)")
    print("3. STOP All Attacks (Return to Normal)")
    print("4. Exit")
    print("-------------------------------------------")

def send_attack(attack_type):
    try:
        payload = {"type": attack_type, "duration": 15}
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            print(f"\n[SUCCESS] Command Sent: {attack_type.upper()}")
        else:
            print(f"\n[ERROR] Failed: {response.text}")
    except Exception as e:
        print(f"\n[CRITICAL] Could not connect to backend: {e}")

def main():
    while True:
        print_menu()
        choice = input("Select Option > ")
        
        if choice == '1':
            send_attack("dos")
        elif choice == '2':
            send_attack("theft")
        elif choice == '3':
            send_attack("none")
        elif choice == '4':
            print("Exiting...")
            sys.exit()
        else:
            print("Invalid selection.")
        
        time.sleep(1)

if __name__ == "__main__":
    main()
