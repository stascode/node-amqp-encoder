var should      = require('should'),

    builder     = require('../lib/encoded_builder');

describe('Builder', function() {
    describe('#number()', function () {
        it('should pick signed long if asked', function() {
            var b = new builder();
            var encoded = b.number('long', 123).encode();
            encoded.should.eql(['long', 123]);
        });
        it('should pick unsigned byte by itself', function () {
            var b = new builder();
            var encoded = b.number(123).encode();
            encoded.should.eql(['ubyte', 123]);
        });
    });

    describe('#described()', function() {
        it('should allow simple descriptors, values', function() {
            var b = new builder();
            var encoded = b.described().number('ulong', 0x10).string('the rest').encode();
            encoded.should.eql([ 'described', ['ulong', 0x10 ], 'the rest']);
        });
        it('should allow complex values', function() {
            var b = new builder();
            var encoded = b.described().symbol('amqp:list:begin').
                list().number('ushort', 1).number('ulong', 1).end().encode();
            encoded.should.eql([ 'described', ['symbol', 'amqp:list:begin'], ['list', ['ushort', 1], ['ulong', 1]]]);
        });
    });

    describe('#list()', function() {
        it('should build simple lists', function() {
            var b = new builder();
            var encoded = b.list().
                 number(123).
                 string('foo').
                end().encode();
            encoded.should.eql([ 'list', ['ubyte', 123], 'foo']);
        });
    });

    describe('#map()', function() {
        it('should build simple maps', function() {
            var b = new builder();
            var encoded = b.map().
                 string('key1').number(123).
                 string('key2').number(-123).
                end().encode();
            encoded.should.eql(['map', 'key1', ['ubyte', 123], 'key2', ['byte', -123]]);
        });
    });

});
