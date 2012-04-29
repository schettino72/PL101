var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }

    // Strings are variable references
    if (typeof expr === 'string') {
        return env[expr];
    }

    // Look at head of list for operation
    switch (expr[0]) {

        // math operators
    case '+':
        return evalScheem(expr[1], env) + evalScheem(expr[2], env);
    case '-':
        return evalScheem(expr[1], env) - evalScheem(expr[2], env);
    case '*':
        return evalScheem(expr[1], env) * evalScheem(expr[2], env);
    case '/':
        return evalScheem(expr[1], env) / evalScheem(expr[2], env);


        // variables
    case 'define':
    case 'set!':
        env[expr[1]] = evalScheem(expr[2], env);
        return 0;


        // list manipulation
    case 'cons':
        var list = evalScheem(expr[2], env);
        list.unshift(evalScheem(expr[1], env));
        return list;
    case 'car':
        return evalScheem(expr[1], env).shift();
    case 'cdr':
        var list = evalScheem(expr[1], env);
        list.shift();
        return list;


        // operators
    case '=':
        if (evalScheem(expr[1], env) === evalScheem(expr[2], env))
            return '#t';
        else
            return '#f';
    case '<':
        if (evalScheem(expr[1], env) < evalScheem(expr[2], env))
            return '#t';
        else
            return '#f';


        //
    case 'begin':
        var result = null;
        for(var i=1, max=expr.length; i<max; i++){
            result = evalScheem(expr[i], env);
        }
        return result;
    case 'quote':
        return expr[1];
    case 'if':
        var condition = evalScheem(expr[1], env);
        if(condition == '#t')
            return evalScheem(expr[2], env);
        else
            return evalScheem(expr[3], env);


    }

};


// If we are used as Node module, export evalScheem
if (typeof module !== 'undefined') {
    module.exports.evalScheem = evalScheem;
}

console.log('loaded');