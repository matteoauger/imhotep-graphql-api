const assert = require('assert');
const Enumeration = require('../../utils/enumeration');

describe.only('Enumeration class', function() {
    it('should create a simple enumeration of string', function() {
        const object = {
            ON: 'on',
            OFF: 'off'
        };
        const enu = new Enumeration(object, { reversable: false });
        assert.deepEqual(Object.entries(enu), Object.entries(object));
    });
    it('should create a simple enumeration of numbers', function() {
        const object = {
            ON: 0,
            OFF: 1
        };
        const enu = new Enumeration(object, { reversable: false });
        assert.deepEqual(Object.entries(enu), Object.entries(object));
    });
    it('should create a reversable enumeration', function() {
        const object = {
            ON: 'on',
            OFF: 'off'
        };
        const enu = new Enumeration(object);
        assert.equal(enu.ON, 'on');
        assert.equal(enu.on, 'ON');
    });
    it('should create a no reversable enumeration', function() {
        const object = {
            ON: 'on',
            OFF: 'off'
        };
        const enu = new Enumeration(object, { reversable: false });
        assert.equal(enu.ON, 'on');
        assert.equal(enu.on, undefined);
    });
    it('should not be modifiable', function() {
        const object = {
            A: 'a'
        }
        const enu = new Enumeration(object);
        assert.equal(Object.keys(enu).length, 1);
        enu.B = 'b';
        assert.equal(Object.keys(enu).length, 1);
        object.B = 'b';
        assert.equal(Object.keys(enu).length, 1);
    });
    it('should support only string and number', function() {
        const object = {
            A: 'a',
            B: [1]
        }
        assert.throws(() => new Enumeration(object), /Illegal value type '\w+'/); 
    });
    it('should not have duplicated value when the enumeration is declared as reversible', function() {
        const object = {
            A: 'a',
            B: 'a',
            C: 'b'
        };
        assert.throws(() => new Enumeration(object, { reversable: true }), /Illegal duplicated key '\w+'/);
    });
    it('shoult not have a value with the name of an existing key when the enumeration is delcared as reversible', function() {
        const object = {
            A: 'C',
            B: 'A',
            C: 'B'
        };
        assert.throws(() => new Enumeration(object, { reversable: true }), /Key already define '\w+'/);
    });
});