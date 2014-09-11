'use strict';

var _ = require('lodash');

function Collection() {
    _.defaults(this, {
        _key: 'collection'
    });
    this.setCollection();
}

Collection.prototype.setCollection = function(collection) {
    return this[this._key] = collection || [];
}

Collection.prototype.getCollection = function() {
    return this[this._key];
}

var collectionMethods = [
        'chain',
        /**
         * Collection Methods
         */
        'at', 'contains', 'countBy', 'every', 'filter', 'find', 'findLast',
        'forEach', 'forEachRight', 'groupBy', 'indexBy', 'invoke', 'map',
        'max', 'min', 'pluck', 'reduce', 'reduceRight', 'reject', 'sample',
        'shuffle', 'size', 'some', 'sortBy', 'toArray', 'where',
        /**
         * Object method
         */
        'transform',
        /**
         * Array methods, sorted by type of operation
         */
        'indexOf', 'lastIndexOf',
        'findIndex', 'findLastIndex',
        'first', 'last',
        'initial', 'rest',
        'difference', 'intersection', 'union', 'uniq', 'without', 'xor',
        'sortedIndex',
        /**
         * Not applicable or destructive
            'flatten',
            'range',
            'compact',
            'pull', 'remove',
            'zip', 'zipObject'
         */
    ];

_.each(collectionMethods, function(method) {
    Collection.prototype[method] = function() {
        var args = _.toArray(arguments);
        args.unshift(this.getCollection());
        return _[method].apply(_, args);
    }
});

module.exports = Collection;