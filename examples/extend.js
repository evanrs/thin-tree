'use strict';
var TT = require('../');

var MemoTree = TT.extend({
    initialize: function() {
        this.constructor.__super__.initialize.apply(this, arguments);
    },
    memoize: function(key, value) {
        return this._memo[key] = this._memo[key] || _.result([value], 0);
    },
    resetMemo: function() {
        this._memo = {};
    }
})

MemoTree.extend = function(proto) {
    _(proto).filter(_.isFunction).each(function(fn, k) {
        // Create function to store val
        var memoizer = function(identity) {
            var key, val;

            key = k;
            if(_.isString(identity) || _.isNumber(identity)) {
                key = k + '_' + identity;
            }

            this.memoize(key, val);
            val = this._meta[key]
                = this._meta[key] || _.bind(fn.apply(this, arguments);

            return val;
        }

        // Replace with memoized fn
        proto[k] = memoizer;
    })
}


module.exports = {
    Memo: MemoTree
}