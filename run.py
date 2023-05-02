import subprocess
import threading

def start_backend():
    # Start the backend by executing "python3 app.py" command in "Backend/" directory
    subprocess.Popen(["python3", "app.py"], cwd="Backend/")

def start_frontend():
    # Start the frontend by executing "npm start" command in "Frontend/my-app/" directory
    subprocess.Popen(["npm", "start"], cwd="Frontend/my-app/")

# Start the backend, frontend and scraper script in separate threads
backend_thread = threading.Thread(target=start_backend)
backend_thread.start()

frontend_thread = threading.Thread(target=start_frontend)
frontend_thread.start()