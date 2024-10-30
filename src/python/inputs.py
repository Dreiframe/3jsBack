import sys
# import time

print('Starting..')
running = True
run_time = 0
while running:
  print('Running..')
  for line in sys.stdin:
    if 'q' == line.rstrip():
        print(f'Input : {line}')
        running = False
        break
    print(f'Input : {line}')

  # print('umm..')
  # time.sleep(1)


sys.stdout.flush()