# WshJest

The testing module for [WSH][url1]. I thought to name this module "Test", But I chose "Jest". Because as but "Test" is a frequently used name and "T" and "J" look similar. On the other hand, this module is just a bit like [Jest](https://jestjs.io/).

[url1]: https://docs.microsoft.com/ja-jp/previous-versions/windows/scripting/cc364455(v=msdn.10)?redirectedfrom=MSDN "Windows Script Host"

## Operating environment

Works on JScript in Windows.

## Installation

(1) Create a directory of your WSH project.

```console
D:\> mkdir MyWshProject
D:\> cd MyWshProject
```

(2) Download this ZIP and unzip or Use the bellowing `git` command.

```console
> git clone https://github.com/tuckn/WshJest.git ./WshModules/WshJest
or
> git submodule add https://github.com/tuckn/WshJest.git ./WshModules/WshJest
```

Now, The file structure is as

```console
D:\MyWshProject\
├─ MyScript.js <- Your JScript code will be written in this.
└─ WshModules\
    └─ WshJest\
        └─ dist\
          └─ app.js
```

## Usage

(1) If you want to test *MyScript.js*, create a new .wsf file and .js file for testing.

```console
D:\MyWshProject\
├─ Test.wsf  <- Create this (Package file)
├─ MyScript.js
├─ MyScript.test.js <- Create this (Test code)
└─ WshModules\
    └─ WshJest\
        └─ dist\
          └─ app.js
```

(2) Write the above _Test.wsf_. For example, the following content

```xml
<package>
  <job id = "run">
    <script language="JScript" src="./MyScript.js"></script>
    <script language="JScript" src="./WshModules/WshJest/dist/app.js"></script>
    <script language="JScript" src="./MyScript.test.js"></script>
  </job>
</package>
```

Note that _.\WshJest\dist\app.js_ should be placed above your test .js file.
I recommend this WSH file (.wsf) encoding to be UTF-8 [BOM, CRLF].

(3) Now, Your JScript (_MyModule.test.js_) can use the testing functions.
`describe`, `test`, and `expect`.
For example,

```js
describe('MyScript', function () {
  test('Values', function () {
    // Compare primitive values or referential identity of object instances.
    expect(myVal1).toBe('MY_CONST_VAL');
    // Check an item that is in an array .
    expect(myVal2).toContain(2);
  });

  test('Functions', function () {
    // Check a variable that is undefined.
    expect(myFunc1(3)).toBeUndefined();
    // Check a function throws when it is called.
    expect(function () { myFunc1(null); }).toThrowError();
  });
});
```

(4) Run the test with cscript.exe.

```console
> cscript //nologo .\Test.wsf

----------------------------
MyScript
  √ Values (0ms 2exp)
  √ Functions (0ms 2exp)

Tests: 4 passed, 4 total
```

### Specifying test name

Can use the argument `-t` or `--testNamePattern`.

```console
> cscript //nologo .\Test.wsf -t "Values"

----------------------------
MyScript
  √ Values (0ms 2exp)

Tests: 2 skipped, 2 passed, 4 total
```

This string is to be must specify as RegExp. e.g. `"\w+Functions$"`.

Note that if you use `^` in the Command-Prompt, you need to escape it at the caret itself.
For example,

```console
> cscript //nologo .\Test.wsf -t "^^MyFooBar"
```

### Expect Method Examples

#### toBe, not.toBe

`toBe` is `if (A === B)`, `not.toBe` is `if (A !== B)`.

```js
describe('Expect Methods', function () {
  test('Be', function () {
    expect(undefined).toBe(undefined); // √
    expect(null).toBe(null); // √

    expect(undefined).toBe(null); // ×
    expect(undefined).not.toBe(null); // √

    // String
    expect('MY_CONST_VAL').toBe('MY_CONST_VAL'); // √
    expect('my_const_val').toBe('MY_CONST_VAL'); // ×
    expect('my_const_val').not.toBe('MY_CONST_VAL'); // √

    // Array
    var arrA = [1];
    var arrB = [1];
    var arrC = arrB;
    expect([1]).toBe([1]); // ×
    expect([1]).toBe(arrA); // ×
    expect(arrA).toBe(arrA); // √
    expect(arrA).toBe(arrB); // ×
    expect(arrB).toBe(arrC); // √

    // Object
    var obj1 = { a: 'A' };
    var obj2 = { a: 'A' };
    var obj3 = obj2;
    expect({ a: 'A' }).toBe({ a: 'A' }); // ×
    expect({ a: 'A' }).toBe(obj1); // ×
    expect(obj1).toBe(obj1); // √
    expect(obj1).toBe(obj2); // ×
    expect(obj2).toBe(obj3); // √
  });
```

#### toDefined, toBeUndefined

```js
describe('Expect Methods', function () {
  test('Defined', function () {
    var obj = { a: 'A' };

    // toBeDefined
    expect(undefined).toBeDefined(); // ×
    expect(null).toBeDefined(); // √
    expect('').toBeDefined(); // √
    expect(obj).toBeUndefined(); // √
    expect(obj.a).toBeUndefined(); // √
    expect(obj.b).toBeUndefined(); // ×

    // toBeUndefined
    expect(undefined).toBeUndefined(); // √
    expect(null).toBeUndefined(); // ×
    expect('').toBeUndefined(); // ×
    expect(obj).toBeUndefined(); // ×
    expect(obj.a).toBeUndefined(); // ×
    expect(obj.b).toBeUndefined(); // √
  });
```

#### toEqual, not.toEqual

```js
describe('Expect Methods', function () {
  test('Equal', function () {
    expect(undefined).toEqual(undefined); // √
    expect(null).toEqual(null); // √

    expect(undefined).toEqual(null); // ×
    expect(undefined).not.toEqual(null); // √

    // String
    expect('MY_CONST_VAL').toEqual('MY_CONST_VAL'); // √
    expect('my_const_val').toEqual('MY_CONST_VAL'); // ×
    expect('my_const_val').not.toEqual('MY_CONST_VAL'); // √

    // Array
    var arrA = [1];
    var arrB = [1];
    var arrC = arrB;
    expect([1]).toEqual([1]); // √
    expect([1]).toEqual(arrA); // √
    expect(arrA).toEqual(arrA); // √
    expect(arrA).toEqual(arrB); // √
    expect(arrB).toEqual(arrC); // √
    expect([1, 2]).toEqual([1]); // ×

    // Object
    var obj1 = { a: 'A' };
    var obj2 = { a: 'A' };
    var obj3 = obj2;
    expect({ a: 'A' }).toEqual({ a: 'A' }); // √
    expect({ a: 'A' }).toEqual(obj1); // √
    expect(obj1).toEqual(obj1); // √
    expect(obj1).toEqual(obj2); // √
    expect(obj2).toEqual(obj3); // √
    expect({ a: 'A', b: 'B' }).toEqual({ a: 'A' }); // ×
  });
```

#### toContain, not.toContain

Use for String and Array.

```js
describe('Expect Methods', function () {
  test('Contain', function () {
    expect(undefined).toContain(undefined); // throw a error
    expect(null).toContain(null); // throw a Error

    // String
    expect('MY_CONST_VAL').toContain('CONST_VAL'); // √
    expect('MY_CONST_VAL').toContain('MY'); // √
    expect('MY_CONST_VAL').toContain('my'); // ×
    expect('MY_CONST_VAL').not.toContain('Another_val'); // √

    // Array
    var arr1 = [1];
    expect([arr1, 2]).toContain(arr1); // √

    expect([1, 2]).toContain(1); // √
    expect([1, 2]).toContain([1]); // ×
    expect([[1], 2]).toContain([1]); // ×

    expect([1, { b: 'B' }]).toContain({ b: 'B' }); // ×
    var objB = { b: 'B' };
    expect([1, objB]).toContain(objB); // √

    // Object -> All of them to be failed
    expect({ a: 'A', b: 'B' }).toContain({ a: 'A' }); // ×
    expect({ a: 'A' }).toContain({ a: 'A' }); // ×
    expect({ a: 'A' }).toContain('a'); // ×
    expect({ a: 'A' }).toContain('A'); // ×
  });
```

#### toContainEqual, not.toContainEqual

Use for Array.

```js
describe('Expect Methods', function () {
  test('ContainEqual', function () {
    expect(undefined).toContainEqual(undefined); // throw a error
    expect(null).toContainEqual(null); // throw a Error

    // String -> All of them to be failed
    expect('MY_CONST_VAL').toContainEqual('MY'); // ×
    expect('MY_CONST_VAL').toContainEqual('MY_CONST_VAL'); // ×
    expect('MY_CONST_VAL').not.toContainEqual('MY_CONST_VAL'); // √

    // Array
    expect([1, 2]).toContainEqual(1); // √
    expect([1, 2]).toContainEqual([1]); // ×
    expect([[1], 2]).toContainEqual([1]); // √
    expect([1, { b: 'B' }]).toContainEqual({ b: 'B' }); // √

    // Object -> All of them to be failed
    expect({ a: 'A', b: 'B' }).toContainEqual({ a: 'A' }); // ×
    expect({ a: 'A' }).toContainEqual({ a: 'A' }); // ×
    expect({ a: 'A' }).toContainEqual('a'); // ×
    expect({ a: 'A' }).toContainEqual('A'); // ×
  });
```

#### Other methods

```js
describe('Expect Methods', function () {
  test('others', function () {
    // toThrowError
    expect(new Error).toThrowError(); // √
    expect(function () { undefinedFunc(); }).toThrowError(); // √

    // @TODO
    // toBeNaN, toBeGreaterThan, toBeTruthy, toHaveLength
  });
```

## Documentation

See all specifications [here](https://docs.tuckn.net/WshJest).

## Example of Use

- [WshFileSystem](https://github.com/tuckn/WshFileSystem/blob/master/src/FileSystem.test.js)
- [WshPath](https://github.com/tuckn/WshPath/blob/master/src/Path.test.js)
- [WshUtil](https://github.com/tuckn/WshUtil/blob/master/src/Util.test.js)

## License

MIT

Copyright (c) 2020 [Tuckn](https://github.com/tuckn)
