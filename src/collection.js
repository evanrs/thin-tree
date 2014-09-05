'use strict';
function Collection() {
    this.children = [];
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
    Collection.prototype[method] = function(identity, search) {
        var args = _.toArray(arguments);
        args.unshift(search || this.children);
        return _[method].apply(_, args);
    }
});

module.exports = Collection;