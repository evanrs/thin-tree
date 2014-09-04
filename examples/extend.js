'use strict';
var TT = require('../');

var MemoTree = TT.extend({
    memoize: function(key, value) {
        this._memo = this._memo || {};
        return this._memo[key] = value;
    },
    resetMemo: function() {
        this._memo = {};
    }
})

var FindTree = MemoTree.extend({
    index: function() {
        return this.memoize('index', this.parent.indexOf(this));
    },
    indexOf: function(identity) {
        return _.indexOf(this.children, identity);
    },
    find: function(identity) {
        return _.find(this.flatten(), identity, this);
    },
    where: function(identity) {
        var result = _.where(this.flatten(), identity, this);
        return new this.constructor({
            search: true,
            root: this,
            parent: null,
            children: result
        });
    }
});

module.exports = {
    Find: FindTree,
    Memo: MemoTree
}