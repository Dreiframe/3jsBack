import sys
import time

a = 0
b = 0

#print('starting..')
sys.stdout.write('starting..\n')

try:
  a = int(sys.argv[1])
  b = int(sys.argv[2])

  time.sleep(a)
  #print(f'waited: {a}')
  sys.stdout.write(f'waited: {a}\n')

  time.sleep(b)
  #print(f'waited: {b}')
  sys.stdout.write(f'waited: {b}\n')
except:
  print("DATA_MISSING")


sys.stdout.flush()