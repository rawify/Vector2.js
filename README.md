# Vector2.js

[![NPM Package](https://img.shields.io/npm/v/@rawify/vector2.svg?style=flat)](https://www.npmjs.com/package/@rawify/vector2 "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Vector2.js is a lightweight 2D vector library for JavaScript that provides a set of vector operations commonly used in graphics, physics simulations, and other geometric applications.

## Features

- Basic vector operations: addition, subtraction, scaling, negation
- Geometric functions: dot product, cross product, orthogonal projection, reflection
- Utility functions: normalization, angle, distance, rotation, linear interpolation (lerp)
- Support for creating vectors from arrays or objects
- Ability to work with Hadamard products, rejection from vectors, and more

## Installation

You can install `Vector2.js` via npm:

```bash
npm install @rawify/vector2
```

Alternatively, download or clone the repository:

```bash
git clone https://github.com/rawify/Vector2.js
```

Include the `vector2.min.js` file in your project:

```html
<script src="path/to/vector2.min.js"></script>
```

Or in a Node.js project:

```javascript
const Vector2 = require('path/to/vector2');
```

or 

```javascript
import Vector2 from '@rawify/vector2';
```

## Usage

### Creating a Vector

Vectors can be created using `new Vector2` or the `Vector2` function:

```javascript
let v1 = Vector2(1, 2);
let v2 = new Vector2(3, 4);
```

You can also initialize vectors from arrays or objects:

```javascript
let v3 = new Vector2([1, 2]);
let v4 = new Vector2({ x: 3, y: 4 });
```

## Methods

### `add(v)`

Adds the vector `v` to the current vector.

```javascript
let v1 = newVector2(1, 2);
let v2 = newVector2(3, 4);
let result = v1.add(v2); // {x: 4, y: 6}
```

### `sub(v)`

Subtracts the vector `v` from the current vector.

```javascript
let result = v1.sub(v2); // {x: -2, y: -2}
```

### `neg()`

Negates the current vector (flips the direction).

```javascript
let result = v1.neg(); // {x: -1, y: -2}
```

### `scale(s)`

Scales the current vector by a scalar `s`.

```javascript
let result = v1.scale(2); // {x: 2, y: 4}
```

### `prod(v)`

Calculates the Hadamard (element-wise) product of the current vector and `v`.

```javascript
let result = v1.prod(v2); // {x: 3, y: 8}
```

### `dot(v)`

Computes the dot product between the current vector and `v`.

```javascript
let result = v1.dot(v2); // 11
```

### `cross(v)`

Calculates the 2D cross product (perpendicular dot product) between the current vector and `v`.

```javascript
let result = v1.cross(v2); // -2
```

### `perp()`

Finds a perpendicular vector to the current vector.

```javascript
let result = v1.perp(); // {x: -2, y: 1}
```

### `projectTo(v)`

Projects the current vector onto the vector `v`.

```javascript
let result = v1.projectTo(v2); // Projection of v1 onto v2
```

### `rejectFrom(v)`

Finds the rejection of the current vector from the vector `v`.

```javascript
let result = v1.rejectFrom(v2); // Rejection of v1 from v2
```

### `reflect(n)`

Reflects the current vector across the normal vector `n`.

```javascript
let n = newVector2(0, 1);
let result = v1.reflect(n); // Reflection of v1 across n
```

### `angle()`

Returns the angle of the current vector in radians relative to the x-axis.

```javascript
let result = v1.angle(); // 1.107 radians
```

### `norm()`

Returns the magnitude (Euclidean norm) of the current vector.

```javascript
let result = v1.norm(); // 2.236
```

### `norm2()`

Returns the squared magnitude (norm squared) of the current vector.

```javascript
let result = v1.norm2(); // 5
```

### `normalize()`

Returns a normalized vector (unit vector) of the current vector.

```javascript
let result = v1.normalize(); // {x: 0.447, y: 0.894}
```

### `distance(v)`

Calculates the Euclidean distance between the current vector and `v`.

```javascript
let result = v1.distance(v2); // 2.828
```

### `set(v)`

Sets the values of the current vector to match the vector `v`.

```javascript
v1.set(v2); // v1 is now {x: 3, y: 4}
```

### `rotate(angle)`

Rotates the current vector by the given `angle` (in radians).

```javascript
let result = v1.rotate(Math.PI / 4); // Rotates v1 by 45 degrees
```

### `apply(fn, v)`

Applies a function `fn` (such as `Math.abs`, `Math.min`, `Math.max`) to the components of the current vector and an optional vector `v`.

```javascript
let result = v1.apply(Math.max, v2); // Applies Math.max to the components of v1 and v2
```

### `toArray()`

Returns the current vector as an array `[x, y]`.

```javascript
let result = v1.toArray(); // [1, 2]
```

### `clone()`

Returns a clone of the current vector.

```javascript
let result = v1.clone(); // A new vector with the same x and y values as v1
```

### `equals(v)`

Checks if the current vector is equal to the vector `v`.

```javascript
let result = v1.equals(v2); // false
```

### `isParallel(v)`

Checks if the current vector is parallel zu vector `v`.

### `isUnit()`

Checks if the current vector is a normalized unit vector.

### `lerp(v, t)`

Performs a linear interpolation between the current vector and `v` by the factor `t`.

```javascript
let result = v1.lerp(v2, 0.5); // {x: 2, y: 3}
```

### `toString()``

String representation of the current vector

## Static Methods

### `Vector2.random()`

Generates a vector with random x and y values between 0 and 1.

```javascript
let randomVector = Vector2.random(); // {x: 0.67, y: 0.45}
```

### `Vector2.fromPoints(a, b)`

Creates a vector from two points `a` and `b`.

```javascript
let result = Vector2.fromPoints({x: 1, y: 1}, {x: 4, y: 5}); // {x: 3, y: 4}
```

### `Vector2.fromBarycentric(A, B, C, u, v)

Given a triangle (A, B, C) and a barycentric coordinate (u, v[, w = 1 - u - v]) calculate the cartesian coordinate in R^2.

## Coding Style

As every library I publish, Vector2.js is also built to be as small as possible after compressing it with Google Closure Compiler in advanced mode. Thus the coding style orientates a little on maxing-out the compression rate. Please make sure you keep this style if you plan to extend the library.

## Building the library

After cloning the Git repository run:

```
npm install
npm run build
```

## Run a test

Testing the source against the shipped test suite is as easy as

```
npm run test
```

## Copyright and Licensing

Copyright (c) 2025, [Robert Eisele](https://raw.org/)
Licensed under the MIT license.
