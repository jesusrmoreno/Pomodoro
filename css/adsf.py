def evalPoly(x, n, a):
    val1 = x * (x * (a[3] * x + a[2]) + a[1])    + a[0];
    print val1
    val2 = a[0] + x * (a[1] + x * (a[2] + x * a[3]));
    print val2

def evalPoly1(x, n, a):
    val = a[0]
    y = x
    for k in range(1, n):
        val = val + a[k] * y
        y = y * x
    return val

def evalPoly3(x, n, a):
    # a(0);
    # (a(1) * x) + a(0);
    # x(a(2) * x + a(1)) + a(0);
    # x(x(a(3) * x + a(2)) + a(1)) + a(0);
    # x(x(x(a(4) * x + a(3)) + a(2)) + a(1)) + a(0)
    
    val = 0;
    if (n > 0):
        for k in range(n, 0, -1):
            val = x * val + a[k - 1]
    else:
        val = a[0]
    return val

# def evalRecursive(x, n, a):
#     return evalRecursiveHelper

# def evalRecursiveHelper(x, n, a):

#     if ()
#     return



listofnumbers = [10, 1, 123123.23492734293847987, 3.423223412342342331291, 4123.1231, 5.9123123312345, 2, 2, 2, 2]

# print evalPoly(2, 3, listofnumbers);
# print evalPoly1(3, 10, listofnumbers);
# print evalPoly3(3, 10, listofnumbers);

for i in range(0, 10):
    print evalPoly1(i + 10, i, listofnumbers);
    print evalPoly3(i + 10, i, listofnumbers);
    print 
    





