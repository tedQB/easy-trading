from crontabs import Cron, Tab
from datetime import datetime
import os


def dcenter_job(name):
   task = 'dcenter.py'
   os.system("python3 {}".format(task))

def ceshi_job(name):
   task = 'ceshi.py'
   os.system("python3 {}".format(task))

def ceshi2_job(name):
   task = 'ceshi2.py'
   os.system("python3 {}".format(task))


def my_job(name):
    print('Running function with name={}'.format(name))



if __name__ == '__main__':

	# # All logging messages are sent to sdtout
	# Cron().schedule(
	#     # Turn off logging for job that runs every five seconds
	#     Tab(name='my_fast_job', verbose=False).run(dcenter_job, 'fast', seconds=5),

	#     # Go ahead and let this job emit logging messages
	#     Tab(name='my_slow_job').run(ceshi_job, 'slow', seconds=20),

	#     Tab(name='my_slow_job').run(ceshi1_job, 'slow', seconds=20),
	# ).go()

	Cron().schedule(
	    Tab(name='one').run(dcenter_job, 'dcenter_job').every(seconds=5),
	    Tab(name='two').run(ceshi_job, 'ceshi_job').every(seconds=80),
	).go()
