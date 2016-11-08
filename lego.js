'use strict';

exports.isStar = false;

exports.query = function (collection) {
    var arrayFunctions = [].slice.call(arguments, 1);
    arrayFunctions = sortArrayFunctions(arrayFunctions);
    var newCollection = JSON.parse(JSON.stringify(collection));
    arrayFunctions.forEach(function (func) {
        newCollection = func(newCollection);
    });

    return newCollection;
};

function sortArrayFunctions(arrayFunctions) {
    var orderFunctions = { 'select': 3, 'filterIn': 1, 'sortBy': 2, 'format': 4, 'limit': 5 };
    arrayFunctions.sort(function (a, b) {

        return (orderFunctions[a.name] > orderFunctions[b.name]);
    });

    return arrayFunctions;
}

exports.select = function () {
    var selectArgs = [].slice.call(arguments);

    return function select(collection) {
        collection.forEach(function (friend) {
            Object.keys(friend).forEach(function (key) {
                if (selectArgs.indexOf(key) === -1) {
                    delete friend[key];
                }
            });
        });

        return collection;

    };
};

exports.filterIn = function (property, values) {

    return function filterIn(collection) {
        return collection.filter(function (friend) {
            return values.indexOf(friend[property]) !== -1;
        });
    };
};

exports.sortBy = function (property, order) {

    return function sortBy(collection) {

        return collection.sort(function (a, b) {
            if (order === 'desc') {

                return a[property] < b[property];
            }

            return a[property] > b[property];
        });
    };
};

exports.format = function (property, formatter) {

    return function format(collection) {
        collection.forEach(function (friend) {
            if (friend.hasOwnProperty(property)) {
                friend[property] = formatter(friend[property]);
            }
        });

        return collection;

    };
};

exports.limit = function (count) {

    return function limit(collection) {

        return collection.slice(0, count);
    };
};

if (exports.isStar) {

    exports.or = function () {

        return;
    };

    exports.and = function () {

        return;
    };
}
