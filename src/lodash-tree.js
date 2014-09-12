var _ = require('lodash');
var TT = require('thin-tree');

var _Tree = TT.extend({});


///////////////////////////////////////////////////////////////////////////////
///
///                         Collection Methods
///
///////////////////////////////////////////////////////////////////////////////

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
    _Tree.prototype[method] = function() {
        var args = _.toArray(arguments);
        args.unshift(this.getChildren());
        return _[method].apply(_, args);
    }
});


///////////////////////////////////////////////////////////////////////////////
///
///                         Attribute Methods
///
///////////////////////////////////////////////////////////////////////////////

_.each(['assign', 'defaults', 'has', 'omit', 'pick'], function(method) {
    _Tree.prototype[method] = function() {
        var args = _.toArray(arguments);
        args.unshift(this);
        return _[method].apply(_, args);
    }
});


///////////////////////////////////////////////////////////////////////////////
///
///                            Exports
///
///////////////////////////////////////////////////////////////////////////////

module.exports = ThinTree;
