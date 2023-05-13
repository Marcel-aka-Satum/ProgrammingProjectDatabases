import subprocess
import threading
import signal
import os

ports_to_kill = [4444, 3000]


def start_backend():
    # Start the backend by executing "python3 app.py" command in "Backend/" directory
    backend_process = subprocess.Popen(["python3", "app.py"], cwd="Backend/")
    return backend_process


def start_frontend():
    # Start the frontend by executing "npm start" command in "Frontend/my-app/" directory
    frontend_process = subprocess.Popen(["npm", "start"], cwd="Frontend/my-app/")
    return frontend_process


def kill_port(port: int):
    # Kill the process running on the given port
    subprocess.run(["fuser", "-k", str(port) + "/tcp"], check=False, capture_output=True)


def kill_ports_and_processes(ports, processes):
    for port in ports:
        kill_port(port)
        for process in processes:
            process.terminate()
            process.wait()


backend_thread = threading.Thread(target=start_backend)
backend_process = start_backend()
backend_thread.start()

frontend_thread = threading.Thread(target=start_frontend)
frontend_process = start_frontend()
frontend_thread.start()

try:
    # Wait for the threads to finish
    backend_thread.join()
    frontend_thread.join()
except KeyboardInterrupt:
    print("Interrupted, cleaning up...")

finally:
    # Execute the commands to kill the specified ports and processes
    kill_ports_and_processes(ports_to_kill, [backend_process, frontend_process])
