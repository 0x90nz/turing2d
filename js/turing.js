var MOVES = {
    'r': [1, 0],
    'l': [-1, 0],
    'u': [0, -1],
    'd': [0, 1],
    '*': [0, 0]
};
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
function getCurrentSymbol(state) {
    return state.tape.length > state.pointer.y && state.tape[state.pointer.y].length > state.pointer.x
        ? state.tape[state.pointer.y][state.pointer.x] : '_';
}
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
        throw 'No rules were found for the current state';
    }
    // We just always go with the first matching rule
    var rule = matchedRules[0];
    console.log(rule);
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
            return x == state.pointer.x && y === state.pointer.y ? "<span style=\"color:red\">" + e + "</span>" : e;
        }).join('');
    }).join('<br>');
    return state.state !== 'halt';
}
/**
 * Compile a string into a machine state, comprised of a set of rules
 * @param program the given program to compile
 */
function compile(program) {
    return {
        pointer: { x: 0, y: 0 },
        state: '0',
        tape: '00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000'.split(' ').map(function (e) { return e.split(''); }),
        program: program.replace(/;.*$/m, '').split('\n').filter(function (e) { return e != ''; }).map(parseRule)
    };
}
function run() {
    var text = document.querySelector('#program');
    var state = compile(text.value);
    console.log(state.program);
    while (execute(state))
        alert('a');
}
