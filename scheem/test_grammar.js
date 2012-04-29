var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files



fs.readFile('scheem/grammar.peg', 'ascii', function(err, grammar) {
    // Show the PEG grammar file
    console.log(grammar);
    var PARSER = PEG.buildParser(grammar);

    // Create my parser
    var parse = function(data){
        console.log("parsing: " + data);
        return PARSER.parse(data);
    };

    // test basic scheem (from step 5)
    console.log("\n\n*******************");
    assert.deepEqual("", parse(""));
    assert.deepEqual("atom", parse("atom"));
    assert.deepEqual("+", parse("+"));
    assert.deepEqual(["+", "x", "3"], parse("(+ x 3)"));
    assert.deepEqual(["+", "1", ["f", "x", "3", "y"]], parse("(+ 1 (f x 3 y))"));

    ///// whitespace
    // more than one whitespace
    assert.deepEqual(["+", "x", "3"], parse("(+  x    3)"));
    // whitespace around parentesis
    assert.deepEqual(["+", "x", "3"], parse(" ( +  x    3 ) "));
    // tabs and new-lines
    assert.deepEqual(["+", "x", "3"], parse(" ( +   \t  x \n   3 ) "));

    // quote
    assert.deepEqual(["quote", "x"], parse("'x"));
    assert.deepEqual(["quote", ["1", "2", "3"]], parse("'(1 2 3)"));

    // comments
    assert.deepEqual("", parse(";; x"));
    assert.deepEqual(["1", "2", "3"], parse("(1 2 3);; x \n"));
    assert.deepEqual(["1", "2", "3"], parse(";; x\n ( 1 2 3)"));
});
