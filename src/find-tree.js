'use strict';
var _ = require('lodash');

var TT = require('./thin-tree');
var Collection = require('./collection');

var FindTree = TT.extend({
    index: function() {
        return this.parent && this.parent.indexOf(this);
    }
});

_.assign(FindTree.prototype, Collection.prototype);

_.each(['assign', 'defaults', 'has', 'omit', 'pick'], function(method) {
    FindTree.prototype[method] = function() {
        var args = _.toArray(arguments);
        args.unshift(this);
        return _[method].apply(_, args);
    }
});



module.exports = FindTree;