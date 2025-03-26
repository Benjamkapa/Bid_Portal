# TypeScript Guide

## What is TypeScript?
TypeScript is a superset of JavaScript that adds static typing to the language. It allows developers to catch errors early through a type system and to make JavaScript development more efficient.

## Key Features of TypeScript
1. **Static Typing**: TypeScript allows you to define types for variables, function parameters, and return values, which helps catch errors at compile time.
2. **Interfaces**: You can define interfaces to describe the shape of objects, making it easier to work with complex data structures.
3. **Type Inference**: TypeScript can automatically infer types based on the assigned values, reducing the need for explicit type annotations.
4. **Generics**: TypeScript supports generics, allowing you to create reusable components and functions that work with any data type.
5. **Modules**: TypeScript supports ES6 modules, enabling better organization of code and easier imports/exports.

## Basic Types
- **Number**: Represents numeric values.
- **String**: Represents text values.
- **Boolean**: Represents true/false values.
- **Array**: Represents a collection of values of a specific type.
- **Tuple**: Represents an array with fixed number of elements of different types.
- **Enum**: A way to define a set of named constants.
- **Any**: A type that can hold any value, bypassing type checking.

## Example of TypeScript Code
```typescript
// Defining a variable with a specific type
let age: number = 25;

// Defining a function with typed parameters and return type
function greet(name: string): string {
    return `Hello, ${name}!`;
}

// Using an interface
interface User {
    id: number;
    name: string;
}

const user: User = {
    id: 1,
    name: "John Doe"
};
```

## TypeScript with React
TypeScript can be used with React to provide type safety for components and props. Here’s a simple example:

```typescript
import React from 'react';

interface Props {
    title: string;
}

const MyComponent: React.FC<Props> = ({ title }) => {
    return <h1>{title}</h1>;
};

export default MyComponent;
```

## Conclusion
TypeScript enhances JavaScript development by providing a robust type system, making code more predictable and easier to maintain. It is especially useful in large applications where type safety can prevent many common errors.

For more detailed documentation, you can visit the official TypeScript website: [TypeScript Documentation](https://www.typescriptlang.org/docs/)
