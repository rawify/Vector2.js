'use strict';

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

  let o = this instanceof Vector2 ? this : Object.create(Vector2.prototype);

  if (typeof x === "object") {
    if (x instanceof Array) {
      o['x'] = x[0];
      o['y'] = x[1];
    } else {
      o['x'] = x['x'];
      o['y'] = x['y'];
    }
  } else if (!isNaN(x) && !isNaN(y)) {
    o['x'] = x;
    o['y'] = y;
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

    const pct = (this['x'] * b['x'] + this['y'] * b['y']) / (b['x'] * b['x'] + b['y'] * b['y']);

    return newVector2(b['x'] * pct, b['y'] * pct);
  },
  'rejectFrom': function (b) { // Orthogonal reject this from b

    // this.reject(b) = rej_b(this) => rej_b(a) = a - dot(a, b) / dot(b, b) * b
    //                                          = dot(a, perp(b)) / dot(b, b) * perp(b)
    //                                          = cross(b, a) / dot(b, b) * perp(b)

    const pct = (this['y'] * b['x'] - this['x'] * b['y']) / (b['x'] * b['x'] + b['y'] * b['y']);

    return newVector2(-b['y'] * pct, b['x'] * pct);
  },
  'reflect': function (b) { // Reflect this across b

    // this.reflect(b) = this_reflected => a_reflected = proj_b(a) - rej_b(a)
    //                    = 2 dot(a, b) / dot(b, b) * b - a
    //                    = 2 proj_b(a) - a
    //                    = 2 dot(a, normalized(b)) * normalized(b) - a

    const pct2 = 2 * (this['y'] * b['y'] + this['x'] * b['x']) / (b['x'] * b['x'] + b['y'] * b['y']);

    return newVector2(b['x'] * pct2 - this['x'], b['y'] * pct2 - this['y']);
  },
  'angle': function () {
    return Math.atan2(this['y'], this['x']);
  },
  'norm': function () {
    return Math.sqrt(this['x'] * this['x'] + this['y'] * this['y']);
  },
  'norm2': function () {
    return this['x'] * this['x'] + this['y'] * this['y'];
  },
  'normalize': function () {
    const l = this['norm']();
    if (l === 0 || l === 1) return this;
    return newVector2(this['x'] / l, this['y'] / l);
  },
  'distance': function (v) {
    const x = this['x'] - v['x'];
    const y = this['y'] - v['y'];
    return Math.sqrt(x * x + y * y);
  },
  'set': function (v) {
    this['x'] = v['x'];
    this['y'] = v['y'];
  },
  'rotate': function (angle) {
    const C = Math.cos(angle);
    const S = Math.sin(angle);
    return newVector2(
      C * this['x'] - S * this['y'],
      S * this['x'] + C * this['y']
    );
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
    return this === v ||
      Math.abs(this['x'] - v['x']) < EPS &&
      Math.abs(this['y'] - v['y']) < EPS;
  },
  'isParallel': function (v) {
    return Math.abs(this['cross'](v)) < EPS;
  },
  'isUnit': function () {
    return Math.abs(this['x'] * this['x'] + this['y'] * this['y'] - 1) < EPS;
  },
  'lerp': function (v, t) {
    return newVector2(
      this['x'] + t * (v['x'] - this['x']),
      this['y'] + t * (v['y'] - this['y']));
  },
  "toString": function () {
    return "(" + this['x'] + ", " + this['y'] + ")";
  }
};

Vector2['random'] = function () {
  return newVector2(Math.random(), Math.random());
};

Vector2['fromPoints'] = function (a, b) {
  return newVector2(b['x'] - a['x'], b['y'] - a['y']);
};

/**
 * Given a triangle (A, B, C) and a barycentric coordinate (u, v[, w = 1 - u - v]) calculate the cartesian coordinate in R^2 
 *
 * @param {Vector2} A
 * @param {Vector2} B
 * @param {Vector2} C
 * @param {number} u
 * @param {number} v
 * @returns Vector2
 */
Vector2['fromBarycentric'] = function (A, B, C, u, v) {
  const { x, y } = A;

  return newVector2(
    x + (B['x'] - x) * u + (C['x'] - x) * v,
    y + (B['y'] - y) * u + (C['y'] - y) * v);
}

Object.defineProperty(Vector2, "__esModule", { 'value': true });
Vector2['default'] = Vector2;
Vector2['Vector2'] = Vector2;
module['exports'] = Vector2;
