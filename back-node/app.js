
// Module dependencies
var express = require('express')
  , mongoose = require('mongoose');

// MONGO DB
mongoose.connect('mongodb://localhost:27017/intimate');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var ObjectId = mongoose.Schema.Types.ObjectId;

// Create Schema
var userSchema = mongoose.Schema({
        login: String,
        password: String,
        email: String,
        sessions: [{token: String}]
});
var roomSchema = mongoose.Schema({
        users: [ObjectId],
        password: String,
        contents: [{content: [ObjectId]}],
        events: [ObjectId]
});
var contentSchema = mongoose.Schema({
        createdTimestamp: Date,
        path: String,
        validationState: String,
        interactions: [],
        events: [ObjectId]
});
var eventSchema = mongoose.Schema({
        timestamp: Date,
        text: String,
        attachments: [String]
});

// create Model
var User = mongoose.model('User', userSchema);
var Room = mongoose.model('Room', roomSchema);
var Content = mongoose.model('Content', contentSchema);
var Event = mongoose.model('Event', eventSchema);

// Fake data
// var sr1 = new Room({users: ['519845038b6a481266000004', '519838bf88d37bfb5a000004'], password: '1234', contents: [], events: []});
// sr1.save();
// var sr1 = new Content({createdTimestamp: 40000000, path: 'http://5.39.90.223:3001/api/content?api-key=foo&id=519838bf88d37bfb5a000007', validationState: 'OK', interaction: [], events: []});
// sr1.save();

var test =   [{
    "createdTimestamp": "1970-01-01T11:06:40.000Z",
    "path": "http://5.39.90.223/node/intimate/movie/54ac37d9d26aabd6e75c010bedff2d40",
    "validationState": "OK",
    "_id": "5198c6c365816a1c39000003",
    "__v": 0,
    "events": [],
    "interactions": []
  }];
var idet = "5198ed2bf18f81815c000005";
Room.update({_id:idet},{contents:test});

// var sr1 =  new User(
// {
// "login": "molobolo",
// "email": "coucou@gmail.com",
// "password": "orange",
// "sessions": [
//         {
//         "token": "00da0d3d-24e6-e0df-6fd0-dd2890e3f812",
//         "_id": "519838dfac2e36065b000003"
//         }
//     ]
// },
// {
// "login": "SylvainLeMarin",
// "email": "le_viel_homme_et_la_mer@gmail.com",
// "password": "orange",
// "sessions": [
//         {
//             "token": "00da0d3d-24e6-e0df-6fd0-dd2890e3f812",
//             "_id": "519838dfac2e36065b000003"
//         }
//     ]
// });
// sr1.save();


// module express
var app = module.exports = express();
app.use(express.bodyParser({uploadDir:'./movie'}));
app.use(express.methodOverride());

// create an error with .status. we
// can then use the property in our
// custom error handler (Connect repects this prop as well)
function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
}

// here we validate the API key,
// by mounting this middleware to /api
// meaning only paths prefixed with "/api"
// will cause this middleware to be invoked
app.use('/api', function(req, res, next){
        res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var key = req.query['api-key'];

    // key isnt present
    if (!key) return next(error(400, 'api key required'));

    // key is invalid
    if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));

    // all good, store req.key for route access
    req.key = key;
    next();
});

// position our routes above the error handling middleware,
// and below our API middleware, since we want the API validation
// to take place BEFORE our routes
app.use(app.router);

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next){
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.send(err.status || 500, { error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
    res.send(404, { error: "Lame, can't find that" });
});

// map of valid api keys, typically mapped to
// account info with some sort of database like redis.
// api keys do _not_ serve as authentication, merely to
// track API usage or help prevent malicious behavior etc.

var apiKeys = ['foo'];

// these two objects will serve as our faux database

// we now can assume the api key is valid,
// and simply expose the data

app.get('/api/users', function(req, res, next){
    var query = User.find(null);
        query.find();
        query.exec(function (err, data) {
                if (err) { throw err; }
                res.send(data);
    });
});

app.get('/api/rooms', function(req, res, next){
    var query = Room.find(null);
        query.find();
        query.exec(function (err, data) {
                if (err) { throw err; }
                res.send(data);
    });
});

app.get('/api/contents', function(req, res, next){
    var query = Content.find(null);
        query.find();
        query.exec(function (err, data) {
                if (err) { throw err; }
                res.send(data);
    });
});

app.get('/api/con/:id', function(req, res, next){
    var id = req.params.id;
    Content.find({_id:id},function(err,content){
        res.send(content);
    });
});

/*
    param GET : password
    param GET : token
*/
app.get('/api/room', function(req, res, next){
    var password = req.query['password'];
    var token = req.query['token'];
    var errorMessage = "Room doesn't exist";

    getUserFromToken(token,
        function(user) {
            console.log('user ok');
            Room.find({users: user.id, password: password}, function (err, rooms) {
                if (rooms && rooms.length > 0) {
                    console.log('room ok');
                    console.log(rooms[0]);
                    res.send(rooms[0]);
                }
                else {
                    console.log('room not ok: ' + user.id + ' ' + password);
                    res.send(400, errorMessage);
                }
            });
        },
        function(errorMessage) {
            res.send(400, errorMessage);
        }
    );
});

/*
    param GET : token
    param POST: partner
    param POST: password
*/
app.post('/api/room', function(req, res, next){
    var token = req.query['token'];
    var room = req.body;

    getUserFromToken(token,
        function(user) {
            getUserFromEmail(room.partner, 
                function(partner) {
                    checkRoomExists(user.id, partner.id, room.password, function(errorMessage) {
                        if (!errorMessage) {
                            var query = new Room(room);
                            var session = {token: guid()};
                            query.users.push(user.id);
                            query.users.push(partner.id);
                            console.log(query);
                            query.save();
                            res.send(query.toJSON());
                        }
                        else {
                            console.log('error! ' + errorMessage);
                            res.send(400, errorMessage);
                        }
                    });
                },
                function(errorMessage){
                    console.log('error! ' + errorMessage);
                    res.send(400, errorMessage);
                }
            );  
        },
        function(errorMessage) {
            res.send(400, errorMessage);
        }
    );
});

/*
    param GET: login
    param GET: password
    param GET: email
*/
app.post('/api/signup', function(req, res, next){
    var user = req.body;

    checkUserValidity(user, function(errorMessage) {
        if (!errorMessage) {
            var query = new User(user);
            var session = {token: guid()};
            query.sessions.push(session);
            console.log(query);
            query.save();
            res.send(session);
        }
        else {
            console.log('error! ' + errorMessage);
            res.send(400, errorMessage);
        }
    });
    
});

/*
    param GET: login
    param GET: password
*/
app.get('/api/signin', function(req, res, next){
    var pass = req.query['password'];
    var login = req.query['login'];
    User.find({login: login, password: pass}, function(err, users) {
        if (err) { throw err; }
        if (users && users.length > 0) {
            res.send(201,users[0].sessions[0].token);
        }
        else {
            res.send(401,"Wrong login or password !");
        }
    });       
});
/*
    param GET : id
    param files
*/
app.post('/api/content', function(req, res, next){
    var id = req.query['idRoom'];
    var pathVideo = "http://5.39.90.223/node/intimate/movie/";
    var nameFile = req.files["file"].path.split('/')[1];
    var fullPath = pathVideo+''+nameFile;
    console.log("SAVE VIDEO: "+nameFile);

    Room.find({_id: id},function(err,room){
        var contents = room[0].contents;
        var content = {createdTimestamp: 40000000, path: fullPath, validationState: 'OK', interaction: [], events: []};
        Room.update({_id: id},{contents: contents},function(err){
            console.log('cb');
        });
    });

});

/*
    param GET : id
*/
app.get('/api/content',function(req, res, next){
    var roomid = req.query['id'];
    Room.find({'_id':roomid}, function(err, room) {
        if (err) { throw err; }
        if (room && room.length > 0) {
            res.send(201,room);
        }
        else {
            res.send(401,"No room exist !");
        }
    });       
});

// app.get('/api/user/:name/repos', function(req, res, next){
//   var name = req.params.name
//     , user = userRepos[name];
//   if (user) res.send(user);
//   else next();
// });

if (!module.parent) {
    app.listen(3001);
    console.log('Express server listening on port 3001');
}

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////

var getUserFromToken = function(token, fSuccess, fError) {
    var user = User.find({'sessions.token': token}, function(err, users) {
        if (users.length > 0) {
            console.log('user token ok');
            fSuccess(users[0]);
        }
        else {
            console.log('user token not ok');
            fError("Session expired");
        }
    });
};

var getUserFromEmail = function(email, fSuccess, fError) {
    var user = User.find({'email': email}, function(err, users) {
        if (users.length > 0) {
            console.log('user email ok');
            fSuccess(users[0]);
        }
        else {
            console.log('user email not ok');
            fError("User doens't exist");
        }
    });
};

var checkUserValidity = function(user, callback) {
    var login = user.login;
    var email = user.email;

    var checkEmailValid = function(cb) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isValid = re.test(email);
        if (!isValid) {
            errorMessage = "E-mail is not valid";
            cb(errorMessage);
        }
        else {
            cb();
        }
    };
    var checkEmailExists = function(cb) {
        User.find({email: email}, function(err, users) {
            if (users && users.length > 0) {
                errorMessage = "E-mail already exists";
                cb(errorMessage);
            }
            else {
                cb();
            }
        });
    };
    var checkLoginExists = function(cb) {
        User.find({login: login}, function(err, users) {
            if (users && users.length > 0) {
                errorMessage = "Login already exists";
                cb(errorMessage);
            }
            else {
                cb();
            }
        });
    };

    // TODO it's dirty but... :)
    checkEmailValid(function(errorMessage) {
        if (!errorMessage) {
            checkEmailExists(function(errorMessage) {
                if (!errorMessage) {
                    checkLoginExists(callback);
                }
                else {
                    callback(errorMessage);
                }
            });
        }
        else {
            callback(errorMessage);
        }
    });
};

var checkRoomExists = function(userId, partnerId, password, cb) {
    Room.find({users: [userId, partnerId], password: password}, function(err, rooms) {
        if (rooms && rooms.length > 0) {
            errorMessage = "Room already exists";
            console.log(errorMessage);
            cb(errorMessage);
        }
        else {
            console.log('room can be created');
            cb();
        }
    });
};

var s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
                         .toString(16)
                         .substring(1);
};

var guid = function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                 s4() + '-' + s4() + s4() + s4();
};

