require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use('/images', express.static('images'));
app.use(cookieParser())

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = {
  id: String,
  email: String,
  username: String,
  password: String,
  Date: String,
  favorite: [],
  picture: {
    type: Number,
    default: 4
  },
  added: [],
  followers: [],
  following: []
}



const asanaschema = {
  name: String,
  picture: String,
  benefits: String,
  likes: {
    type: [String],
    default: []
  },
  imgtype: String
}


let transporter = nodemailer.createTransport({
  service: "Outlook365",
  auth: {
    user: 'swasthyaguru2022@outlook.com',
    pass: process.env.Password
  },
});


const User = new mongoose.model("User", userSchema);

const Asana = new mongoose.model("Asana", asanaschema);


app.get("/home", function(req, res) {
  res.render("home");
});

app.get("/precautions", function(req, res) {
  res.render("precautions");
});

//


// login page
app.get("/", function(req, res) {
  if (req.cookies.user) {
    res.redirect("/home");
  } else {
    res.render("login", {
      message: ""
    });
  }
});

app.post("/login", function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) res.render("login", {
      message: "Errors occured"
    });
    else if (user == null) res.render("login", {
      message: "username doesn't exists!"
    });
    else bcrypt.compare(req.body.password, user.password, function(err, result) {
      if (err) {
        res.render("login", {
          message: "Try again"
        });
      } else if (result) {
        var username = req.body.username;
        res.cookie("user", user);
        res.redirect("/");
      } else {
        res.render("login", {
          message: "Incorrect Password!"
        });
      }
    });
  });
});

// SignUp page
app.get("/signup", function(req, res) {

  res.render("signup", {
    message: ""
  });

});

// Create a new user
app.post("/signup", function(req, res) {
  const email = req.body.EmailID;
  if (req.body.password != req.body.confirm) {
    res.render("signup", {
      message: "Incorrect credentials"
    });
  } else {
    User.findOne({
      email: req.body.EmailID
    }, function(err, user) {
      if (user != null) {
        res.render("signUp", {
          message: "Email already exists!"
        });
      } else {
        bcrypt.hash(req.body.password, 10, function(err, bHash) {
          const newUser = new User({
            email: req.body.EmailID,
            username: req.body.username,
            password: bHash,
            Date: req.body.DOB
          });
          newUser.save();
          res.cookie("user", newUser);
          res.render("home");
        });
      }
    });
  }

});

// function sendMail(userMailID){
//   const options = {
//     from: 'swasthyaguru2022@outlook.com',
//     to: userMailID,
//     subject: 'SwasthyaGuru verification email',
//     text:"welcome to Swasthya Guru.the Only Platform for best yoga Knowledge ..",
//     html:'<a href="/home">click here</a>'
//   };
//
//    transporter.sendMail(options);
//  }

// used to delete the account
app.post("/deleteaccount", function(req, res) {
  var f = false;
  User.findOne({
    _id: req.cookies.user._id
  }, function(err, userdata) {
    if (err) {
      console.log(err);
    } else {
      if (userdata.followers.length === 0 && userdata.following.length === 0) {
        User.deleteOne({
          email: req.cookies.user.email
        }, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("deleted");
            res.render("login", {
              message: ""
            });
          }
        });
      } else {
        for (var i = 0; i < userdata.following.length; i++) {
          User.findOneAndUpdate({
            email: userdata.following[i]
          }, {
            $pull: {
              followers: req.cookies.user.email
            }
          }, function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log("successfully completed the work with no issues and internal errors..");
            }
          });
        }
        for (var i = 0; i < userdata.followers.length; i++) {
          User.findOneAndUpdate({
            email: userdata.followers[i]
          }, {
            $pull: {
              following: req.cookies.user.email
            }
          }, function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log("successfully completed the work with no issues and internal errors..");
            }
          });
        }

        User.deleteOne({
          email: req.cookies.user.email
        }, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("deleted");
            res.render("login", {
              message: ""
            });
          }
        });

      }
    }
  });



});

function escapeRegex(regex) {
  return regex.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.post("/searchasanas", function(req, res) {
  const reg = new RegExp(escapeRegex(req.body.asana), "gi");
  Asana.find({
    name: reg
  }, function(err, asanaObjs) {
    if (err) {
      console.log(err);
    } else if (asanaObjs.length != 0) {
      res.send({
        asanas: asanaObjs
      });
    } else {
      Asana.find({
        name: reg
      }, function(err, asanaObjs) {
        if (err) {
          console.log(err);
        } else {
          res.send({
            asanas: asanaObjs
          });
          sent = true;
        }
      });
    }
  });
});



app.get("/asanas", function(req, res) {
  Asana.find({}, function(err, asanaObjs) {
    if (err) {
      console.log(err);
    } else {
      res.render("asanas", {
        asanas: asanaObjs
      });
    }
  });

});

app.get("/asanas/:name", function(req, res) {
  let id = req.params.name;
  Asana.findOne({
    name: id
  }, function(err, asanaobj) {
    if (err) {
      console.log(err);
    } else {
      res.render("extension", {
        asana: asanaobj,
        preuser: req.cookies.user
      });
    }
  });
});

app.post("/like", function(req, res) {
  var use = req.cookies.user._id;
  var search = req.body.detail;
  var t = false;
  Asana.findOne({
    name: search
  }, function(err, object) {
    if (err) {
      console.log(err);
    } else {
      if (object.likes.length === 0) {
        Asana.findOneAndUpdate({
          name: search
        }, {
          $push: {
            likes: use
          }
        }, function(err, docs) {
          if (err) {
            console.log(err)
          } else {
            console.log(docs.likes.length);
          }
        });
      } else {
        for (var i = 0; i <= object.likes.length; i++) {
          if (object.likes[i] === use) {
            console.log("already liking");
            t = true;
            break;
          }
        }

        if (t === false) {
          Asana.findOneAndUpdate({
            name: search
          }, {
            $push: {
              likes: use
            }
          }, function(err, docs) {
            if (err) {
              console.log(err)
            } else {
              console.log(docs.likes.length);

            }
          });

        }
      }

      Asana.findOne({
        name: search
      }, function(err, object) {
        if (err) {
          console.log(err);
        } else {
          res.send({
            count: object.likes.length
          });

        }
      });

    }
  });




});



app.post("/favourite", function(req, res) {
  var asananame = req.body.favasana;
  var r = false;
  User.findOne({
    _id: req.cookies.user._id
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      for (var i = 0; i < user.favorite.length; i++) {
        if (user.favorite[i] === asananame) {
          console.log("already exists");
          r = true;
          break;
        }
      }
      if (r === false) {
        User.findByIdAndUpdate(req.cookies.user._id, {
          $push: {
            favorite: asananame
          }
        }, function(err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("successful");
          }
        });
      }
    }
  });


});

app.post("/cancel", function(req, res) {
  var asananame = req.body.gum;
  User.findByIdAndUpdate(req.cookies.user._id, {
    $pull: {
      favorite: asananame
    }
  }, function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("successful");
    }
  });
})


app.get("/profile", function(req, res) {
  User.findOne({
    email: req.cookies.user.email
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("profile", {
        user: data
      });
    }
  });
});

//searching users
function escapeRegex(regex) {
  return regex.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.post("/search", function(req, res) {
  const reg = new RegExp(escapeRegex(req.body.user), "gi");
  User.find({
    username: reg
  }, function(err, userObjs) {
    if (err) {
      console.log(err);
    } else if (userObjs.length != 0) {
      res.send({
        users: userObjs
      });
    } else {
      User.find({
        email: reg
      }, function(err, userObjs) {
        if (err) {
          console.log(err);
        } else {
          res.send({
            users: userObjs
          });
          sent = true;
        }
      });
    }
  });
});

// for other user profile page

app.get("/prof/:userId", function(req, res) {
  let id = req.params.userId;
  if (req.params.userId === req.cookies.user._id) {
    res.redirect("/profile");
  } else {
    User.findOne({
      _id: id
    }, function(err, userObj) {
      if (err) {
        console.log(err);
      } else {
        res.render("otherprofile", {
          otheruser: userObj,
          preuser: req.cookies.user
        });
      }
    });
  }
});



app.post("/follow", function(req, res) {

  const on = req.body.othername;
  const mn = req.cookies.user.email;

  let y = false;
  let y1 = false;

  // adding the followers array in the otheruserprofile


  User.findOne({
    email: on
  }, function(err, userObj) {
    if (err) {
      console.log(err);
    } else {
      for (var i = 0; i < userObj.followers.length; i++) {
        if (userObj.followers[i] === mn) {
          y = true;
          break;
        }
      }
      if (y) {
        User.findOneAndUpdate({
          email: on
        }, {
          $pull: {
            followers: mn
          }
        }, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully unfollowed");
          }
        });
      } else {
        User.findOneAndUpdate({
          email: on
        }, {
          $push: {
            followers: mn
          }
        }, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("successful");
          }
        });
      }
    }
  });


  // adding the following array in the userprofile


  User.findOne({
    email: mn
  }, function(err, userObject) {
    if (err) {
      console.log(err);
    } else {
      for (var i = 0; i < userObject.following.length; i++) {
        if (userObject.following[i] === on) {
          y1 = true;
          break;
        }
      }
      if (y1) {
        User.findOneAndUpdate({
          email: mn
        }, {
          $pull: {
            following: on
          }
        }, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully removed from the following");
          }
        });
      } else {
        User.findOneAndUpdate({
          email: mn
        }, {
          $push: {
            following: on
          }
        }, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("successful");
          }
        });

      }
    }
  });
  User.findOne({
    email: mn
  }, function(err, userdata) {
    userdata.save();
    res.cookie("user", userdata);
  });

});


app.get("/:name/followers", function(req, res) {
  var nam = req.params.name;
  User.findOne({
    username: nam
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result.followers);
      res.render("followers", {
        object: result.followers
      });
    }
  });
});

app.get("/:name/following", function(req, res) {
  var nam = req.params.name;
  User.findOne({
    username: nam
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result.following);
      res.render("following", {
        object1: result.following
      });
    }
  });
});



app.post("/changeAvatar", function(req, res) {
  var m = req.cookies.user.email;
  var avt = req.body.avt;
  User.findOne({
    email: m
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      user.picture = avt;
      user.save();
      res.cookie("user", user);
      res.send({
        done: true
      });
    }
  });
});




// const newasana = new Asana({
//   name:"Naukaasana",
//   picture:"naukasana1",
//   benefits:"Benefits of Naukasana (Boat Pose) The health benefits of Naukasana which one would experience gradually with regular practice are as follows : Stimulates the functioning of the digestive system. Rectifies nervous disorders therefore improves the functioning of nervous system. Helpful in toning all the organs and removes lethargy.",
//   imgtype:".jfif"
// });
//    newasana.save();

// used for deleting particular element with the id//

// var id ="62e0fd666d611bfd906fdddb" ;
// Asana.findByIdAndDelete(id, function (err,successful) {
//     if (err){
//         console.log(err)
//     }
//     else{
//         console.log("Deleted : ",successful);
//     }
// });



// used for the updates in the database using the/////


//  var user_id ="62e0e8c0f37248c7651ec4ff" ;
// User.findByIdAndUpdate(user_id, { likes:[] },
//                             function (err, docs) {
//     if (err){
//         console.log(err)
//     }
//     else{
//         console.log("Updated User : ", docs);
//     }
// });

// used for removing collections in the database.////

// const conn = mongoose.createConnection('mongodb://localhost:27017/userDB');
// conn.dropCollection("comments", function(err, result) {
//   if(err){
//     console.log("error");
//   }else{
//     console.log("successful");
//   }
//   });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
