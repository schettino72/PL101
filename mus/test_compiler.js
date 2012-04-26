var compiler = require('./compiler.js');

/////////////////////////////////////////////

var melody_mus = {
    tag: 'seqn',
    values: [
        {
            tag: 'par',
            left: { tag: 'note', pitch: 'e4', dur: 500 },
            right: { tag: 'note', pitch: 'g4', dur: 500 }
        },
        {
            tag: 'store',
            name: 'xxx',
            value: { tag: 'note', pitch: 'c4', dur: 250 }
        },
        {
            tag: 'seqn',
            values: [{ tag: 'rest', duration: 30 },
                     { tag: 'load', name: 'xxx'}]
        },
        { tag: 'load', name: 'xxx'},
        {
            tag: 'repeat',
            count: 3,
            section: { tag: 'load', name: 'xxx'}
        }
    ]
};

console.log(melody_mus);
console.log(compiler.compile(melody_mus));