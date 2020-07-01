/**
Some example programs:

; Two's Complement
%tape="0111"%
0 * * * end

end _ * l add
end 1 0 r *
end 0 1 r *

add 0 1 * halt
add 1 0 l add

; Copy down
%tape="0111 0000"%

; Copy a digit or halt
0 0 * d c0
0 1 * d c1
0 _ * * halt

; Copy a digit and then go to up
c0 * 0 r up
c1 * 1 r up

; Go back up
up * * u 0
 */
var MOVES = {
    'r': [1, 0],
    'l': [-1, 0],
    'u': [0, -1],
    'd': [0, 1],
    '*': [0, 0]
};
/**
 * Parse a string into a rule
 * @param rule The string representation of the rule
 * @param lineNumber The line number for accounting
 */
function parseRule(rule, lineNumber) {
    var components = rule.split(' ');
    return {
        currentState: components[0],
        currentSymbol: components[1],
        newSymbol: components[2],
        direction: components[3],
        newState: components[4],
        lineNumber: lineNumber
    };
}
/**
 * Get the current symbol pointed to by the head. Return '_' if the head is out of bounds
 * @param state The state to retrieve the symbol from
 */
function getCurrentSymbol(state) {
    return state.tape.length > state.pointer.y && state.tape[state.pointer.y].length > state.pointer.x
        ? state.tape[state.pointer.y][state.pointer.x] : '_';
}
/**
 * Match two inputs with the wildcard rule applied to the first
 * @param a Input rule string
 * @param b Actual object to match
 */
function wildcardMatch(a, b) {
    return a === b || a === '*';
}
/**
 * Execute a single rule
 * @param state The current machine state
 * @returns true if machine should continue; false if it should halt
 */
function execute(state) {
    // Execute the applicable rule for the current state
    var matchedRules = state.program.filter(function (r) {
        return wildcardMatch(r.currentState, state.state) &&
            wildcardMatch(r.currentSymbol, getCurrentSymbol(state));
    });
    if (matchedRules.length < 1) {
        console.log(state);
        console.error('Could not find a rule which satisfied the machines state');
        return false;
    }
    // We just always go with the first matching rule
    var rule = matchedRules[0];
    // Only update the symbol if requested
    if (rule.newSymbol !== '*')
        state.tape[state.pointer.y][state.pointer.x] = rule.newSymbol;
    if (rule.direction !== '*') {
        state.pointer.x += MOVES[rule.direction][0];
        state.pointer.y += MOVES[rule.direction][1];
    }
    // '*' indicates no state change should occur
    if (rule.newState !== '*')
        state.state = rule.newState;
    // Format the output
    document.getElementById('tape').innerHTML = state.tape.map(function (e, y) {
        return e.map(function (e, x) {
            return x == state.pointer.x && y === state.pointer.y ? "<span style=\"background-color:red;color: white;\">" + e + "</span>" : e;
        }).join('');
    }).join('<br>');
    return state.state !== 'halt';
}
/**
 * Compile a string into a machine state, comprised of a set of rules
 * @param program the given program to compile
 */
function compile(program, initTape) {
    return {
        pointer: { x: 0, y: 0 },
        state: '0',
        tape: initTape.split(' ').map(function (e) { return e.split(''); }),
        program: program.replace(/;.*$/mg, '').split('\n').filter(function (e) { return e != ''; }).map(parseRule)
    };
}
/**
 * Execute the program until it halts
 */
function run() {
    var text = document.querySelector('#program');
    var tapeRegex = /%tape="([^"]+)"%/;
    var initTape = text.value.match(tapeRegex);
    var program = text.value.replace(tapeRegex, '');
    var tape = initTape != null ? initTape[1] : '00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000';
    var state = compile(program, tape);
    console.log(state.program);
    var t = setInterval(function () {
        if (!execute(state)) {
            clearInterval(t);
            console.log('Execution halted');
        }
    }, 100);
}
