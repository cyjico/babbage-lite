# Babbage Lite Syntax

Once again, the Analytical Engine taught by my professor was simplified for lecture and brevity which resulted in me making *Babbage Lite*. *Babbage Lite* programs contain the following:

* [Number cards](#number-cards) (`N<address> <value>`)
* [Variable cards](#variable-cards) (`L<address>`, `S<address>`)
* [Operation cards](#operation-cards) (`+`, `-`, `*`, `/`, `%`)
* [Action cards](#action-cards) (`P`, `B`, `H`)
* [Combinatorial cards](#combinatorial-cards) (`CB+<skips>`, `CF+<skips>`, `CB?<skips>`, `CF?<skips>`)

---

## Number Cards

```txt
N<address> <value>
```

Declares a constant or variable in the specified address of **store**. Value is the initial value stored.

* Allowable addresses are only from 0 to 999.
* By default, values of all addresses in store is 0.

Examples:

```txt
N000 0
N111 1
N5   8
```

---

## Variable Cards

### Load

```txt
L<address>
```

Loads the value from the specified address of store into the **mill**.

* Two loads supply the left (*first ingress* axis) and right (*second ingress* axis) operands of arithmetic operations.

Example:

```txt
L1
L2
```

### Store

```txt
S<address>
```

Stores from the egress axis (mill’s result) into the specified address of store.

Example:

```txt
S3
```

---

## Operation Cards

```txt
+   # addition
-   # subtraction
*   # multiplication
/   # division
%   # modulo
```

Sets the arithmetic operation to be performed.

Example:

```txt
+
L1  # load into the first ingress axis
L2  # load into the second ingress axis
S3  # store from egress axis into store `003`
```

---

## Action Cards

### Print

```txt
P
```

Prints the value from the egress axis (mill's result).

### Bell

```txt
B
```

Rings a bell.

### Halt

```txt
H
```

Halts the machine.

---

## Combinatorial Cards

### Unconditional Jump

```txt
CF+<skips>   # jump forward skips + 1 (from current line) cards
CB+<skips>   # jump backward skips - 1 (from current line) cards
```

Why the `+ 1`/`- 1`? To put it simply, the reader must move for a card to be read.

> At least, that's what I remember my professor telling us.

### Conditional Jump

```txt
CF?<skips>  # jump forward skips + 1 (from current line) cards if the run-up lever is set
CB?<skips>  # jump backward skips - 1 (from current line) cards if the run-up lever is set
```

*Run-up Lever* is set/unset on every arithmetic operation:

* Addition: *Run-up Lever* only when sign differs between the first ingress axis and egress axis.
* Subtraction: *Run-up Lever* sets only when sign differs between the first ingress axis and egress axis.
* Division: *Run-up Lever* sets only when the divisor is 0.
* Multiplication: *Run-up Lever* never sets.
* Modulo: *Run-up Lever* sets only when the divisor is 0.

#### Quick Mental Model

```txt
-
x
y
CF/CB+/?...
```

is **roughly equivalent** to:

* If x is **non-negative**:
  * If `x < y`, then `CF/CB+/?...`
* If x is **negative**:
  * If `x ≥ y`, then `CF/CB+/?...`

---

## Helpful Tips

### Common Patterns

#### DO-WHILE

Example:

```txt
N0 5    # counter
N1 1    # constant 1
N2 0    # constant 0

# DO { ...
-
L0
L1
S0
P
-
L2
L0
CB?9
# ... } WHILE (0 < counter)

H
```

* `N2 0` is only helpful in outlining your intentions as `002` is already 0, by default (as with all addresses).
* `0 < counter` only works as a mental model because 0 **is *non-negative***.
