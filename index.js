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
}
