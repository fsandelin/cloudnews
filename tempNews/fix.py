f = open("lokala.py", 'r')


lines = f.readlines()

f.close()

f.open("lokala.py", 'w')

for line in lines:
    f.write(line)