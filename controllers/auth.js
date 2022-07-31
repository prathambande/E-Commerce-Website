const User = require('../model/user');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res, next) => {
    //const isLoggedIn = req.get('Cookie').split(';')[0].split('=')[1] === 'true';
    //console.log(req.session.isLoggedIn);
    let message = req.flash('error');
    if(message.length == 0)message = null;
    res.render('auth/login', { pageTitle: "Login", path: '/login', errorMessage: message});
}

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true');
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email:email}).then(user => {
        if(!user){
            req.flash('error', 'invalid email or password')
            return res.redirect('/login');
        }
        bcrypt.compare(password,user.password).then(doMatch => {
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                })
            }
            req.flash('error', 'invalid email or password')
            res.redirect('/login');
        })
    })
}

exports.postLogout = (req,res,next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length == 0)message = null;
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message
    });
  };

exports.postSignup = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email: email}).then(userDoc => {
        if(userDoc){
            req.flash('error', 'email already exists');
            return res.redirect('/signup');
        }
        const hash = async() => {
            return await bcrypt.hash(password, 12);
        }

        hash().then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: {items: []}
            });
            return user.save();
        }).then(result => {
            res.redirect('/login');
        });
    }).catch(err => {
        console.log(err);
    })

}

// exports.postSignup = (req,res,next) => {
//     console.log("post Hit");
//     console.log(req.body);
// }