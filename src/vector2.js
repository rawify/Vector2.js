/**
 * @license Vector2 v0.0.5 8/13/2025
 * https://github.com/rawify/Vector2.js
 *
 * Copyright (c) 2025, Robert Eisele (https://raw.org/)
 * Licensed under the MIT license.
 **/

function newVector2(x, y) {
  const o = Object.create(Vector2.prototype);
  o['x'] = x;
  o['y'] = y;
  return o;
}

const EPS = 1e-13;

/**
@constructor
*/
function Vector2(x, y) {
  // Fast number path
  let o = this instanceof Vector2 ? this : Object.create(Vector2.prototype);

  if (typeof x === "number" && typeof y === "number") {
    o['x'] = x; o['y'] = y;
    return o;
  }

  if (x && typeof x === "object") {
    if (Array.isArray(x)) {
      o['x'] = x[0];
      o['y'] = x[1];
    } else {
      o['x'] = x['x'];
      o['y'] = x['y'];
    }
  }
  return o;
}

Vector2.prototype = {
  'x': 0,
  'y': 0,
  'add': function (v) {
    return newVector2(this['x'] + v['x'], this['y'] + v['y']);
  },
  'sub': function (v) {
    return newVector2(this['x'] - v['x'], this['y'] - v['y']);
  },
  'neg': function () {
    return newVector2(-this['x'], -this['y']);
  },
  'scale': function (s) {
    return newVector2(this['x'] * s, this['y'] * s);
  },
  'prod': function (v) { // Hadamard product or Schur product
    return newVector2(this['x'] * v['x'], this['y'] * v['y']);
  },
  'dot': function (v) {
    return this['x'] * v['x'] + this['y'] * v['y'];
  },
  'cross': function (v) { // Or perp-product / perpDot: this.perp().dot(v) / determinant of matrix [this, v]
    return this['x'] * v['y'] - this['y'] * v['x'];
  },
  'perp': function () { // Or skew(), or orthogonal()
    return newVector2(-this['y'], this['x']);
  },
  'projectTo': function (b) { // Orthogonal project this onto b

    // this.projectTo(b) = proj_b(this) => proj_b(a) = dot(a, b) / dot(b, b) * b

    const bx = b['x'], by = b['y'];
    const t = (this['x'] * bx + this['y'] * by) / (bx * bx + by * by);
    return newVector2(bx * t, by * t);
  },
  'rejectFrom': function (b) { // Orthogonal reject this from b

    // this.reject(b) = rej_b(this) => rej_b(a) = a - dot(a, b) / dot(b, b) * b
    //                                          = dot(a, perp(b)) / dot(b, b) * perp(b)
    //                                          = cross(b, a) / dot(b, b) * perp(b)

    const bx = b['x'], by = b['y'];
    const t = (this['x'] * bx + this['y'] * by) / (bx * bx + by * by);
    return newVector2(this['x'] - bx * t, this['y'] - by * t);
  },
  'reflect': function (b) { // Reflect this across b

    // this.reflect(b) = this_reflected => a_reflected = proj_b(a) - rej_b(a)
    //                    = 2 dot(a, b) / dot(b, b) * b - a
    //                    = 2 proj_b(a) - a
    //                    = 2 dot(a, normalized(b)) * normalized(b) - a

    const bx = b['x'], by = b['y'];
    const t2 = 2 * (this['x'] * bx + this['y'] * by) / (bx * bx + by * by);
    return newVector2(t2 * bx - this['x'], t2 * by - this['y']);
  },
  'refract': function (normal, eta) { // Refraction of unit vector across unit normal with η = η_in / η_out
    const dot = this['x'] * normal['x'] + this['y'] * normal['y'];
    const k = 1 - eta * eta * (1 - dot * dot);

    if (k < 0) return null; // total internal reflection

    const t = eta * dot + Math.sqrt(k);
    return newVector2(eta * this['x'] - t * normal['x'], eta * this['y'] - t * normal['y']);
  },
  'angle': function () {
    return Math.atan2(this['y'], this['x']);
  },
  'norm': function () {
    const ax = this['x'], ay = this['y'];
    return Math.sqrt(ax * ax + ay * ay);
  },
  'norm2': function () {
    const ax = this['x'], ay = this['y'];
    return ax * ax + ay * ay;
  },
  'normalize': function () {
    const ax = this['x'], ay = this['y'];
    const l2 = ax * ax + ay * ay;
    if (l2 === 0 || l2 === 1) return this; // return self to avoid alloc
    const inv = 1 / Math.sqrt(l2);
    return newVector2(ax * inv, ay * inv);
  },
  'distance': function (v) {
    const dx = this['x'] - v['x'], dy = this['y'] - v['y'];
    return Math.sqrt(dx * dx + dy * dy);
  },
  'set': function (v) {
    this['x'] = v['x'];
    this['y'] = v['y'];
  },
  'rotate': function (ang) {
    const c = Math.cos(ang), s = Math.sin(ang);
    const ax = this['x'], ay = this['y'];
    return newVector2(c * ax - s * ay, s * ax + c * ay);
  },
  'apply': function (fn, v = { x: 0, y: 0 }) { // Math.abs, Math.min, Math.max
    return newVector2(fn(this['x'], v['x']), fn(this['y'], v['y']));
  },
  'toArray': function () {
    return [this['x'], this['y']];
  },
  'clone': function () {
    return newVector2(this['x'], this['y']);
  },
  'equals': function (v) {
    return this === v || (
      Math.abs(this['x'] - v['x']) < EPS &&
      Math.abs(this['y'] - v['y']) < EPS);
  },
  'isParallel': function (v) {
    return Math.abs(this['cross'](v)) < EPS;
  },
  'isUnit': function () {
    return Math.abs(this['x'] * this['x'] + this['y'] * this['y'] - 1) < EPS;
  },
  'lerp': function (v, t) {
    const ax = this['x'], ay = this['y'];
    return newVector2(ax + t * (v['x'] - ax), ay + t * (v['y'] - ay));
  },
  'toString': function () {
    return "(" + this['x'] + ", " + this['y'] + ")";
  },

  // ---------- In-place ops (mutating, suffix `$`) ----------
  // Use to avoid allocations in tight loops.

  'add$': function (v) { this['x'] += v['x']; this['y'] += v['y']; return this; },
  'sub$': function (v) { this['x'] -= v['x']; this['y'] -= v['y']; return this; },
  'neg$': function () { this['x'] = -this['x']; this['y'] = -this['y']; return this; },
  'scale$': function (s) { this['x'] *= s; this['y'] *= s; return this; },
  'prod$': function (v) { this['x'] *= v['x']; this['y'] *= v['y']; return this; },
  'normalize$': function () {
    const l2 = this['x'] * this['x'] + this['y'] * this['y'];
    if (l2 === 0 || l2 === 1) return this;
    const inv = 1 / Math.sqrt(l2);
    this['x'] *= inv; this['y'] *= inv; return this;
  }
};

Vector2['random'] = function () {
  return newVector2(Math.random(), Math.random());
};

Vector2['fromPoints'] = function (a, b) {
  return newVector2(b['x'] - a['x'], b['y'] - a['y']);
};

/**
 * Given a triangle (A, B, C) and a barycentric coordinate (u, v[, w = 1 - u - v])
 * calculate the cartesian coordinate in R^2.
 */
Vector2.fromBarycentric = function (A, B, C, u, v) {
  const ax = A['x'], ay = A['y'];
  return newVector2(
    ax + (B['x'] - ax) * u + (C['x'] - ax) * v,
    ay + (B['y'] - ay) * u + (C['y'] - ay) * v);
};
