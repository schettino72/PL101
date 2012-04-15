function Note(start, mus){
    this.start = start;
    this.duration = 0;
    this.notes = [];
    this._compile(mus);
}

Note.prototype._add_notes = function(mus_list){
    var max_duration = 0;
    var note = null;
    for (var i=0, max=mus_list.length; i<max; i++){
        note = new Note(this.start + this.duration, mus_list[i]);
        this.notes = this.notes.concat(note.notes);
        if (note.duration > max_duration)
            max_duration = note.duration;
    }
    this.duration += max_duration;
};

Note.prototype._compile = function(item){
    if (item.tag == 'seq') {
        this._add_notes([item.left]);
        this._add_notes([item.right]);
    }
    else if(item.tag == 'par') {
        this._add_notes([item.left, item.right]);
    }
    else if(item.tag == 'note') {
        this.notes.push({
            tag: 'note', pitch: item.pitch,
            start: this.start, dur: item.dur
        });
        this.duration += item.dur;
    }
    else if(item.tag == 'rest') {
        this.duration += item.duration;
    }
};

function compile(musexpr){
    return (new Note(0, musexpr)).notes;
}









/////////////////////////////////////////////

var melody_mus =
    { tag: 'par',
      left:
       { tag: 'seq',
         left: { tag: 'rest', duration: 30 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));