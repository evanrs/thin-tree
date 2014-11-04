var _ = require('lodash');

var TT = require('./thin-tree');
var LodashWrapper = require('./lodash-wrapper');

var SearchTree = TT.extend({
    initialize: function() {
        var result = SearchTree.__super__.initialize.apply(this, arguments);
        this._ = new LodashWrapper(this)
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
        return (this.matches(query, operator) || []).concat(
            this._[iterator](this.getChildren(), function(target, node) {
                return target.concat(node.search(query, operator, iterator))
            }, [])
        );
    }
});


///////////////////////////////////////////////////////////////////////////////
///
///                            Exports
///
///////////////////////////////////////////////////////////////////////////////


module.exports = SearchTree;

