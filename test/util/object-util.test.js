const assert = require('assert');
const objectUtil = require('../../utils/object-util');

describe('Object utility', () => {
    it('should return the key from the given value', () => {
        const data = {
            Test: 'TEST',
            Test2: 'TEST2'
        };

        const result = objectUtil.getKeyByValue(data, 'TEST2');
        assert.equal(result, 'Test2');
    });

    it('should return undefined on non-existing key/value association', () => {
        const data = {
            FIRST: 'a',
            SECOND: 'b'
        };
        const result = objectUtil.getKeyByValue(data, 'c');

        assert.equal(result, undefined);
    });

    it('should throw error on non-existing object', () => {
        assert.throws(() => objectUtil.getKeyByValue(null, 'a'), Error,  'obj must be defined');
    });
});
