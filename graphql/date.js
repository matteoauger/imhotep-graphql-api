const { Kind } = require('graphql/language');

module.exports = Object.freeze({
    name: 'Date',
    description: 'Date',
    serialize(value) {
        return value.getTime();
    },

    parseValue(value) {
        return new Date(value);
    },

    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(ast.value) 
        }
        return null;
    },
});