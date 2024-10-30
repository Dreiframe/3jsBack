import sys
import time

a = 0
b = 0

print('starting..')

try:
  a = int(sys.argv[1])
  b = int(sys.argv[2])

  time.sleep(a)
  print(f'waited: {a}')

  time.sleep(b)
  print(f'waited: {b}')

  print('done')
except:
  print("DATA_MISSING")


sys.stdout.flush()