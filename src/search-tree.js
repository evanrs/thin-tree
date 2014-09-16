var TT = require('./thin-tree');


var SearchTree = {

    searchTree: function(query, op, source) {
        op = op || 'where';
        source = source || this.preOrderTraverse();
        return _[op](source, query);
    },

    searchFollowing: function(query, wrap) {
        return this.search(query, this.getFollowing(wrap));
    },

    searchPreceding: function(query, wrap) {
        return this.search(query, this.getPreceding(wrap))
    },

    searchSubtree: function(query, op) {
        op = op || 'where';
        return this[op](query) || this.reduce(function(targets, node) {
            return targets.concat(node.searchSubtree(query));
        }, [])
    },

    findTree: function(query, source, op) {
        this.search(query, null, 'find');
    },

    findFollowing: function(query, wrap) {
        return this.find(query, this.getFollowing(wrap));
    },

    findPreceding: function(query, wrap) {
        return this.find(query, this.getPreceding(wrap))
    },

    findSubtree: function(query, op) {
        return this.find(query) || this.reduce(function(target, node) {
            return target || node.findSubtree(query);
        }, null)
    },

    getPreceding: function(wrap) {
        var preorder = this.root.preOrderTraverse().reverse();
        var index = preorder.indexOf(this);
        return preorder.slice(index + 1).concat(
            wrap ? preorder.slice(0, index) : []
        );
    },

    getFollowing:  function(wrap) {
        var preorder = this.root.preOrderTraverse();
        var index = preorder.indexOf(this);
        return preorder.slice(index + 1).concat(
            wrap ? preorder.slice(0, index) : []
        );
    }

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
    SearchTree[method] = function() {
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
    SearchTree[method] = function() {
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


module.exports = TT.extend(SearchTree);

