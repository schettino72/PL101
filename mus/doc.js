/*
Read a sample input in NODE language and print generated MUS code line by line

$ node mus/doc.js mus/tutorial.note
*/

var fs = require('fs'); // for loading files
var pegjs = require('pegjs');
var compiler = require('./compiler.js');

var grammar = fs.readFileSync('mus/grammar.peg', 'ascii');
var parser = pegjs.buildParser(grammar);


function print_section(section){
    if (section.length == 0)
        return

    // print input
    for (var code in section){
        console.log("> ", section[code]);
    }

    console.log(compiler.compile(parser.parse(section.join(" "))));
}

function gen_doc(filename){
    var data = fs.readFileSync(doc_file, 'ascii').split('\n');
    var section = []; // sections are separated by empty line

    for (var line in data){
        if (data[line] == ""){
            print_section(section);
            section = [];
            console.log();
            continue;
        }
        if (data[line][0] == "#"){
            console.log(data[line]);
            continue;
        }
        section.push(data[line]);
    }
    print_section(section);
}


var doc_file = process.argv[2];
gen_doc(doc_file);
