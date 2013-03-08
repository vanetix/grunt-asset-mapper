var grunt = require('grunt');

exports.mapper = {
  basic: function(test) {
    var actual, expected;

    test.expect(2);
    
    actual = grunt.file.read('tmp/cats.html');
    expected = grunt.file.read('test/expected/cats.html');
    test.equal(actual, expected, 'should correctly map html assets');

    actual = grunt.file.read('tmp/cats.css');
    expected = grunt.file.read('test/expected/cats.css');
    test.equal(actual, expected, 'should correctly map css assets');

    test.done();
  }
};