/**
 * Gets the object's key from it's value.
 * If the value isn't unique, this function will return the first key.
 * @param {any} obj object to search
 * @param {any} value value of the wanted key
 * @throws {Error} Object must be defined
 */
module.exports.getKeyByValue = (obj, value) => {
    if (!obj) {
        throw Error('obj must be defined');
    } 

    const result = Object.keys(obj).find(key => obj[key] === value);
    
    return result;
}