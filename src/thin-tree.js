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

    // Initializes root
    if (_.isEmpty(this.parent)) {
        this.root = this;
    }

    this.setChildren();
    this._memo = {};
}


ThinTree.prototype.flatten = function() {
    return _.isUndefined(this._memo.flattened) ?
        this._memo.flattened = _.reduce(this.children,
            function(accumulator, node) {
                return accumulator.concat(node.flatten()); }, [this])
    :   this._memo.flattened;
}


ThinTree.prototype.setChildren = function() {
    var self = this;
    var properties = {
        root: this.root,
        parent: this
    }
    if(_.isArray(this.children)){
        // Creates node for each child element
        this.children = _.map(this.children, function (node) {
            // Pass new object with current node properties, set the parent and root
            return new self.constructor( _.assign({}, node, properties));
        });
    }
}


ThinTree.prototype.toJSON = function() {
    var self = this;
    var obj = _(this)
        .omit('parent', 'root')
        .omit(function(value, key){
            return !_.has(self, key);
        })
    .value();

    obj.parent = this.parent ? this.parent.uuid : null;
    if (_.isEmpty(obj.children))
        obj.children = null;

    return obj;
};


ThinTree.extend = function(proto) {
    return __extends(proto, this);
};


module.exports = ThinTree;


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
    Child.prototype.__super__ = Child.__super__ =  Parent.prototype;

    return Child;
};
