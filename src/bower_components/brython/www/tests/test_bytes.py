assert str(bytes("㋰",'utf-8'))==r"b'\xe3\x8b\xb0'"

assert [hex(c) for c in bytes('abcd','utf-8')] == ['0x61', '0x62', '0x63', '0x64']
assert [hex(c) for c in bytes('€','utf-8')] == ['0xe2', '0x82', '0xac']

z = bytes("девушка","utf-8")
rz = str(z)
sz = r"b'\xd0\xb4\xd0\xb5\xd0\xb2\xd1\x83\xd1\x88\xd0\xba\xd0\xb0'"

assert rz == sz

b=bytearray('abcd','ascii')
b[1]=106
assert str(b) == "bytearray(b'ajcd')"

b = bytearray([0,1,2,3])
del b[1:2]
assert b==bytearray([0,2,3])
b.reverse()
assert b==bytearray([3,2,0])
b.sort()
assert b == bytearray([0,2,3])
b.pop()
assert b == bytearray([0,2])
b.append(5)
assert b == bytearray([0,2,5])
b.insert(1,4)
assert b == bytearray([0,4,2,5])


# encoding and decoding
for word in ['donnée','ήλιος','машина','太陽']:
    b = word.encode('utf-8')
    assert b.decode('utf-8') == word

print('passed all tests...')