var _ = require('lodash');

var TT = require('./thin-tree');

var SearchTree = TT.extend({
    initialize: function() {
        var result = SearchTree.__super__.initialize.apply(this, arguments);
        this._ = new Branch(this)
        return result;
    },

    matches: function(query, operator) {
        operator = operator || 'find';
        var match = _[operator]([this], query);
        return _.isEmpty(match) ? void 0 : match
    },

    find: function(query, operator, iterator, iterable) {
        operator = operator || 'find';
        iterator = iterator || 'reduce';
        return this.matches(query, operator) ||
            _[iterator](this.getChildren(), function(target, node) {
                return target || node.find(query, operator, iterator);
            }, null);
    },

    search: function(query, operator, iterator) {
        operator = operator || 'find';
        iterator = iterator || 'reduce';
        return this.matches(query, operator).concat(
            this._[iterator](this.getChildren(), function(target, node) {
                return target.concat(node.search(query, operator, iterator))
            }, [])
        );
    }
})

var collectionMethods = [
        'chain',
        /**
         * Collection Methods
         */
        'at', 'contains', 'countBy', 'every', 'filter', 'find', 'findLast',
        'each', 'forEach', 'forEachRight', 'groupBy', 'indexBy', 'invoke',
        'map', 'max', 'min', 'pluck', 'reduce', 'reduceRight', 'reject',
        'sample', 'shuffle', 'size', 'some', 'sortBy', 'toArray', 'where',
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

var Branch = function(node) {
    this.getChildren = _.bind(node.getChildren, node)
}

_.each(collectionMethods, function(method) {
    Branch.prototype[method] = function() {
        var args = _.toArray(arguments);
        args.unshift(this.getChildren());
        return _[method].apply(_, args);
    }
});

///////////////////////////////////////////////////////////////////////////////
///
///                            Exports
///
///////////////////////////////////////////////////////////////////////////////


module.exports = SearchTree;

