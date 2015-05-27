QUnit.module('Object.prototype');

QUnit.test('$clone', function(assert) {
    function X() {
        this.x = 5;
        this.arr = [1,2,3];
    }
    var obj = { d: new Date(), r: /abc/ig, x: new X(), arr: [1,2,3] },
        obj2,
        clone;

    obj.x.xx = new X();
    obj.arr.testProp = "test";
    clone = obj.$clone();

    //Date
    assert.notStrictEqual(obj.d, clone.d, 'Date has been deep cloned.');
    assert.deepEqual(obj.d.valueOf(), clone.d.valueOf(), 'And the values of two Date are equal');
    //RegExp
    assert.notStrictEqual(obj.r, clone.r, 'RegExp has been deep cloned.');
    assert.deepEqual(obj.r.valueOf(), clone.r.valueOf(), 'And the values of two RegExp are equal');
    //User-defined Object
    assert.notStrictEqual(obj.x, clone.x, 'Object:X has been deep cloned.');
    assert.strictEqual(clone.x instanceof X, true, 'The copy is with type X');
    assert.deepEqual(obj.x.valueOf(), clone.x.valueOf(), 'And the values of two X are equal');
    //Arrays
    assert.notStrictEqual(obj.arr, clone.arr, 'Array has been deep cloned.');
    assert.deepEqual(obj.arr.testProp, clone.arr.testProp, 'Keep props of Arrays');
    assert.deepEqual(obj.arr.valueOf(), clone.arr.valueOf(), 'And the values of two Arrays are equal');

    //Circular structure
    obj = {};
    obj2 = { o:obj };
    obj.o = obj2;
    clone = obj.$clone();

    assert.notStrictEqual(obj, clone, 'The first part of circular structure has been deep cloned.');
    assert.notStrictEqual(obj2, clone.o, 'The second part of circular structure has been deep cloned.');
});

QUnit.test('$isRing', function(assert) {
    var obj = {
        a: 1,
        b: '23',
        c: {
            x: { a: 'test' },
            y: { a: 'test' }
        }
    };
    assert.strictEqual(obj.$isRing(), false, 'judge a object which contains no ring');

    var obj = {},
        anotherObj = { a: obj };
    obj.b = anotherObj;
    assert.strictEqual(obj.$isRing(), true, 'judge a simple object which contains a ring.');

    var obj = { arr: [] },
        obj1 = {},
        obj2 = { o: obj1 },
        obj3 = { o: obj2 };
    obj1.o = obj3;
    obj.arr.push(obj2);
    assert.strictEqual(obj.$isRing(), true, 'judge a complex object which contains a ring.');
});

QUnit.test('$equal', function(assert) {
    var obj = {
        a: "test",
        b: "test",
        arr: [1, 2, "3"],
        subObj: { a: 100 }
    }, anotherObj = {
        a: "test",
        b: "test",
        arr: [1, 2, "3"],
        subObj: { a: 100 }
    };
    assert.deepEqual(obj.$equal(anotherObj), true, 'two objects have the same attribute and value');

    //cyclic objects
    obj = {};
    anotherObj = { o: obj };
    obj.o = anotherObj;
    assert.throws(function() {
        obj.$equal(anotherObj);
    }, function(err) {
        return err.toString() === 'Error 12001: Cannot call $equal on a object which contains a ring.';
    }, 'throw Error 12001 when calling $equal on cyclicObj');
});