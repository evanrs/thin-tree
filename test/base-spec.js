'use strict';
var _ = require('lodash');

var utils = require('./utils');
var expect = utils.expect;

var TT = require('../');

describe('Thin Tree', function() {
    var raw = {};
    beforeEach(function() {

    });

    it('should create a tree', function() {
        var tree = new TT({
            name: "Eve",
            children: [
                {
                    name: "Alice"
                }
            ]
        });
        expect(tree.name).to.equal("Eve");
        expect(tree.children).to.be.array;
        expect(tree.children[0].name).to.equal("Alice");
        expect(tree.hasChildren()).to.equal(true);
    });

    describe('Inheritance', function() {
        var First, Second, Third;
        beforeEach(function() {
            First = TT.extend({
                type: 'first',
                first: true,
                initialize: function() {
                    this.inheritted = "roar" + Math.random();
                    this.beforeInit = "first";
                    First.__super__.initialize.call(this);
                    this.afterInit = "first";
                },
                getType: function() {
                    return this.type;
                }
            });


            Second = First.extend({
                type: 'second',
                second: true,
                initialize: function() {
                    this.beforeInit = "second";
                    Second.__super__.initialize.call(this);
                    this.afterInit = "second";
                },
                getType: function() {
                    return [this.type, Second.__super__.getType()].join(':');
                    // return this.type + (this.super().getType())
                }
            });

        });

        it('should inherit parents methods', function() {
            var first = new First();
            expect(first.constructor.__super__).to.equal(TT.prototype);
            expect(first.getType()).to.equal('first')
        });

        it('should inherit ancestor methods', function() {
            var second = new Second();
            expect(second.__super__).to.equal(First.prototype);
            expect(second.__super__.__super__).to.equal(TT.prototype);

            expect(second.type).to.equal('second');
            expect(second.__super__.type).to.equal('first');
            expect(second.__super__.__super__.type).to.be.undefined
            expect(second.beforeInit).to.equal("first");
            expect(second.afterInit).to.equal("second");


            expect(second.__model__).to.equal(Second);
            expect(second.__super__).to.equal(First.prototype);
            expect(second.__super__.__model__).to.equal(First);
            expect(second.__super__.__super__).to.equal(TT.prototype);
            expect(second.__super__.__super__.__model__).to.be.undefined

            expect(second.getType()).to.equal("second:first");
            expect(second.__super__.getType()).to.equal("first");
        })
    });

    describe('Children', function() {
        it('should report hasChildren correctly', function() {
            var tree = new TT({
                name: "Eve",
                children: [
                    {
                        name: "Alice"
                    }
                ]
            });

            expect(tree.children).to.be.array;
            expect(tree.hasChildren()).to.equal(true);
            expect(tree.children[0].hasChildren()).to.equal(false)
        });

        it('should allow changing the recursive key', function() {
            var tree = new TT({
                name: "Eve",
                _key: "eschers",
                eschers: [
                    {
                        name: "Alice",
                        eschers: [
                            {
                                _key: "schroedingers",
                                name: "Turtle",
                                schroedingers: [
                                    {
                                        name: "Cat"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            expect(tree.getChildren()).to.be.array;
            expect(tree.hasChildren()).to.equal(true);
            expect(tree.getChildren()[0].children).to.equal(undefined);
            var turtle = tree.getChildren()[0].getChildren()[0];
            expect(turtle.name).to.equal("Turtle");
            expect(turtle.eschers).to.equal(undefined);
            expect(turtle.hasChildren()).to.equal(true);
            expect(turtle.getChildren()[0].name).to.equal("Cat");
            expect(turtle.getChildren()[0].hasChildren()).to.equal(false);
        });
    });

    describe('ancestors', function () {
        var tree;
        var childRBBC;
        beforeEach(function() {
            tree = new TT({
                name: "R",
                children: [
                    { name: "RA" },
                    { name: "RB",
                        children: [
                            { name: "RBA" },
                            { name: "RBB",
                                children: [
                                    { name: "RBBC" } ]} ]},
                    { name: "RC"} ]}
            );
            childRBBC = tree.children[1].children[1].children[0];
        });

        it("creates array of ancestors", function () {
            var ancestors;
            ancestors = tree.getAncestors();
            expect(ancestors.length).to.equal(0);

            ancestors = childRBBC.getAncestors();
            expect(ancestors.length).to.equal(3);
            expect(ancestors[0].name).to.equal('RBB')
            expect(ancestors[1].name).to.equal('RB')
            expect(ancestors[2].name).to.equal('R')
        })
    });

    describe('PreOrder Traverse', function() {
        var complexTree, preOrderNames;

        beforeEach(function() {
           complexTree = new TT({
                name: "R",
                children: [{
                    name: "RA"
                }, {
                    name: "RB",
                    children: [{
                        name: "RBA"
                    },{
                        name: "RBB"
                    }]
                }, {
                    name: "RC"
                }]
            });
            preOrderNames = ["R", "RA", "RB", "RBA", "RBB", "RC"]
        });

        it('should work for a single node', function() {
            var tree = new TT({
                name: "Foo",
                children: []
            });

            expect(tree.preOrderTraverse()).to.be.array;
            expect(tree.preOrderTraverse().length).to.equal(1);
            expect(tree.preOrderNext()).to.be.equal(null);
        });

        it('should traverse a complex complexTree in pre order', function() {
            expect(complexTree.preOrderTraverse()).to.be.array;
            expect(complexTree.preOrderTraverse().length).to.equal(6);
            expect(complexTree.preOrderNext().name).to.be.equal("RA");

            var traverse = complexTree.preOrderTraverse();
            expect(traverse.length).to.equal(6);
            for (var i = 0; i < traverse.length; i++) {
                expect(traverse[i].name).to.equal(preOrderNames[i]);
            }
        });

        it('should be walkable with preOrderNext() from root', function() {
            var nextNode = complexTree;
            expect(nextNode.name).to.equal(preOrderNames[0]);

            for (var i = 1; i < preOrderNames.length; i++) {
                nextNode = nextNode.preOrderNext();
                expect(nextNode.name)
                    .to.equal(preOrderNames[i]);
            }
        });

        it('should be walkable with preOrderNext() from child', function() {
            var rbaNode = complexTree.getChildren()[1].getChildren()[0];
            expect(rbaNode.preOrderNext().name).to.equal("RBB");
            expect(rbaNode.preOrderNext()
                          .preOrderNext().name).to.equal("RC");
        });

        it('should be walkable with preOrderPrevious() from child', function() {
            var rcNode = complexTree.getChildren()[2];
            expect(rcNode.preOrderPrevious().name).to.equal("RBB");

            expect(rcNode.preOrderPrevious()
                          .preOrderPrevious().name).to.equal("RBA");

            expect(rcNode.preOrderPrevious()
                          .preOrderPrevious()
                          .preOrderPrevious().name).to.equal("RB");
        });
    });

    describe("Serialization", function() {
        var tree, flattened;

        beforeEach(function() {
            tree = new TT({
                name: "Eve",
                _key: "eschers",
                eschers: [
                    {
                        name: "Alice",
                        eschers: [
                            {
                                _key: "schroedingers",
                                name: "Turtle",
                                schroedingers: [
                                    {
                                        name: "Cat"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            flattened = tree.flatten();
        });

        it("should remove properties prefixed with '_'", function(){
            _.each(tree.flatten(), function(node){
                var prefixedKeys = _(node.toJSON()).keys().filter(function(key){
                    return key[0] === '_';
                });
                expect(prefixedKeys.size()).to.equal(0);
            });
        });

        it("should remove circular references", function(){
            _.each(flattened, function(node) {
                var serialized = node.toJSON();
                expect(serialized.root).to.be.undefined;
                expect(serialized.parent).to.be.undefined;
            })
        });
    });
});
