
declare module 'Vector2';

declare class Vector2 {
    x: number;
    y: number;
    constructor(a: number | number[] | Vector2, b: number);
    add(v: Vector2): Vector2;
    sub(v: Vector2): Vector2;
    neg(): Vector2;
    scale(s: number): Vector2;
    prod(v: Vector2): Vector2;
    dot(v: Vector2): number;
    cross(v: Vector2): number;
    perp(): Vector2;
    projectTo(b: Vector2): Vector2;
    rejectFrom(b: Vector2): Vector2;
    reflect(b: Vector2): Vector2;
    refract(normal: Vector2, eta: number): Vector2;
    angle(): number;
    norm(): number;
    norm2(): number;
    normalize(): Vector2;
    distance(v: Vector2): number;
    set(v: Vector2): void;
    rotate(angle: number): Vector2;
    apply(fn: Function, v?: {
        x: number;
        y: number;
    }): Vector2;
    toArray(): number[];
    clone(): Vector2;
    equals(vector: Vector2): boolean;
    isParallel(vector: Vector2): boolean;
    isUnit(): boolean;
    lerp(v: Vector2, t: number): Vector2;
    toString(): string;
    static random(): Vector2;
    static fromPoints(a: Vector2, b: Vector2): Vector2;
    static fromBarycentric(A: Vector2, B: Vector2, C: Vector2, u: number, v: number): Vector2;
}

export { Vector2 as default, Vector2 };
