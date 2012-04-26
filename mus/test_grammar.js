var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files



fs.readFile('mus/grammar.peg', 'ascii', function(err, grammar) {
    // Show the PEG grammar file
    console.log(grammar);
    var PARSER = PEG.buildParser(grammar);

    // Create my parser
    var parse = function(data){
        console.log("parsing: " + data);
        return PARSER.parse(data);
    };

    console.log("\n\n*******************");

    // helpers
    function sn(v) { return {tag:'seqn', 'values': v}};
    function pn(v) { return {tag:'parn', 'values': v}};

    // samples
    var e4 = { tag: 'note', pitch: 'e4', dur: 50};
    var g6 = { tag: 'note', pitch: 'g6', dur: 100};
    var rest = { tag: 'rest', dur: 100};

    // empty file -> root element is always a seqn
    assert.deepEqual("", parse(""));

    // a single note
    assert.deepEqual(e4, parse("e4:50"));

    // a sequence
    assert.deepEqual(sn([e4, g6]), parse("e4:50 g6:100"));

    // a sequence with comments and new lines
    assert.deepEqual(sn([e4, g6, e4]),
                     parse(" #hi \n  e4:50   g6:100 \n e4:50 #e5:20"));

    // rest
    assert.deepEqual(sn([e4, rest, g6]),
                     parse("e4:50 rest:100 g6:100"));

    // bloc
    assert.deepEqual(sn([rest, g6]),
                     parse("(rest:100 g6:100)"));

    assert.deepEqual(sn([e4, sn([rest, g6]) ] ),
                     parse("e4:50 (rest:100 g6:100)"));


    // par -> par elements are always seqn
    assert.deepEqual(pn([g6]),
                     parse("[g6:100]"));

    assert.deepEqual(pn([rest, g6]),
                     parse("[rest:100, g6:100]"));

    assert.deepEqual(pn([e4, sn([rest, g6]) ] ),
                     parse("[e4:50, (rest:100 g6:100)]"));

    // repeat
    assert.deepEqual({tag: 'repeat', count:2, section: e4}, parse("2 * e4:50"));
    assert.deepEqual({tag: 'repeat', count:2, section: sn([rest, e4])},
                     parse("2 * (rest:100 e4:50)"));
});
