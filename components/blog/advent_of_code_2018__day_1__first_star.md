---
title: "Advent of Code 2018: Day 1, First Star"
date: 1543781335025
---
# Advent of Code 2018 - Day 1, First Star

The [first day's](https://adventofcode.com/2018/day/1) first star is pretty simple, it can be effectively written as a one liner and we will be dissecting the solution for the rest of this article. As a brief written description:

* Open the input file (in text mode).
* Split the contents of the file on newlines into a sequence of strings.
  * This is possible because text files are inherently iterable as a stream of characters.
* Map an integer parse function over that sequence of strings, resulting in a sequence of integers.
  * This is probably the most complicated expression call because it will usually take a lambda.
* Sum the sequence of integers.
* Print the results.

## Expressions and Method Chaining

A common pattern in programming is chaining methods, effectively passing the result of an expression as an argument to another expression. Where each expression does some small transformation for the next expression. This challenge is an excellent example for demonstrating this idea. Let's first consider how this might be represented classically (and perhaps naively):

```
;;;; In a lisp style:
(print (sum (map (split (open "input" :text) "\n") fn:(parse Int64 arg:0))))

;;;; In a non-object oriented style (python-esque)
print(sum(map(split(open("input", text=True), '\n'), s => parse(Int64, s))))
```

This could be rewritten as a sequence of statements (rather than a single large statement expression). This is often easier to read, and offers us an opportunity to name (and type; and even comment more easily on) the variables of each step.

```
;;;; In a strictly imperative method (javascript-esque)
{
    ; We are also using semicolons here to also mean end of statement, as is common in C descendant languages
    var file = open("input", :text);
    var lines = split(file, '\n');
    ; Also note that we referenced the parse function off an object here.
    var numbers = map(lines, s => Int64.parse(s));
    var result = sum(numbers);
    
    print(sum);
}

;;;; In a lisp style using let we can achieve something similar
(let
  ((file (open "input" :text))
   (lines (split file '\n'))
   (numbers (map lines fn:(parse Int64 arg:0)))
   (result (sum numbers)))
  (print result))
```

However this may be *too* tedious and verbose. Especially due to having to repeat the variable name twice, which while useful for knowing what is happening, is perhaps a bit too much. We would prefer something in the middle of these two extremes.

### Aside: Same Number of Parenthesis

A common complaint of lisp like languages are that there are too many parenthesis. However I will argue that there are usually the Same Number Of Parenthesis (SNOP) regardless of the syntax used (the acronym reminds me of both scoff and snob, as a way to describe how I often reply to such complaints). Parenthesis relate back to the (ideally) context-free parsers used to read the syntaxes of most programming languages, and hence they can't really be avoided in a deterministic programming language of any real expressive capability.

For example the two expression examples have an exactly equal number of parenthesis. The statement example requires some squinting, but if you consider each `=;` as being an implicit sort of parenthesis (and of course the `{}` mapping to `()`) you'll find only one extra parenthesis around the binding section of the `let`. This is an artifact of the classic let syntax and is why Cult avoids using the classic `let` syntax, opting instead for a more general block semantic (`do`) - that allows local variables - similar to most imperative style languages.

In general I leave it up to the reader to find the mapping, though I will try to note interesting cases like the `let` syntax here.

### Extension Methods Provide a Solution

If we look at object oriented languages we see they allow for a style of chaining methods on objects, effectively using the method dispatch syntax to better arrange the expressions. This technique allows the best of both worlds in some ways, an easier way to read what is happening while not introducing a bunch of extra variables.

```
; In an object oriented (OO) style (C#-esque)
open("input", text: true)
    .split('\n')
    .map(Int64.parse)
    .sum()
    ; Print would likely not be a chained method in an OO language
    .print();
```

This is much more readable while still being concise, it's perhaps the most ideal way to write express this concept. It's often used to build so called "Fluent Interfaces" in part because it allows the programmer to chain the next expression very quickly (even if they are unfamiliar with the interface) through the use of auto-complete features.

However there is a problem with style, functions are no longer free: due to the use of the method dispatch mechanisms they must be tied to the object they are to be called on. This is especially egregious when we consider generic objects (for example our list of integers and the sum method; the list type would have to be aware that `sum` is a valid method for lists of ints and not lists of strings). The solution chosen by some language (like C#) are so called extension methods, static (not dispatched) methods which can be defined as methods on already defined classes.

We do not have this problem because multi-methods provide this behavior naturally as a consequence of being externally defined (and we even get dispatch!). Our problem is one of syntax, what we want is a way to provide is a way to write something like the above without leaning on the method dispatch syntax.

### Macros

One of the most powerful features of a lisp is it's ability to use macros to create new syntax. Which is exactly the solution to take here. We will use the so called "thread" macro to automatically splice (e.g. thread) the expressions together for us.

```
(->
  (open "input" :text)
  (split "\n")
  (map fn:(parse Int64 arg:0))
  (sum)
  (print)
)
```

This is now very similar to the object oriented method chaining style above, except that each function referenced above is actually a free function (well a multi-method anyway) that is simply being passed a different first argument. This means we can chain any method this way, not just single dispatch methods, or extension methods. By carefully designing our multi-methods to put the most dispatch-able argument first we tend to end up allowing most multi-methods to be chained effectively.

On a SNOP note: The `(->)` parenthesis are equivalent to the `....;` syntax and hence the macro is technically only equivalent when used for 4 or more functions.

### Aside: Referencing Methods

Earlier we referenced a parse function directly - e.g. `map(Int64.parse)` - rather than going through a lambda - e.g. `map(s => parse(Int64, s))`. This is a more concise way to reference functions that already have the correct signature (at least conceptually) in many languages, specifically those that allow accessing methods through type objects of some kind. This conciseness also relies on the same concepts that allow `->` to be a viable macro: 'often single dispatch is enough'.

This part of Cult is still being developed as of this writing. But the following demonstrates two interesting cases:

```
(->
  (open "input" :text)
  (split "\n")
  ; (1) Lookup the parse method on a type
  (map Int64.parse)
  (sum)
  ; (2) Lookup the print function on a specific object
  (.print)
)
```

Both of these involve the `.` operator, which is a very flexible piece of syntax in cult, while still being pretty simple. Effectively the `.` operator allows for "dynamic" lookup of symbols, "dynamic" is in quotes here because this lookup can happen during ahead of time compilation and should hopefully be elided entirely in most cases. The "dynamic" lookup means that a given type or object can provide arbitrary rules for the resolution of the symbol.

The `.` in the map (1) is the more concise way to reference a function. In this case we are asking the type to tell us what it thinks the symbol `parse` means. The default machinery for this query will look up all the possible methods and members and (assuming there is enough information to resolve it) comeback with a partially bound multi-method (specifically with the type object passed as the first argument.

The `.` infront of the print (2) is a more interesting example. In this case we are telling Cult to preform a dispatch through the object (e.g. a single dispatch). However by default Cult objects will forward dynamic lookups like this to their implementation of the multi-method named by the symbol, which in turn will performa a full dispatch. Where this is perhaps interesting is in the case of a member variable that is dispatchable (e.g. in this case, perhaps `print` is a field on the result of the `sum` function that holds an instance of a function (likely a closure) or a callable type (often called a functor)).

### Aside: Type Objects

Now we are really on a tangent. The symbol `Int64` references an instance of the type type. This can cause some initial confusion. Specifically the default type type does not forward dynamic lookups to the instance, hence `FooType.all-methods` does not list all methods on the type `FooType` but rather the method or member `all-methods` of the type `FooType`. Also most "static" methods (those that don't require an instance, but do perform a sort of dispatch on the type) use the instances of the type type to dispatch by value (which could cause strange behavior for multi-methods trying to dispatch onto the type type and type instances, however type instance dispatch by value is the standard practice).

To work around this all of the default multi-methods that dispatch on the type type (rather than type instances by value) are located in the `syndicate.reflection` namespace.

## Conclusion

This was a discussion on the first start of advent of code. Which hopefully gave you some perspective on the design choices of the Cult language.

