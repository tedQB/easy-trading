from crontabs import Cron, Tab
import time
import datetime
from datetime import timedelta
import sys
import os


def my_job(name):
    task = 'arank.py'
    if len(sys.argv) == 3:
        startTime = sys.argv[1]
        endTime =  sys.argv[2]
        task = 'arank.py '+startTime+' '+endTime
    elif len(sys.argv) == 2:
        startTime = sys.argv[1]
        endTime = datetime.datetime.now().strftime('%Y-%m-%d')
        task = 'arank.py '+startTime+' '+endTime
    else:
        endTime = datetime.datetime.now().strftime('%Y-%m-%d')
        task = 'arank.py '+endTime

    print('task',task)
    os.system("python3 {}".format(task))


if __name__ == '__main__':

    Cron().schedule(
        Tab(name='forever').run(my_job, 'my_func').every(seconds=30),
    ).go()


