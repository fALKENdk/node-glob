require('./global-leakage.js')
// Ignore option test
// Show that glob ignores results matching pattern on ignore option

var glob = require('../glob.js')
var test = require('tap').test

test('get all', function(t) {
  var results = glob('*', {sync: true, cwd: 'a'})
  t.same(results, ['abcdef', 'abcfed', 'b', 'bc', 'c', 'cb', 'symlink'])
  t.end()
});

test('ignore b', function(t) {
  var results = glob('*', {sync: true, cwd: 'a', ignore: 'b'})
  t.same(results, ['abcdef', 'abcfed', 'bc', 'c', 'cb', 'symlink'])
  t.end()
});

test('ignore all with first letter as b', function(t) {
  var results = glob('*', {sync: true, cwd: 'a', ignore: 'b*'});
  t.same(results, ['abcdef', 'abcfed', 'c', 'cb', 'symlink'])
  t.end()
});

test('ignore b/c/d in b/c', function(t) {
  var results = glob('b/**', {sync: true, cwd: 'a', ignore: 'b/c/d'});
  t.same(results, ['b', 'b/c'])
  t.end()
});

// matches based on pattern specified
test('ignores d in b/c only if pattern starts with b/c', function(t) {
  var results = glob('b/**', {sync: true, cwd: 'a', ignore: 'd'});
  t.same(results, ['b', 'b/c', 'b/c/d'])
  t.end()
});

test('ignore b/c and it\'s contents using globstar', function(t) {
  var results = glob('b/**', {sync: true, cwd: 'a', ignore: 'b/c/**'})
  t.same(results, ['b'])
  t.end()
});

test('ignore, get all d but that in b', function(t) {
  var results = glob('**/d', {sync: true, cwd: 'a', ignore: 'b/c/d'})
  t.same(results, ['c/d'])
  t.end()
});

test('ignore, get all a/**/[gh] except a/abcfed/g/h', function(t) {
  var results = glob('a/**/[gh]', {sync: true, ignore: ['a/abcfed/g/h']})
  t.same(results, ['a/abcdef/g', 'a/abcdef/g/h', 'a/abcfed/g'])
  t.end()
});

test('ignore, using multiple ignores', function(t) {
  var results = glob('*', {sync: true, cwd: 'a', ignore: ['c', 'bc', 'symlink', 'abcdef']})
  t.same(results, ['abcfed', 'b', 'cb'])
  t.end()
});

test('ignore, using multiple ignores and globstar', function(t) {
  var results = glob('a/**', {sync: true, ignore: ['a/c/**', 'a/bc/**', 'a/symlink/**', 'a/abcdef/**']})
  t.same(results, ['a', 'a/abcfed', 'a/abcfed/g', 'a/abcfed/g/h', 'a/b', 'a/b/c', 'a/b/c/d', 'a/cb', 'a/cb/e', 'a/cb/e/f'])
  t.end()
});

test('ignore a and it\'s contents', function(t) {
  var results = glob('a/**', {sync: true, ignore: ['a/**']})
  t.same(results, [])
  t.end()
});

test('ignore a and it\'s contents in case of multiple globstars', function(t) {
  var results = glob('a/**', {sync: true, ignore: ['a/**/**']})
  t.same(results, [])
  t.end()
});

test('ignore, get path\'s matching a/b, exclude only a/b', function(t) {
  var results = glob('a/b/**', {sync: true, ignore: ['a/b']})
  t.same(results, ['a/b/c', 'a/b/c/d'])
  t.end()
});

test('ignore, get all but b', function(t) {
  var results = glob('**', {sync: true, cwd: 'a', ignore: ['b']})
  t.same(results, ["", "abcdef", "abcdef/g", "abcdef/g/h", "abcfed", "abcfed/g", "abcfed/g/h", "b/c", "b/c/d", "bc", "bc/e", "bc/e/f", "c", "c/d", "c/d/c", "c/d/c/b", "cb", "cb/e", "cb/e/f", "symlink", "symlink/a", "symlink/a/b", "symlink/a/b/c"])
  t.end()
});

test('ignore, get all but b and c', function(t) {
  var results = glob('**', {sync: true, cwd: 'a', ignore: ['b', 'c']})
  t.same(results, ["", "abcdef", "abcdef/g", "abcdef/g/h", "abcfed", "abcfed/g", "abcfed/g/h", "b/c", "b/c/d", "bc", "bc/e", "bc/e/f", "c/d", "c/d/c", "c/d/c/b", "cb", "cb/e", "cb/e/f", "symlink", "symlink/a", "symlink/a/b", "symlink/a/b/c"])
  t.end()
});

test('ignore, get all but filenames starting with b', function(t) {
  var results = glob('**', {sync: true, cwd: 'a', ignore: ['b**']})
  t.same(results, ["", "abcdef", "abcdef/g", "abcdef/g/h", "abcfed", "abcfed/g", "abcfed/g/h", "b/c", "b/c/d", "bc/e", "bc/e/f", "c", "c/d", "c/d/c", "c/d/c/b", "cb", "cb/e", "cb/e/f", "symlink", "symlink/a", "symlink/a/b", "symlink/a/b/c"])
  t.end()
});

test('ignore, get all but files and directories of b', function(t) {
  var results = glob('**', {sync: true, cwd: 'a', ignore: ['b/**']})
  t.same(results, ["", "abcdef", "abcdef/g", "abcdef/g/h", "abcfed", "abcfed/g", "abcfed/g/h", "bc", "bc/e", "bc/e/f", "c", "c/d", "c/d/c", "c/d/c/b", "cb", "cb/e", "cb/e/f", "symlink", "symlink/a", "symlink/a/b", "symlink/a/b/c"])
  t.end()
});

test('ignore, get all but files and directories starting with b', function(t) {
  var results = glob('**', {sync: true, cwd: 'a', ignore: ['b**/**']})
  t.same(results, ["", "abcdef", "abcdef/g", "abcdef/g/h", "abcfed", "abcfed/g", "abcfed/g/h", "c", "c/d", "c/d/c", "c/d/c/b", "cb", "cb/e", "cb/e/f", "symlink", "symlink/a", "symlink/a/b", "symlink/a/b/c"])
  t.end()
});

test('ignore, get all but files and directories starting with ab and ending with ef', function(t) {
  var results = glob('**', {sync: true, cwd: 'a', ignore: ['ab**ef/**']})
  t.same(results, ["", "abcfed", "abcfed/g", "abcfed/g/h", "b", "b/c", "b/c/d", "bc", "bc/e", "bc/e/f", "c", "c/d", "c/d/c", "c/d/c/b", "cb", "cb/e", "cb/e/f", "symlink", "symlink/a", "symlink/a/b", "symlink/a/b/c"])
  t.end()
});

test('ignore, get all but files and directories of abcdef and abcfed', function(t) {
  var results = glob('**', {sync: true, cwd: 'a', ignore: ['abc{def,fed}/**']})
  t.same(results, ["", "b", "b/c", "b/c/d", "bc", "bc/e", "bc/e/f", "c", "c/d", "c/d/c", "c/d/c/b", "cb", "cb/e", "cb/e/f", "symlink", "symlink/a", "symlink/a/b", "symlink/a/b/c"])
  t.end()
});

test('ignore, get all but files and directories in first subdirectory of abcdef and abcfed', function(t) {
  var results = glob('**', {sync: true, cwd: 'a', ignore: ['abc{def,fed}/*']})
  t.same(results, ["", "abcdef", "abcdef/g/h", "abcfed", "abcfed/g/h", "b", "b/c", "b/c/d", "bc", "bc/e", "bc/e/f", "c", "c/d", "c/d/c", "c/d/c/b", "cb", "cb/e", "cb/e/f", "symlink", "symlink/a", "symlink/a/b", "symlink/a/b/c"])
  t.end()
});

test('ignore, get all files from c but the first subdirectory/files', function(t) {
  var results = glob('c/**', {sync: true, cwd: 'a', ignore: ['c/*']})
  t.same(results, ['c', 'c/d/c', 'c/d/c/b'])
  t.end()
});

test('ignore, get all files from c but the first subdirectory/files without cwd option', function(t) {
  var results = glob('a/c/**', {sync: true, ignore: ['a/c/*']})
  t.same(results, ['a/c', 'a/c/d/c', 'a/c/d/c/b'])
  t.end()
});

test('ignore all files and directories of c', function(t) {
  var results = glob('a/c/**', {sync: true, ignore: ['a/c/**', 'a/c/*', 'a/c/*/*']})
  t.same(results, [])
  t.end()
});