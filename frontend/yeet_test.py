x1 = 0
y1 = 0
x2 = 1
y2 = -3

v1x = 2
v1y = 0
v2x = -2
v2y = 0
diff_x = x2 - x1
diff_y = y2 - y1
r2 = diff_x*diff_x + diff_y*diff_y
r = pow(r2, 0.5)
unit_x = diff_x/r
unit_y = diff_y/r

add_v1x = unit_x * (unit_x*(v2x - v1x) - unit_y*(v2y - v1y))
add_v1y = unit_y * (unit_x*(v2x - v1x) + unit_y*(v2y - v1y))

u1x = v1x + add_v1x
u1y = v1y + add_v1y
u2x = v2x - add_v1x
u2y = v2y - add_v1y

new1x = v1x*unit_x + v1y*unit_y
new1y = -v1x*unit_y + v1y*unit_x
new2x = v2x*unit_x + v2y*unit_y
new2y = -v2x*unit_y + v2y*unit_x
print("v1x\'", new1x)
print("v1y\'", new1y)
print("v2x\'", new2x)
print("v2y\'", new2y)

print("u1x", u1x)
print("u1y", u1y)
print("u2x", u2x)
print("u2y", u2y)

