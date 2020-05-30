﻿/* globals jest: false */
/* globals describe: false */
/* globals test: false */
/* globals expect: false */

describe('Testing Jest', function () {
  test('_protoTypeOf', function () {
    var typeObjs = [
      { type: 'undefined', val: undefined },
      { type: 'null', val: null },
      { type: 'Boolean', val: true },
      { type: 'Boolean', val: false },
      { type: 'Number', val: NaN },
      { type: 'Number', val: Infinity },
      { type: 'Number', val: 0 },
      { type: 'Number', val: 27 },
      { type: 'Number', val: 3.17 },
      { type: 'Number', val: -1 },
      { type: 'String', val: '0' },
      { type: 'String', val: '' },
      { type: 'String', val: ' ' },
      { type: 'String', val: 'Hello world!' },
      { type: 'String', val: 'こんにちは！' },
      { type: 'Array', val: [] },
      { type: 'Array', val: [1, 2, 3] },
      { type: 'Object', val: (function () { return arguments; })() },
      { type: 'Object', val: {} },
      { type: 'Object', val: { a: 'A', b: 'B' } },
      { type: 'Function', val: function () { return; } },
      { type: 'Error', val: new Error() },
      { type: 'Date', val: new Date() },
      { type: 'RegExp', val: new RegExp('') }
    ];

    for (var i = 0, len = typeObjs.length; i < len; i++) {
      expect(jest._protoTypeOf(typeObjs[i].val)).toBe(typeObjs[i].type);
    }
  });

  // expect

  test('toBe', function () {
    var arr1 = [1];
    var arr2 = [1];
    var arr3 = arr2;

    var obj1 = { a: 'A' };
    var obj2 = { a: 'A' };
    var obj3 = obj2;

    var answers = [
      { valA: undefined, valB: undefined, result: true },
      { valA: undefined, valB: '', result: false },
      { valA: undefined, valB: null, result: false },
      { valA: null, valB: null, result: true },
      { valA: null, valB: '', result: false },
      // Boolean
      { valA: true, valB: true, result: true },
      { valA: true, valB: false, result: false },
      { valA: false, valB: false, result: true },
      // Number
      { valA: 10, valB: 10, result: true },
      { valA: 10, valB: 10.0, result: true },
      { valA: 10, valB: 10.1, result: false },
      { valA: 10, valB: '10', result: false },
      // String
      { valA: '', valB: '', result: true },
      { valA: 'I am Jest.', valB: 'I am Jest.', result: true },
      { valA: 'I am Jest.', valB: 'I AM JEST.', result: false },
      { valA: 'I am Jest.', valB: 'Jest', result: false },
      // Array
      { valA: [], valB: [], result: false },
      { valA: [], valB: null, result: false },
      { valA: [], valB: undefined, result: false },
      { valA: [1], valB: [1], result: false },
      { valA: [1], valB: arr1, result: false },
      { valA: arr1, valB: arr1, result: true },
      { valA: arr1, valB: arr2, result: false },
      { valA: arr2, valB: arr3, result: true },
      // Object
      { valA: {}, valB: {}, result: false },
      { valA: {}, valB: null, result: false },
      { valA: {}, valB: undefined, result: false },
      { valA: { a: 'A' }, valB: { a: 'A' }, result: false },
      { valA: { a: 'A' }, valB: obj1, result: false },
      { valA: obj1, valB: obj1, result: true },
      { valA: obj1, valB: obj2, result: false },
      { valA: obj2, valB: obj3, result: true }
    ];

    for (var i = 0, len = answers.length; i < len; i++) {
      if (answers[i].result) {
        expect(answers[i].valA).toBe(answers[i].valB);
      } else {
        expect(answers[i].valA).not.toBe(answers[i].valB);
      }
    }
  });

  test('toBeUndefined', function () {
    var answers = [
      { val: undefined, result: true },
      { val: null, result: false },
      { val: NaN, result: false },
      { val: Infinity, result: false },
      // Boolean
      { val: true, result: false },
      { val: false, result: false },
      // Number
      { val: 0, result: false },
      { val: 27, result: false },
      { val: 3.17, result: false },
      { val: -1, result: false },
      // String
      { val: '0', result: false },
      { val: '', result: false },
      { val: ' ', result: false },
      { val: 'Hello world!', result: false },
      { val: 'こんにちは！', result: false },
      // Array
      { val: [], result: false },
      { val: [1, 2, 3], result: false },
      // Object
      { val: {}, result: false },
      { val: { a: 'A', b: 'B', result: false } },
      { val: function () { return; }, result: false },
      { val: new Error(), result: false },
      { val: new Date(), result: false },
      { val: new RegExp(''), result: false }
    ];

    for (var i = 0, len = answers.length; i < len; i++) {
      if (answers[i].result) {
        expect(answers[i].val).toBeUndefined();
      } else {
        expect(answers[i].val).toBeDefined();
      }
    }
  });

  test('toContain', function () {
    var item2 = [2];
    var answers = [
      { collection: undefined, target: undefined, result: 'Error' },
      { collection: null, target: null, result: 'Error' },
      // Boolean
      { collection: true, target: true, result: false },
      { collection: false, target: false, result: false },
      // Number
      { collection: 10, target: 10, result: false },
      { collection: 10, target: 0, result: false },
      // String
      { collection: '', target: '', result: true },
      { collection: 'I am Jest.', target: 'I am Jest.', result: true },
      { collection: 'I am Jest.', target: 'Jest', result: true },
      { collection: 'I am Jest.', target: 'jest', result: false },
      // Array
      { collection: [], target: null, result: false },
      { collection: [], target: undefined, result: false },
      { collection: [1, 2, 3], target: 2, result: true },
      { collection: [1, 2, 3], target: 0, result: false },
      { collection: [1, [2], 3], target: 2, result: false },
      { collection: [1, [2], 3], target: [2], result: false },
      { collection: [1, item2, 3], target: item2, result: true },
      { collection: ['foo', 'bar', 'baz'], target: 'bar', result: true },
      { collection: ['foo', 'bar', 'baz'], target: 'ba', result: false },
      { collection: ['foo', 'bar', 'baz'], target: 'BAR', result: false },
      { collection: ['foo', ['bar'], 'baz'], target: 'bar', result: false },
      { collection: ['foo', ['bar'], 'baz'], target: 'bar', result: false },
      { collection: ['A', { b: 'B' }], target: { b: 'B' }, result: false },
      // Object
      // Returns `false` when `collection` is `Object`
      { collection: { a: 'A' }, target: 'a', result: false },
      { collection: { a: 'A' }, target: 'A', result: false },
      { collection: { a: 'A' }, target: { a: 'A' }, result: false }
    ];

    for (var i = 0, len = answers.length; i < len; i++) {
      if (answers[i].result === 'Error') {
        expect(answers[i].collection).toThrowError();
      } else if (answers[i].result) {
        expect(answers[i].collection).toContain(answers[i].target);
      } else {
        expect(answers[i].collection).not.toContain(answers[i].target);
      }
    }
  });

  test('toContainEqual', function () {
    var item2 = [2];
    var answers = [
      { collection: undefined, target: undefined, result: 'Error' },
      { collection: null, target: null, result: 'Error' },
      // Boolean
      { collection: true, target: true, result: false },
      { collection: false, target: false, result: false },
      // Number
      { collection: 10, target: 10, result: false },
      { collection: 10, target: 0, result: false },
      // String
      // Returns `false` when `collection` is `String`. Differ from toContain
      { collection: '', target: '', result: false },
      { collection: 'I am Jest.', target: 'Jest', result: false },
      { collection: 'I am Jest.', target: 'I am Jest.', result: false },
      // Array
      { collection: [], target: null, result: false },
      { collection: [], target: undefined, result: false },
      { collection: [1], target: [1], result: false },
      { collection: [1, 2, 3], target: 2, result: true },
      { collection: [1, 2, 3], target: 0, result: false },
      { collection: [1, [2], 3], target: 2, result: false },
      { collection: [1, [2], 3], target: [2], result: true }, // Diff from toContain
      { collection: [1, item2, 3], target: item2, result: true },
      { collection: ['foo', 'bar', 'baz'], target: 'bar', result: true },
      { collection: ['foo', 'bar', 'baz'], target: 'ba', result: false },
      { collection: ['foo', 'bar', 'baz'], target: 'BAR', result: false },
      { collection: ['foo', ['bar'], 'baz'], target: 'bar', result: false },
      { collection: ['A', { b: 'B' }], target: { b: 'B' }, result: true }, // Diff from toContain
      // Object
      // Returns `false` when `collection` is `Object`
      { collection: { a: 'A' }, target: 'a', result: false },
      { collection: { a: 'A' }, target: 'A', result: false },
      { collection: { a: 'A' }, target: { a: 'A' }, result: false }
    ];

    for (var i = 0, len = answers.length; i < len; i++) {
      if (answers[i].result === 'Error') {
        expect(answers[i].collection).toThrowError();
      } else if (answers[i].result) {
        expect(answers[i].collection).toContainEqual(answers[i].target);
      } else {
        expect(answers[i].collection).not.toContainEqual(answers[i].target);
      }
    }
  });

  test('toEqual', function () {
    var item2 = [2];
    var answers = [
      { valA: undefined, valB: undefined, result: true },
      { valA: undefined, valB: '', result: false },
      { valA: undefined, valB: null, result: false },
      { valA: null, valB: null, result: true },
      // Boolean
      { valA: true, valB: true, result: true },
      { valA: true, valB: false, result: false },
      { valA: false, valB: false, result: true },
      // Number
      { valA: 10, valB: 10, result: true },
      { valA: 10, valB: 0, result: false },
      // String
      { valA: '', valB: '', result: true },
      { valA: 'I am Jest.', valB: 'I am Jest.', result: true },
      { valA: 'I am Jest.', valB: 'Jest', result: false },
      // Array
      { valA: [], valB: [], result: true },
      { valA: [], valB: null, result: false },
      { valA: [], valB: undefined, result: false },
      { valA: [1, 2, 3], valB: [1, 2, 3], result: true },
      { valA: [1, 2, 3], valB: [1, 2, 3, 4], result: false },
      { valA: [1, NaN], valB: [1, NaN], result: true },
      { valA: [1, Infinity], valB: [1, Infinity], result: true },
      { valA: [1, 2, 3], valB: 1, result: false },
      { valA: [1, [2], 3], valB: [1, [2], 3], result: true },
      { valA: [1, [2], 3], valB: [1, 2, 3], result: false },
      { valA: [1, item2, 3], valB: [1, item2, 3], result: true },
      { valA: ['foo', 'bar'], valB: ['foo', 'bar'], result: true },
      { valA: ['foo', 'bar'], valB: ['foo', 'BAR'], result: false },
      { valA: ['foo', 'bar'], valB: ['foo', 'bar', 'baz'], result: false },
      { valA: ['foo', ['bar']], valB: ['foo', ['bar']], result: true },
      { valA: ['A', { b: 'B' }], valB: { b: 'B' }, result: false },
      { valA: ['A', { b: 'B' }], valB: ['A', { b: 'B' }], result: true },
      // Object
      { valA: { a: 'A' }, valB: 'a', result: false },
      { valA: { a: 'A' }, valB: 'A', result: false },
      { valA: { a: 'A' }, valB: { a: 'A' }, result: true },
      { valA: { a1: { a2: 'A2' } }, valB: { a1: { a2: 'A2' } }, result: true },
      { valA: { a1: [1, 2, 3] }, valB: { a1: [1, 2, 3] }, result: true }
    ];

    for (var i = 0, len = answers.length; i < len; i++) {
      if (answers[i].result) {
        expect(answers[i].valA).toEqual(answers[i].valB);
      } else {
        expect(answers[i].valA).not.toEqual(answers[i].valB);
      }
    }
  });

  test('anything', function () {
    var item2 = [2];
    var answers = [
      { valA: undefined, valB: expect.anything(), result: false },
      { valA: null, valB: expect.anything(), result: false },
      { valA: 10, valB: expect.anything(), result: true },
      { valA: true, valB: expect.anything(), result: true },
      { valA: false, valB: expect.anything(), result: true },
      { valA: 'I am Jest.', valB: expect.anything(), result: true },
      { valA: [1, 2, 3], valB: expect.anything(), result: true },
      { valA: [1, 2, new Date()], valB: [1, 2, expect.anything()], result: true },
      { valA: [1, 2, new Date()], valB: [1, expect.anything()], result: false },
      { valA: { a: 'A', b: 'B' }, valB: expect.anything(), result: true },
      {
        valA: { a: 'A', d: new Date() },
        valB: { a: 'A', d: expect.anything() },
        result: true
      }
    ];

    // @TODO Add toContain, toContainEqual

    for (var i = 0, len = answers.length; i < len; i++) {
      if (answers[i].result) {
        expect(answers[i].valA).toEqual(answers[i].valB);
      } else {
        expect(answers[i].valA).not.toEqual(answers[i].valB);
      }
    }
  });
});
