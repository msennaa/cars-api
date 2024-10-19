import Coord from '../../src/domain/vo/Coord'

test('should create a valid coordinate', function () {
    const coord = new Coord(90, 180);
    expect(coord).toBeDefined();
    expect(coord.getLat()).toBe(90)
    expect(coord.getLong()).toBe(180)
})

test('should not create a coordinate with invalid latitude', function () {
    expect(() => new Coord(-180, 180)).toThrowError('Invalid latitude')
})

test('should not create a coordinate with invalid longitude', function () {
    expect(() => new Coord(90, -270)).toThrowError('Invalid longitude')
})
