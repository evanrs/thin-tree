'use strict';
var _ = require('lodash');

var utils = require('./utils');
var expect = utils.expect;

var TT = require('../').Lodash;

describe('Lodash Tree', function () {
    var tree;
    beforeEach(function() {
        tree = new TT({
            children: [
                {   id: 1,
                    friends: [4, 7, 9]
                },
                {   id: 2,
                    friends: [4, 6, 8]
                },
                {   id: 3,
                    friends: [4, 5, 7]
                },
                {   id: 4,
                    friends: [1, 6]
                },
                {   id: 5,
                    friends: [4, 3, 5]
                },
                {   id: 6,
                    friends: [4, 2, 4]
                },
                {   id: 7,
                    friends: [4, 1, 3]
                },
            ]
        });
    });

    it("should expose lodash collection functions", function(){
        var friends;

        expect(tree.where({ friends: [9] }).length).to.equal(1);
        expect(tree.where({ friends: [4] }).length).to.equal(6);

        expect(tree.filter({ friends: [9] }).length).to.equal(1);
        expect(tree.reject({ friends: [9] }).length).to.equal(6);

        expect(
            tree.chain()
                .where({ friends: [4] })
                .where({ friends: [1] })
                .size().value()
            ).to.equal(1);

    })
});
