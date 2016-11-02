'use strict';

exports.isStar = false;

exports.query = function (collection) {
    var arrayFunctions = [].slice.call(arguments, 1);
    arrayFunctions = sortArrayFunctions(arrayFunctions);
    var newCollection = collection.slice();
    arrayFunctions.forEach(function (func) {
        newCollection = func(newCollection);
    });

    return newCollection;
};
function sortArrayFunctions(arrayFunctions) {
    var orderFunctions = { 'select': 3, 'filterIn': 1, 'sortBy': 2, 'format': 4, 'limit': 5 };
    arrayFunctions.sort(function (a, b) {
        if (orderFunctions[a.name] > orderFunctions[b.name]) {

            return 1;
        }
        if (orderFunctions[a.name] < orderFunctions[b.name]) {

            return -1;
        }

        return 0;
    });

    return arrayFunctions;
}
exports.select = function () {
    var selectArgs = [].slice.call(arguments);

    return function select(collection) {
        collection.forEach(function (friend) {
            for (var key in friend) {
                if (selectArgs.indexOf(key) === -1) {
                    delete friend[key];
                }
            }
        });

        return collection;

    };
};

exports.filterIn = function (property, values) {

    return function filterIn(collection) {
        var arrayFriends = [];
        collection.forEach(function (friend) {
            if (values.indexOf(friend[property]) !== -1) {
                arrayFriends.push(friend);
            }
        });

        return arrayFriends;
    };
};
exports.sortBy = function (property, order) {
    var sign = 1;
    if (order === 'desc') {
        sign = -1;
    }

    return function sortBy(collection) {
        return collection.sort(function (a, b) {
            if (a[property] > b[property]) {

                return 1 * Number(sign);
            }
            if (a[property] < b[property]) {

                return -1 * Number(sign);
            }

            return 0;
        });
    };
};
exports.format = function (property, formatter) {

    return function format(collection) {
        collection.forEach(function (friend) {
            friend[property] = formatter(friend[property]);
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
