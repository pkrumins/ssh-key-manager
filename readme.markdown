SSH Key Manager
===============

Manage public ssh keys in ~/.ssh/authorized_keys file.

Example
=======

Adding a new key:

```js
var sshManager = require('ssh-key-manager');
sshManager.addKey('pkrumins', 'asdasdasd21312123 (key)', function (err) {
    if (err) {
        console.log(err);
        return;
    }
});
```

Listing keys:

```js
var sshManager = require('ssh-key-manager');
sshManager.listKeys('pkrumins', function (err, keys) {
    if (err) {
        console.log(err);
        return;
    }
    var i = 0;
    keys.forEach(function (key) {
        console.log(i, key);
        i++;
    });
});
```

Deleting a key by index:

```js
var sshManager = require('ssh-key-manager');
sshManager.deleteKey('pkrumins', 0, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Key 0 deleted ok');
});
```

Deleting all keys:

```js
var sshManager = require('ssh-key-manager');
sshManager.deleteAllKeys('pkrumins', function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('All keys deleted ok');
});
```

Methods
=======

## var sshManager = sshManager()

Return a new ssh manager instance.

## sshManager.listKeys(username, cb)
## sshManager.listKeys(username, function (err, keys) { ... })

List `username`'s public keys in `~username/.ssh/authorized_keys`.

## sshManager.addKey(username, key, cb)
## sshManager.addKey(username, key, function (err) { ... })

Add a key to `username`'s public keys in `~username/.ssh/authorized_keys`.

## sshManager.deleteKey(username, index, cb)
## sshManager.deleteKey(username, index, function (err) { ... })

Delete the key at index `index` from `username`'s public keys in `~username/.ssh/authorized_keys`.

## sshManager.deleteAllKeys(username, cb)
## sshManager.deleteAllKeys(username, function (err) { ... })

Delete all `username`'s public keys in `~username/.ssh/authorized_keys`.

Install
=======

With [npm](https://npmjs.org) do:

```
npm install ssh-key-manager
```

Use [browserify](http://browserify.org) to `require('ssh-key-manager')`.

License
=======

MIT
