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

ThinTree.prototype.isRoot = function() {
    return this.root === this;
}

ThinTree.prototype.flatten = function() {
    return this._flattened = this._flattened || _.reduce(
        this.getChildren(),
        function(accumulator, node) {
            return accumulator.concat(node.flatten()); },
        [this]
    );
}

ThinTree.prototype.getAncestors = function getAncestors () {
    var ancestors = [];
    var parent = this.parent;
    while (parent) {
        ancestors.push(parent);
        parent = parent.parent;
    }
    return ancestors;
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

ThinTree.prototype.preOrderFollowing = function() {
    var order = this.root.preOrderTraverse();
    var index = order.indexOf(this);
    return index < order.length - 1 ? order.slice(index + 1) : [];
}

ThinTree.prototype.preOrderNext = function() {
    return this.preOrderFollowing()[0] || null;
}

ThinTree.prototype.preOrderPreceding = function() {
    var order = this.root.preOrderTraverse();
    var index = order.indexOf(this);
    return index > 0 ? order.slice(0, index).reverse() : [];
}

ThinTree.prototype.preOrderPrevious = function() {
    return this.preOrderPreceding()[0] || null
}

ThinTree.prototype.getChildren = function() {
    return this[this._key] ? this[this._key] : (this[this._key] = []);
}


ThinTree.prototype.setChildren = function(children) {
    return this[this._key] = children;
}

ThinTree.prototype.hasChildren = function(children) {
    return !_.isEmpty(this.getChildren());
}

ThinTree.prototype.addChild = function(node, index) {
    if (_.isPlainObject(node)) {
        node = new this.constructor(node); }
    index = _.isNumber(index) ? index : this.getChildren().length;
    node.parent = this;
    node.root = this.root;
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
    
    obj.children = obj.children.map(function (child) {
        return child.toJSON();
    });

    return obj;
};


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
///                            Exports
///
///////////////////////////////////////////////////////////////////////////////

module.exports = ThinTree;
