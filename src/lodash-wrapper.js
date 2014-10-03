var _ = require('lodash');


///////////////////////////////////////////////////////////////////////////////
///
///                             LodashWrapper
///
///////////////////////////////////////////////////////////////////////////////

function LodashWrapper(node) {
    this.getNode = _.constant(node);
}

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

_.each(collectionMethods, function(method) {
    LodashWrapper.prototype[method] = function() {
        var args = _.toArray(arguments);
        args.unshift(this.getNode().getChildren());
        return _[method].apply(_, args);
    }
});


///////////////////////////////////////////////////////////////////////////////
///
///                         Attribute Methods
///
///////////////////////////////////////////////////////////////////////////////

_.each(['assign', 'defaults', 'has', 'omit', 'pick'], function(method) {
    LodashWrapper.prototype[method] = function() {
        var args = _.toArray(arguments);
        args.unshift(this.getNode());
        return _[method].apply(_, args);
    }
});


///////////////////////////////////////////////////////////////////////////////
///
///                            Exports
///
///////////////////////////////////////////////////////////////////////////////


module.exports = LodashWrapper;