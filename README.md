thin-tree ![thin-tree build status.](https://circleci.com/gh/evanrs/thin-tree.png?circle-token=d2e80e8b778c36a3039678dd5aa73d5bf24b958d)
=========
Thin tree helps build recursive structures.


__Usage__
```javascript
var TT = require('thin-tree');

var eve = {
    name: "Eve",
    children: [
        {
            name: "Alice",
            age: 7
        },
        {
            name: "Bob",
            age: 5
        }
    ]
}

var eveTree = new TT.Find(eve);
expect('Alice' === eveTree.first().name).toBe(true);
expect('Alice' === eveTree.chain()
            .where({parent: eveTree})
                .first().value().name).toBe(true);
expect('Bob' === eveTree.find({age: 5}).name).toBe(true);

var SomeTree = TT.Find.extend({
    prev: function() {
        return !this.parent ? null
            :   this.parent.at(this.index() - 1);
    },
    next: function() {
        return !this.parent ? null
            :   this.parent.at(this.index() + 1);
    }
});

var someEveTree = new SomeTree(eve);
// Inheritance broken
expect(someEveTree.first().next().name).toBe('Bob'); // Fails
```