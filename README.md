# turing2d
A 2D Turing Machine

## Operation
The machine operates on a 2D tape of numbers.

Each rule is in the format:

```
[current state] [current symbol] [new symbol] [direction] [new state]
```

Direction may be any of 'r', 'l', 'u', or 'd'. The state and symbol are both
strings. The initial state of the machine is '0'.

Rule selection is accomplished by selecting the first rule which matches all the
criteria.

A special intrinsic rule with the name `halt` will cause the machine to stop
execution. This rule does not need to be defined to be used.