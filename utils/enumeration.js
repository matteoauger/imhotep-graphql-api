/**
 * Enumeration constructor.
 * 
 * @param {object} obj - the enumeration definition.
 * @param {Options} options - enumeration options.
 * @returns {Enumeration}
 */
function Enumeration(obj, { reversable = true } = {}) {
    const addProperties = (obj, enumerable) => {
        Object.entries(obj).forEach(([key, value]) => {
            if (this.hasOwnProperty(key)) {
                throw new Error(`Key already define '${key}'.`);
            }
            checkType(value);
            Object.defineProperty(this, key, {
                enumerable,
                writable: false,
                value
            });
        });
    };
    addProperties(obj, true);
    if (reversable) {
        addProperties(reverse(obj), false);
    }
    return Object.freeze(this);
}

/**
 * Reverse an object.
 * @param {object} obj the object to reverse.
 * @returns {object} the reversed object `{ [value]: key }`.
 * @throws {Error} multiple keys shared the same value or value different of string or number.
 */
function reverse (obj) {
    const reverseObj = {};
    Object.entries(obj).forEach(([key, value]) => {
        if (reverseObj.hasOwnProperty(value)) {
            throw new Error(`Illegal duplicated key '${value}'.`);
        }
        checkType(value);
        reverseObj[value] = key;
    });
    return reverseObj;
};

/**
 * 
 * @param {any} value
 * @returns {void}
 * @throws {Error} if `type` is not of type `number|string`. 
 */
function checkType(value) {
    const type = typeof value;
    if (type !== 'number' && type !== 'string') {
        throw new Error(`Illegal value type '${type}'`);
    }
}

/**
 * Enumeration options.
 * @typedef {object} Options
 * @property {boolean} [reversable=true] - if `true`, key can be resolved by value.
 */

module.exports = Enumeration;