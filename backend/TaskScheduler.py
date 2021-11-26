import schedule
import time
import threading


class TaskScheduler:
    def __init__(self) -> None:
        return

    def start(self) -> None:
        threading.Thread(target=self.loop).start()

    def loop(self) -> None:
        while True:
            time.sleep(60*5)
            schedule.run_pending()

    def add_Daily_Task(self, task) -> None:
        schedule.every().day.at("00:01").do(task)
