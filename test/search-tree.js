'use strict';
var _ = require('lodash');

var utils = require('./utils');
var expect = utils.expect;

var TT = require('../');

describe('Search Tree', function() {
    var tree;
    beforeEach(function() {
        tree = new TT.Search({
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
    });

    it('should find the first matching preOrder element', function() {
        expect(tree.find(function (n) {
            return /RB/g.test(n.name) }).parent.name).to.equal('R');

        expect(tree.find(function (n) {
            return /C$/g.test(n.name) }).parent.name).to.equal('RBB');
    });

    it('should find all matching elements returned in preOrder', function() {
        expect(tree.search(function (n) {
            return /R/g.test(n.name) }).length).to.equal(tree.flatten().length);

        expect(tree.search(function (n) {
            return /B/g.test(n.name) }).length).to.equal(4);

        // expects result in preOrder
        expect(tree.search(function (n) {
            return /R$/g.test(n.name) })[0].parent).to.be.undefined;

        expect(tree.search(function (n) {
            return /C$/g.test(n.name) })[1].parent.name).to.equal('R');

    });
});
