from crontabs import Cron, Tab
from datetime import datetime
import os


def my_job(name):
    task = 'arank.py'
    os.system("python3 {}".format(task))


if __name__ == '__main__':

    Cron().schedule(
        Tab(name='forever').every(seconds=60).run(my_job, 'my_func'),
    ).go()


