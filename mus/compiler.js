// convertion table from pitch letters to MIDI note numbers
// http://www.phys.unsw.edu.au/jw/notes.html
PITCH = {a: 9,
         b: 11,
         c: 0,
         d: 2,
         e: 4,
         f: 5,
         g: 7
        };


function Note(start, mus){
    this.start = start;
    this.duration = 0;
    this.notes = [];
    this[mus.tag](mus); // compile
}

// store variables
Note.prototype.VAR = {};

Note.prototype.pitch2midi = function(pitch){
    return 12 + PITCH[pitch[0]] + 12 * pitch[1];
};


Note.prototype._add_note = function(mus){
    var note = new Note(this.start + this.duration, mus);
    this.notes = this.notes.concat(note.notes);
    this.duration += note.duration;
};


// add list of MUS in parallel
Note.prototype._add_notes = function(mus_list){
    var max_duration = 0;
    var note = null;
    var note_list = null;
    for (var i=0, max=mus_list.length; i<max; i++){
        note = new Note(this.start + this.duration, mus_list[i]);
        this.notes = this.notes.concat(note.notes);
        if (note.duration > max_duration)
            max_duration = note.duration;
    }
    this.duration += max_duration;
};


/**** compile tags *****/

Note.prototype.note = function(item){
    this.notes.push({
        tag: 'note',
        pitch: this.pitch2midi(item.pitch),
        start: this.start,
        dur: item.dur
    });
    this.duration += item.dur;
};

Note.prototype.seq = function(item){
    this._add_note(item.left);
    this._add_note(item.right);
};

// seqn -> values: list of MUS to applied in sequence
Note.prototype.seqn = function(item){
    for (var i=0, max=item.values.length; i<max; i++){
        this._add_note(item.values[i]);
    }
};

Note.prototype.par = function(item){
    this._add_notes([item.left, item.right]);
};

// parn -> values: list of MUS to applied in parallel
Note.prototype.parn = function(item){
    this._add_notes(item.values);
};

Note.prototype.rest = function(item){
    this.duration += item.duration;
};

Note.prototype.repeat = function(item){
    for (var i=0; i<item.count; i++){
        this._add_note(item.section);
    }
};

// store ->  name: variable name
//           value: MUS to be stored in a variable
Note.prototype.store = function(item){
    this.VAR[item.name] = new Note(0, item.value);
};

// load -> name: variable name to load NOTES from
Note.prototype.load = function(item){
    var note_list = this.VAR[item.name].notes;
    for (var i=0, max=note_list.length; i<max; i++){
        this.notes.push({
            tag: note_list[i].tag,
            pitch: note_list[i].pitch,
            start: note_list[i].start + this.start,
            dur: note_list[i].dur
        });
    }
    this.duration += this.VAR[item.name].duration;
};

/******** compile tags - end ******/


function compile(musexpr){
    return (new Note(0, musexpr)).notes;
}







/*
# comments
e4-100 b3-200 d2-50 f1-100 g5-45 f2-56 rest-20
e4:100 b3:200 d2:50 f1:100 g5:45 f2:56 rest:20

seq1 = b3-200 d2-50
b2-100 seq1
d2-90 seq1 [g6-20 h1-40 b2-100, seq1 g5-30]




@300 e3-100 
*/

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
console.log(compile(melody_mus));