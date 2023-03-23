import subprocess
import threading
from Backend.Database.scraper import scraper

def start_backend():
    # Start the backend by executing "python3 app.py" command in "Backend/" directory
    subprocess.Popen(["python3", "app.py"], cwd="Backend/")

def start_frontend():
    # Start the frontend by executing "npm start" command in "Frontend/my-app/" directory
    subprocess.Popen(["npm", "start"], cwd="Frontend/my-app/")

def start_scraper():
    print('Starting scraping')
    # Start the scraper script by executing "python3 scraper.py" command in "Backend/Scraper/scraper_py/" directory
    # subprocess.Popen(["python3", "scraper.py"], cwd="Backend/Database/")
    scraper()
    # Re-run the scraper every 600 seconds (10 minutes)
    threading.Timer(600, start_scraper).start()

# Start the backend, frontend and scraper script in separate threads
backend_thread = threading.Thread(target=start_backend)
backend_thread.start()

frontend_thread = threading.Thread(target=start_frontend)
frontend_thread.start()

scraper_thread = threading.Thread(target=start_scraper)
scraper_thread.start()
