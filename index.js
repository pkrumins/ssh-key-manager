module.exports = function () {
    this.listPublicKeys = function (username, cb) {
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
}
