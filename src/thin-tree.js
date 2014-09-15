'use strict';
var _ = require('lodash');


/**
 * Initializes ThinTree and creates tree with root and children
 * @param {Object} options {root?, parent?}
 */
var ThinTree = function(node) {
    // Makes for better inheritance.
    this.initialize(node);
};


ThinTree.prototype.initialize = function(node) {
    // Assigns element, other options and defaults
    _.assign(this, node);
    _.defaults(this, {
        root: this, // self reference root if not present
        _key: 'children' // set the collection key
    });
    // Recursively creates descendant nodes
    this.addChildren();
}

ThinTree.prototype.flatten = function() {
    return this._flattened = this._flattened || _.reduce(
        this.getChildren(),
        function(accumulator, node) {
            return accumulator.concat(node.flatten()); },
        [this]
    );
}

ThinTree.prototype.preOrderTraverse = function() {
    var accumulator = [];

    // Memoize on a node
    if (this._preOrder) {
        return this._preOrder;
    }

    // Add this node
    accumulator.push(this);

    // Add children (recursively)
    _.each(this.getChildren(), function(childNode) {
        accumulator = accumulator.concat(childNode.preOrderTraverse());
    })

    return this._preOrder = accumulator;
}

ThinTree.prototype.preOrderNext = function(node) {
    var thisNodeIndex = this.root.preOrderTraverse().indexOf(this);
    if (thisNodeIndex < this.root.preOrderTraverse().length - 1) {
        return this.root.preOrderTraverse()[thisNodeIndex + 1];
    } else {
        return null;
    }
}

ThinTree.prototype.getChildren = function() {
    return this[this._key] || [];
}


ThinTree.prototype.setChildren = function(children) {
    return this[this._key] = children;
}

ThinTree.prototype.hasChildren = function(children) {
    return !_.isEmpty(this.getChildren());
}

ThinTree.prototype.isRoot = function() {
    return this.root === this;
}

ThinTree.prototype.addChild = function(node, index) {
    if (_.isPlainObject(node)) {
        node = new this.constructor(node); }
    index = _.isNumber(index) ? index : this.getChildren().length;
    return this.getChildren()[index] = node;
}

ThinTree.prototype.addChildren = function() {
    // Creates node for each child element
    return _.map(this.getChildren(), function (node, index) {
        // Set the parent and root
        node = _.defaults({
            parent: this,
            root: this.root,
        }, node, {
            // Propagate the recursive key, let children change it
            _key: this._key
        });
        // Pass new object with current node properties
        return this.addChild(node, index);
    // Pass in context as last parameter of function call
    }, this);
}


ThinTree.prototype.toJSON = function() {
    var self = this;
    var obj = _(this)
        .omit('parent', 'root')
        .omit(function(value, key){
            return key[0] === '_' || !_.has(self, key);
        })
    .value();

    return obj;
};


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
    ThinTree.prototype[method] = function() {
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
    ThinTree.prototype[method] = function() {
        var args = _.toArray(arguments);
        args.unshift(this);
        return _[method].apply(_, args);
    }
});


///////////////////////////////////////////////////////////////////////////////
///
///                             Inheritance
///
///////////////////////////////////////////////////////////////////////////////

ThinTree.extend = function(proto, statics) {
    var Model = __extends(proto, this);
    _.assign(Model, statics)
    return Model;
};

var __hasProp = {}.hasOwnProperty;
var __extends = function(proto, Parent) {
    function Child() {
        Child.__super__.constructor.apply(this, arguments);
    };

    for (var key in Parent) {
        if (__hasProp.call(Parent, key)) Child[key] = Parent[key];
    }

    function Ctor() {
        this.constructor = Child;
    }
    Ctor.prototype = Parent.prototype;
    Child.prototype = new Ctor();
    _.assign(Child.prototype, proto);
    Child.prototype.__model__ = Child;
    Child.prototype.__super__ = Child.__super__ = Parent.prototype;

    return Child;
};

///////////////////////////////////////////////////////////////////////////////
///
///                            Utility
///
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
///
///                            Exports
///
///////////////////////////////////////////////////////////////////////////////

module.exports = ThinTree;
