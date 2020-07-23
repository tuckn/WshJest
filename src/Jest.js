/* eslint no-unused-vars:off */

if (!jest) {
  /**
   * The wrapper object for Jest modules.
   *
   * @global
   * @type {object}
   */
  var jest = {};
}

if (!describe) var describe;
if (!test) var test;
if (!expect) var expect;

(function () {
  var ANYTHING_OBJ = { matching: 'null/undefined' };
  var _description;
  var _skippedCount;
  var _passedCount;
  var _faledCount;
  var _expectedCount;
  var _reTestName = (function () { // Set args {{{
    if (WScript.Arguments.length > 0) {
      var reTestPtn = new RegExp('^(-t|--testNamePattern)=(.+)$');
      var arg, matched;

      for (var i = 0, I = WScript.Arguments.length; i < I; i++) {
        arg = String(WScript.Arguments(i));

        if (reTestPtn.test(arg)) {
          matched = arg.match(reTestPtn);
          return new RegExp(matched[2]);
        } else if (arg === '-t' || arg === '--testNamePattern') {
          return new RegExp(String(WScript.Arguments(i + 1)));
        }
      }
    }
  })(); // }}}

  jest._protoTypeOf = function (val) { // {{{
    if (val === undefined) return 'undefined';
    if (val === null) return 'null';
    return Object.prototype.toString.call(val).slice(8, -1);
  };
  var _protoTypeOf = jest._protoTypeOf; // Shorthand
  // }}}

  jest._toDir = function (val, indent) { // {{{
    indent = indent || '';
    var newIndent = '  ' + indent;
    var type = _protoTypeOf(val);
    var r = '';
    var i, I, p;

    if (type === 'undefined' || type === 'null') {
      r = type;
    } else if (val === true) {
      r = 'true';
    } else if (val === false) {
      r = 'false';
    } else if (val === Infinity) {
      r = 'Infinity';
    } else if (typeof(val) === 'unknown') { /* eslint valid-typeof: "off" */
      r = val;
    } else if (type === 'String') {
      r = '"' + val + '"';
    } else if (type === 'Number') {
      r = isNaN(val) ? 'NaN' : String(val);
    } else if (type === 'Object') {
      r = '{\n';

      for (p in Object(val)) {
        r += newIndent + p + ': ' + _toDir(val[p], newIndent) + ',\n';
      }

      r = r.replace(/,\n$/, '\n');
      r += indent + '}';
    } else if (type === 'Array') {
      r = '[\n';

      for (i = 0, I = val.length; i < I; i++) {
        r += newIndent + i + ': ' + _toDir(val[i], newIndent) + ',\n';
      }

      r = r.replace(/,\n$/, '\n');
      r += indent + ']';

    // ErrortoString() displays only "[object Error]"
    } else if (type === 'Error') {
      r = (!val.name ? 'Error' : String(val.name)) + ': ';

      /**
       * @todo Convert to HEX? e.g. -2146825284 -> FFFFFFFF800A0BBC -> 800A0BBC
       */
      r += '[' + (!val.number ? '' : String(val.number)) + '] ';
      r += !val.message ? '' : val.message;
    } else {
      // @todo for Buffer
      r = String(val);
    }

    return r;
  };
  var _toDir = jest._toDir;
  // }}}

  jest._contains = function (collection, target) { // {{{
    var typeObjA = _protoTypeOf(collection); // caching

    if (target === ANYTHING_OBJ
        && collection !== undefined && collection !== null) {
      return true;
    } else if (typeObjA === 'String') {
      return (collection.indexOf(target) !== -1);
    } else if (typeObjA === 'Array') {
      for (var i = 0, len = collection.length; i < len; i++) {
        if (target === ANYTHING_OBJ
            && collection[i] !== undefined && collection[i] !== null) {
          return true;
        } else if (collection[i] === target) {
          return true;
        }
      }
    }

    return false;
  }; // }}}

  jest._containsEqual = function (collection, target) { // {{{
    var val;

    if (_protoTypeOf(collection) === 'Array') {
      for (var i = 0, len = collection.length; i < len; i++) {
        val = collection[i];

        if (_protoTypeOf(val) === 'Array' || _protoTypeOf(val) === 'Object') {
          if (jest._equal(val, target)) return true;
        } else if (target === ANYTHING_OBJ && val !== undefined && val !== null) {
          return true;
        } else if (val === target) {
          return true;
        }
      }
    }

    return false;
  }; // }}}

  jest._equal = function (valA, valB) { // {{{
    if (valB === ANYTHING_OBJ && valA !== undefined && valA !== null) return true;
    if (valA === valB) return true;

    var isNotEq;
    var typeValA = _protoTypeOf(valA); // caching
    var typeValB = _protoTypeOf(valB);

    // Array
    if (typeValA === 'Array' || typeValB === 'Array') {
      if (typeValA !== 'Array' || typeValB !== 'Array') {
        return false;
      }

      var lenA = valA.length;
      var lenB = valB.length;

      if (lenA !== lenB) return false;
      if (lenA === 0 && lenB === 0) return true;

      for (var i = 0; i < lenA; i++) {
        if (!jest._equal(valA[i], valB[i])) return false;
      }
      return true;
    }

    // Number
    if (typeValA === 'Number' || typeValB === 'Number') {
      if (typeValA !== 'Number' || typeValB !== 'Number') {
        return false;
      }
      return valA !== valA && valB !== valB; // `NaN !== NaN` is true
    }

    // String
    if (typeValA === 'String' || typeValB === 'String') {
      if (typeValA !== 'String' || typeValB !== 'String') {
        return false;
      }

      return valA === valB;
    }

    // Object
    if (typeValA === 'Object' || typeValB === 'Object') {
      if (typeValA !== 'Object' || typeValB !== 'Object') return false;
      if (typeValA !== typeValB) return false;

      for (var propNameA in valA) {
        if (!Object.prototype.hasOwnProperty.call(valB, propNameA)) return false;
        if (!jest._equal(valA[propNameA], valB[propNameA])) return false;
      }

      for (var propNameB in valB) {
        if (!Object.prototype.hasOwnProperty.call(valA, propNameB)) return false;
      }
      return true;
    }

    // Others
    return false;
  }; // }}}

  WScript.Echo(String(WScript.ScriptFullName));

  /**
   * Creates a test blocks.
   *
   * @global
   * @function describe
   * @param {string} description - The description for test blocks.
   * @param {Function} fn - The test function blocks.
   * @returns {void}
   */
  describe = function (description, fn) {
    _description = description;
    _skippedCount = 0;
    _passedCount = 0;
    _faledCount = 0;

    WScript.Echo('\n----------------------------\n' + description);

    fn();

    var resultMsg = '\nTests: ';
    var totalCount = _skippedCount + _passedCount + _faledCount;

    if (_skippedCount !== 0) resultMsg += _skippedCount + ' skipped, ';
    if (_passedCount !== 0) resultMsg += _passedCount + ' passed, ';
    WScript.Echo(resultMsg + totalCount + ' total');
  };

  var Test = function (name, fn) { // {{{
    if (_reTestName && !_reTestName.test(_description) && !_reTestName.test(name)) {
      _skippedCount += 1;
      return;
    }

    _expectedCount = 0;
    var startTime;
    var endTime;
    var msec;

    try {
      startTime = new Date();

      fn();

      endTime = new Date();
      msec = endTime.getTime() - startTime.getTime();
      WScript.Echo('  √ ' + name + ' (' + msec + 'ms ' + _expectedCount + 'exp)');
      // WScript.Echo('  √ ' + name + ' (' + msec + 'ms) Fulfilled ' + _expectedCount + ' expectings');
      _passedCount += 1;
    } catch (e) {
      endTime = new Date();
      msec = endTime.getTime() - startTime.getTime();
      WScript.Echo('  × ' + name + ' (' + msec + 'ms ' + (_expectedCount - 1) + 'exp)');
      WScript.Echo('      No.' + _expectedCount + ' ' + String(e.message));
      _faledCount += 1;
    }
  }; // }}}

  /**
   * Creates a test to run.
   *
   * @global
   * @namespace test
   * @param {string} name - The test name.
   * @param {Function} fn - The test function block.
   * @returns {Test}
   */
  test = function (name, fn) {
    return new Test(name, fn);
  };

  /**
   * @function skip
   * @memberof test
   * @returns {void}
   */
  test.skip = function () {
    _skippedCount += 1;
  };

  var Expect = function (received) { // {{{
    this.not = {};

    /**
     * @function arrayContaining
     * @memberof expect
     * @returns {void}
     */
    this.arrayContaining = function (expected) { // {{{
      /** @todo {@link https://jestjs.io/docs/en/expect#expectarraycontainingarray} */
    };

    this.not.arrayContaining = function (expected) {
      /** @todo {@link https://jestjs.io/docs/en/expect#expectarraycontainingarray} */
    }; // }}}

    /**
     * @function toBe
     * @memberof expect
     * @returns {void}
     */
    this.toBe = function (expected) { // {{{
      if (received === expected) {
        //
      } else {
        throw new Error('Expected to be ' + expected + ', but ' + _toDir(received));
      }
    };

    this.not.toBe = function (expected) {
      if (received !== expected) {
        //
      } else {
        throw new Error('Expected not to be ' + expected + ', but ' + _toDir(received));
      }
    }; // }}}

    /**
     * @function toBeNaN
     * @memberof expect
     * @returns {void}
     */
    this.toBeNaN = function () { // {{{
      if (received !== received) {
        //
      } else {
        throw new Error();
      }
    };

    this.not.toBeNaN = function () {
      if (received === received) {
        //
      } else {
        throw new Error();
      }
    }; // }}}

    /**
     * @function toBeGreaterThan
     * @memberof expect
     * @returns {void}
     */
    this.toBeGreaterThan = function (expected) { // {{{
      if (received > expected) {
        //
      } else {
        throw new Error('Expected to be greater than ' + expected + ', but ' + received);
      }
    };

    this.toBeGreaterThanOrEqual = function (expected) {
      if (received >= expected) {
        //
      } else {
        throw new Error('Expected to be equal or greater than ' + expected + ', but ' + received);
      }
    };

    this.toBeLessThanOrEqual = function (expected) {
      if (received <= expected) {
        //
      } else {
        throw new Error('Expected to be equal or less than ' + expected + ', but ' + received);
      }
    };

    this.toBeLessThan = function (expected) {
      if (received < expected) {
        //
      } else {
        throw new Error('Expected to be less than ' + expected + ', but ' + received);
      }
    }; // }}}

    /**
     * @function toBeNull
     * @memberof expect
     * @returns {void}
     */
    this.toBeNull = function () { // {{{
      if (received === null) {
        //
      } else {
        throw new Error();
      }
    };

    this.not.toBeNull = function () {
      if (received !== null) {
        //
      } else {
        throw new Error();
      }
    }; // }}}

    /**
     * @function toBeTruthy
     * @memberof expect
     * @returns {void}
     */
    this.toBeTruthy = function () { // {{{
      if (received == true) {
        //
      } else {
        throw new Error();
      }
    };

    /**
     * @function toBeFalsy
     * @memberof expect
     * @returns {void}
     */
    this.toBeFalsy = function () {
      if (received == false) {
        //
      } else {
        throw new Error();
      }
    }; // }}}

    /**
     * @function toBeUndefined
     * @memberof expect
     * @returns {void}
     */
    this.toBeUndefined = function () { // {{{
      if (received === undefined) {
        //
      } else {
        throw new Error('Expected to be undefined, But defined. ' + _toDir(received));
      }
    };

    /**
     * @function toBeDefined
     * @memberof expect
     * @returns {void}
     */
    this.toBeDefined = function () {
      if (received !== undefined) {
        //
      } else {
        throw new Error('Expected not to be undefined, But undefined.');
      }
    }; // }}}

    /**
     * @function toContain
     * @memberof expect
     * @returns {void}
     */
    this.toContain = function (item) { // {{{
      if (received === undefined || received === null) {
        throw new Error('\nexpect(received).toContain(expected)\n'
          + 'Matcher error: received value must not be null nor undefined\n'
          + 'Received has value: ' + _toDir(received));
      }
      if (jest._contains(received, item)) {
        //
      } else {
        throw new Error('Expected to contain ' + _toDir(item) + ' in ' + _toDir(received) + '. but is not contained.');
      }
    };

    this.not.toContain = function (item) {
      if (received === undefined || received === null) {
        throw new Error('\nexpect(received).toContain(expected)\n'
          + 'Matcher error: received value must not be null nor undefined\n'
          + 'Received has value: ' + _toDir(received));
      }
      if (!jest._contains(received, item)) {
        //
      } else {
        throw new Error('Expected to not contain ' + _toDir(item) + ' in ' + _toDir(received) + '. but is contained.');
      }
    }; // }}}

    /**
     * @function toContainEqual
     * @memberof expect
     * @returns {void}
     */
    this.toContainEqual = function (item) { // {{{
      if (jest._containsEqual(received, item)) {
        //
      } else {
        throw new Error('Expected to contain ' + _toDir(item) + ' in ' + _toDir(received) + '. but is not contained.');
      }
    };

    this.not.toContainEqual = function (item) {
      if (!jest._containsEqual(received, item)) {
        //
      } else {
        throw new Error('Expected to not contain ' + _toDir(item) + ' in ' + _toDir(received) + '. but is contained.');
      }
    }; // }}}

    /**
     * @function toEqual
     * @memberof expect
     * @returns {void}
     */
    this.toEqual = function (expected) { // {{{
      if (jest._equal(received, expected)) {
        //
      } else {
        throw new Error('Expected to be ' + _toDir(expected) + ', but ' + _toDir(received));
      }
    };

    this.not.toEqual = function (expected) {
      if (!jest._equal(received, expected)) {
        //
      } else {
        throw new Error('Expected to be not ' + _toDir(expected) + ', but ' + _toDir(received));
      }
    }; // }}}

    /**
     * @function toHaveLength
     * @memberof expect
     * @returns {void}
     */
    this.toHaveLength = function (expected) { // {{{
      var len = received.length;
      if (len === expected) {
        //
      } else {
        throw new Error('Expected to have ' + expected + ' length, but ' + len);
      }
    };

    this.not.toHaveLength = function (expected) {
      var len = received.length;
      if (len !== expected) {
        //
      } else {
        throw new Error('Expected to not have ' + expected + ' length, but ' + len);
      }
    }; // }}}

    /**
     * @function toMatch
     * @memberof expect
     * @returns {void}
     */
    this.toMatch = function (regexpObj) { // {{{
      if (regexpObj.test(received)) {
        //
      } else {
        throw new Error('Expected to be ' + _toDir(regexpObj) + ', but ' + _toDir(received));
      }
    };

    this.not.toMatch = function (regexpObj) {
      if (!regexpObj.test(received)) {
        //
      } else {
        throw new Error('Expected to be not ' + _toDir(regexpObj) + ', but ' + _toDir(received));
      }
    }; // }}}

    /**
     * @function objectContaining
     * @memberof expect
     * @returns {void}
     */
    this.objectContaining = function (expected) { // {{{
      /** @todo {link https://jestjs.io/docs/en/expect#expectobjectcontainingobject} */
    };

    this.not.objectContaining = function (expected) {
      /** @todo {link https://jestjs.io/docs/en/expect#expectobjectcontainingobject} */
    }; // }}}

    /**
     * @function toThrowError
     * @memberof expect
     * @returns {void}
     */
    this.toThrowError = function () { // {{{
      var errMsg = 'Expected throwing a error, but not did';
      try {
        received();
        throw new Error(errMsg);
      } catch (e) {
        if (errMsg === e.message) throw new Error(errMsg);
      }
    };

    /**
     * @function toThrow
     * @memberof expect
     * @aliase toThrowError
     * @returns {void}
     */
    this.toThrow = function () {
      this.toThrowError();
    }; // }}}
  }; // }}}

  /**
   * @global
   * @namespace expect
   * @param {any} received
   * @returns {Expect}
   */
  expect = function (received) {
    // if (!received) {
    //   throw new Error('Expect takes at most one argument.');
    // }
    _expectedCount += 1;
    return new Expect(received);
  };

  expect.anything = function () { // {{{
    return ANYTHING_OBJ;
  }; // }}}
})();

// vim:set foldmethod=marker commentstring=//%s :
