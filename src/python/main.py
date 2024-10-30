# python_launched_from_nodejs.py
import sys

a = 0
b = 0

try:
  a = sys.argv[1]
  b = sys.argv[2]
  print(a, b)
except:
  print("DATA_MISSING")


sys.stdout.flush()