
const { expect } = require('chai');

const Vector2 = require('@rawify/vector2');

const EPS = 1e-12;
const close = (a, b, eps = EPS) => Math.abs(a - b) <= eps;
const expectVec = (v, x, y, eps = EPS) => {
  expect(close(v.x, x, eps)).to.equal(true, `x ~ ${x}, got ${v.x}`);
  expect(close(v.y, y, eps)).to.equal(true, `y ~ ${y}, got ${v.y}`);
};

describe('Vector2', () => {

  it('constructs with no args as (0, 0)', () => {
    const v = new Vector2();
    expectVec(v, 0, 0);
  });

  it('constructs from numbers', () => {
    const v = new Vector2(1, 2);
    expectVec(v, 1, 2);
  });

  it('constructs from array', () => {
    const v = new Vector2([3, 4]);
    expectVec(v, 3, 4);
  });

  it('constructs from object', () => {
    const v = new Vector2({ x: 5, y: 6 });
    expectVec(v, 5, 6);
  });

  it('add/sub/neg/scale/prod', () => {
    const a = new Vector2(1, 2);
    const b = new Vector2(3, 4);
    expectVec(a.add(b), 4, 6);
    expectVec(a.sub(b), -2, -2);
    expectVec(a.neg(), -1, -2);
    expectVec(a.scale(2.5), 2.5, 5);
    expectVec(a.prod(b), 3, 8);
  });

  it('dot/cross/perp', () => {
    const a = new Vector2(1, 2);
    const b = new Vector2(3, 4);
    expect(a.dot(b)).to.equal(11);
    expect(a.cross(b)).to.equal(-2);
    expectVec(a.perp(), -2, 1);
  });

  it('projectTo / rejectFrom / reflect', () => {
    const a = new Vector2(3, 4);
    const bx = new Vector2(2, 0); // x-axis scaled
    // proj_a_on_bx = (dot/|b|^2)*b => (6/4)*[2,0] = [3,0]
    expectVec(a.projectTo(bx), 3, 0);
    // rejection is a - projection = [0,4]
    expectVec(a.rejectFrom(bx), 0, 4);
    // reflection = 2*proj - a = [3,-4]
    expectVec(a.reflect(bx), 3, -4);
  });

  it('refract: basic + total internal reflection', () => {
    // Straight-through case (eta = 1) should return the same direction
    const v = new Vector2(0, -1);
    const n = new Vector2(0, 1);
    const r = v.refract(n, 1);
    expect(r).to.not.equal(null);
    expectVec(r, 0, -1);

    // TIR case: choose eta > 1 and grazing incidence so k < 0
    const v2 = new Vector2(1, 0); // tangent to normal
    const r2 = v2.refract(n, 2);
    expect(r2).to.equal(null);
  });

  it('angle/norm/norm2/distance', () => {
    const a = new Vector2(0, 1);
    expect(close(a.angle(), Math.PI / 2)).to.equal(true);

    const b = new Vector2(3, 4);
    expect(close(b.norm(), 5)).to.equal(true);
    expect(b.norm2()).to.equal(25);

    const o = new Vector2(0, 0);
    expect(close(b.distance(o), 5)).to.equal(true);
  });

  it('normalize returns same object for unit or zero; scales others', () => {
    const u = new Vector2(1, 0);
    const u2 = u.normalize();
    expect(u2).to.equal(u);
    expectVec(u2, 1, 0);

    const z = new Vector2(0, 0);
    expect(z.normalize()).to.equal(z);

    const v = new Vector2(3, 4);
    const vn = v.normalize();
    expect(close(vn.norm(), 1)).to.equal(true);
    expectVec(vn, 0.6, 0.8, 1e-12);
  });

  it('set mutates', () => {
    const v = new Vector2(1, 2);
    v.set({ x: 7, y: 8 });
    expectVec(v, 7, 8);
  });

  it('rotate by 90°', () => {
    const v = new Vector2(1, 0);
    const r = v.rotate(Math.PI / 2);
    expect(close(r.x, 0, 1e-12)).to.equal(true);
    expect(close(r.y, 1, 1e-12)).to.equal(true);
  });

  it('apply with Math.max / clamp-like fn', () => {
    const v = new Vector2(1, 1);
    const w = new Vector2(0, 2);
    const r1 = v.apply(Math.max, w); // (1,2)
    expectVec(r1, 1, 2);

    const clamp = (x, y) => Math.min(1.0, Math.max(0.0, x)); // ignores y
    const r2 = new Vector2(2, -3).apply(clamp);
    expectVec(r2, 1, 0);
  });

  it('toArray / clone / equals', () => {
    const v = new Vector2(1.000000000001, 2);
    const arr = v.toArray();
    expect(arr).to.deep.equal([1.000000000001, 2]);

    const c = v.clone();
    expect(c).to.not.equal(v);
    expect(v.equals(c)).to.equal(true);
    expect(new Vector2(1, 2.0000001).equals(v)).to.equal(false);
  });

  it('equals uses EPS tolerance (nearly equal)', () => {
    const a = new Vector2(3, 4 + 1e-14);  // < our EPS 1e-13
    const b = new Vector2(3, 4);
    expect(a.equals(b)).to.equal(true);
    const c = new Vector2(3, 4 + 1e-10);  // clearly not equal
    expect(a.equals(c)).to.equal(false);
  });

  it('perp is orthogonal and cross(a, perp(a)) = |a|^2', () => {
    const a = new Vector2(3, 4);
    const p = a.perp();
    expect(close(a.dot(p), 0)).to.equal(true);
    // cross(a, perp(a)) = ax*ax + ay*ay
    expect(close(a.cross(p), a.norm2())).to.equal(true);
  });

  it('projectTo + rejectFrom reconstruct the original vector', () => {
    const a = new Vector2(3, 4);
    const b = new Vector2(2, 1);
    const proj = a.projectTo(b);
    const rej = a.rejectFrom(b);
    const sum = proj.add(rej);
    expect(a.equals(sum)).to.equal(true);
  });

  it('reflect twice across the same axis yields identity', () => {
    const a = new Vector2(5, -2);
    const axis = new Vector2(2, 3); // not necessarily unit
    const r1 = a.reflect(axis);
    const r2 = r1.reflect(axis);
    expect(a.equals(r2)).to.equal(true);
  });

  it('rotate preserves length and advances angle', () => {
    const a = new Vector2(3, 4);           // |a| = 5
    const ang = Math.PI / 6;               // 30 degrees
    const r = a.rotate(ang);
    expect(close(r.norm(), a.norm())).to.equal(true);  // length preserved
    const expectedAngle = a.angle() + ang;
    // Bring into (-pi, pi] for comparison
    const wrap = x => Math.atan2(Math.sin(x), Math.cos(x));
    expect(close(wrap(r.angle()), wrap(expectedAngle), 1e-12)).to.equal(true);
  });

  it('refract (when not TIR) returns a unit vector', () => {
    // incidence at 45°, air->glass (eta < 1)
    const a = new Vector2(Math.SQRT1_2, -Math.SQRT1_2); // unit
    const n = new Vector2(0, 1);                        // unit normal
    const eta = 1.0 / 1.5;
    const t = a.refract(n, eta);
    expect(t).to.not.equal(null);
    expect(close(t.norm(), 1, 1e-12)).to.equal(true);
  });

  it('lerp endpoints and extrapolation', () => {
    const A = new Vector2(1, 2);
    const B = new Vector2(5, 6);
    expectVec(A.lerp(B, 0), 1, 2);     // t=0 -> A
    expectVec(A.lerp(B, 1), 5, 6);     // t=1 -> B
    expectVec(A.lerp(B, 2), 9, 10);    // extrapolation
  });

  it('apply default second arg behaves like applying fn against (0,0)', () => {
    const v = new Vector2(-1.2, 3.4);
    const r = v.apply(Math.max); // compare vs (0,0)
    expectVec(r, Math.max(-1.2, 0), Math.max(3.4, 0));
  });

  it('immutable ops do not mutate receiver', () => {
    const a = new Vector2(1, 2);
    const b = new Vector2(3, 4);
    const aJSON = JSON.stringify(a);
    const _ = a.add(b).sub(b).scale(2).prod(new Vector2(1, 1)).neg(); // chain some
    expect(JSON.parse(aJSON)).to.deep.equal({ x: 1, y: 2 });
  });

  it('normalize returns same object for unit or zero; scales others to unit', () => {
    const u = new Vector2(0, 1);
    expect(u.normalize()).to.equal(u);

    const z = new Vector2(0, 0);
    expect(z.normalize()).to.equal(z);

    const v = new Vector2(3, 4);
    const vn = v.normalize();
    expect(close(vn.norm(), 1, 1e-12)).to.equal(true);
  });

  it('toString contains coordinates', () => {
    const s = new Vector2(9, -7).toString();
    expect(s).to.be.a('string');
    expect(s).to.match(/\(9, -7\)/);
  });

  it('isParallel / isUnit', () => {
    const a = new Vector2(1, 1);
    const b = new Vector2(2, 2);
    expect(a.isParallel(b)).to.equal(true);
    expect(new Vector2(1, 0).isUnit()).to.equal(true);
    expect(new Vector2(2, 0).isUnit()).to.equal(false);
  });

  it('lerp', () => {
    const a = new Vector2(0, 0);
    const b = new Vector2(10, 10);
    const r = a.lerp(b, 0.25);
    expectVec(r, 2.5, 2.5);
  });

  it('toString', () => {
    const s = new Vector2(3, 4).toString();
    expect(s).to.be.a('string');
    expect(s).to.contain('3');
    expect(s).to.contain('4');
  });

  it('static: random / fromPoints / fromBarycentric', () => {
    const r = Vector2.random();
    expect(r.x).to.be.at.least(0); expect(r.x).to.be.below(1);
    expect(r.y).to.be.at.least(0); expect(r.y).to.be.below(1);

    const a = new Vector2(1, 1), b = new Vector2(4, 5);
    const d = Vector2.fromPoints(a, b);
    expectVec(d, 3, 4);

    const A = new Vector2(0, 0), B = new Vector2(2, 0), C = new Vector2(0, 2);
    const P = Vector2.fromBarycentric(A, B, C, 0.25, 0.25);
    expectVec(P, 0.5, 0.5);
  });

  describe('in-place ops', () => {

    it('add$/sub$/neg$/scale$/prod$/normalize$/rotate$', () => {

      const v = new Vector2(1, 2);
      const w = new Vector2(3, 5);
      expect(v.add$(w)).to.equal(v); expectVec(v, 4, 7);
      expect(v.sub$(w)).to.equal(v); expectVec(v, 1, 2);
      expect(v.neg$()).to.equal(v); expectVec(v, -1, -2);
      expect(v.scale$(2)).to.equal(v); expectVec(v, -2, -4);
      expect(v.prod$(new Vector2(2, -0.5))).to.equal(v); expectVec(v, -4, 2);
      expect(v.normalize$()).to.equal(v); expect(close(v.norm(), 1)).to.equal(true);
    });
  });
});
