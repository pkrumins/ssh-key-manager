var fs = require('fs');
var passwd = require('passwd');
var path = require('path');

module.exports = new function () {
    this.sshPath = function(username, cb) {
        passwd.get(username, function (err, user) {
            if (err) {
                cb(err);
                return;
            }
            if (!user || !user.homedir) {
                cb('failed getting homedir for ' + username);
                return;
            }
            cb(null, path.join(user.homedir, '.ssh'));
        });
    }

    this.listKeys = function (username, cb) {
        this.sshPath(username, function (err, sshPath) {
            if (err) {
                cb('failed getting user info for' + username);
                return;
            }
            fs.stat(sshPath, function (err, stats) {
                if (err) {
                    cb('.ssh dir doesnt exist for ' + username);
                    return;
                }
                var authorized_keys_file = path.join(sshPath, 'authorized_keys');
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
        });
    }

    this.addKey = function (username, key, cb) {
        this.sshPath(username, function (err, sshPath) {
            if (err) {
                cb('failed getting user info for' + username);
                return;
            }

            var file = path.join(sshPath, 'authorized_keys');
            var s = fs.createWriteStream(file, { flags : 'a', mode : 0600 });
            
            s.on('error', cb);
            s.on('close', function () {
                passwd.get(username, function (user) {
                    if (!user) {
                        cb('failed getting user info for ' + email);
                        return;
                    }
                    fs.chown(file,
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
        });
    }

    this.deleteKey = function (username, index, cb) {
        this.sshPath(username, function (err, sshPath) {
            if (err) {
                cb('failed getting user info for' + username);
                return;
            }
            fs.stat(sshPath, function (err, stats) {
                if (err) {
                    cb('.ssh dir doesnt exist for ' + username);
                    return;
                }
                var authorized_keys_file = path.join(sshPath, 'authorized_keys');
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
        });
    }

    this.deleteAllKeys = function (username, cb) {
        this.sshPath(username, function (err, sshPath) {
            if (err) {
                cb('failed getting user info for' + username);
                return;
            }
            fs.stat(sshPath, function (err, stats) {
                if (err) {
                    cb('.ssh dir doesnt exist for ' + username);
                    return;
                }
                var authorized_keys_file = path.join(sshPath, 'authorized_keys');
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
        });
    }
}