var fs = require('fs');
var passwd = require('passwd');

module.exports = function () {
    this.listKeys = function (username, cb) {
        fs.stat('/home/' + username + '/.ssh', function (err, stats) {
            if (err) {
                cb('.ssh dir doesnt exist for ' + username);
                return;
            }
            var authorized_keys_file = '/home/' + username + '/.ssh/authorized_keys';
            fs.stat(authorized_keys_file, function (err, stats) {
                if (err) {
                    cb('.ssh/authorized_keys doesnt exist for ' + username);
                    return;
                }
                fs.readFile(authorized_keys_file, 'ascii', function (err, data) {
                    if (err) {
                        cb('failed reading .ssh/authorized_keys for ' + username);
                        return;
                    }
                    var keys = data.split('\n');
                    cb(null, keys);
                });
            });
        });
    }

    this.addKey = function (username, key, cb) {
        var file = '/home/' + username + '/.ssh/authorized_keys';
        var s = fs.createWriteStream(file, { flags : 'a', mode : 0600 });
        
        s.on('error', cb);
        s.on('close', function () {
            passwd.get(username, function (user) {
                if (!user) {
                    cb('failed getting user info for ' + email);
                    return;
                }
                fs.chown('/home/' + username + '/.ssh/authorized_keys',
                    parseInt(user.userId),
                    parseInt(user.groupId),
                    function (err) {
                        if (err) {
                            cb('failed chowning authorized_keys for ' + username);
                        }
                        else {
                            cb(null);
                        }
                    }
                );
            });
        });
        
        s.write(key);
        s.end();
    }

    this.deleteKey = function (username, index, cb) {
        fs.stat('/home/' + username + '/.ssh', function (err, stats) {
            if (err) {
                cb('.ssh dir doesnt exist for ' + username);
                return;
            }
            var authorized_keys_file = '/home/' + username + '/.ssh/authorized_keys';
            fs.stat(authorized_keys_file, function (err, stats) {
                if (err) {
                    cb('.ssh/authorized_keys doesnt exist for ' + username);
                    return;
                }
                if (index == -1) {
                    fs.unlink(authorized_keys_file, function (err) {
                        if (err) {
                            cb('failed unlinking authorized_keys_file');
                            return;
                        }
                        cb(null);
                    });
                }
                else {
                    fs.readFile(authorized_keys_file, 'ascii', function (err, data) {
                        if (err) {
                            cb('failed reading .ssh/authorized_keys for ' + username);
                            return;
                        }
                        var keys = data.split('\n');
                        keys.splice(index, 1);

                        var s = fs.createWriteStream(authorized_keys_file, { flags : 'w+', mode : 0600 });
                        s.on('error', cb);
                        s.on('close', function () { cb(null); });
                        s.write(keys.join('\n'));
                        s.end();
                    });
                }
            });
        });
    }

    this.deleteAllKeys = function (username, cb) {
        fs.stat('/home/' + username + '/.ssh', function (err, stats) {
            if (err) {
                cb('.ssh dir doesnt exist for ' + username);
                return;
            }
            var authorized_keys_file = '/home/' + username + '/.ssh/authorized_keys';
            fs.stat(authorized_keys_file, function (err, stats) {
                if (err) {
                    cb('.ssh/authorized_keys doesnt exist for ' + username);
                    return;
                }
                fs.unlink(authorized_keys_file, function (err) {
                    if (err) {
                        cb('failed unlinking authorized_keys_file');
                        return;
                    }
                    cb(null);
                });
            });
        });
    }
}
