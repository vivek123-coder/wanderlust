const User = require("../models/user");

module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to wanderlust");
            return res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome to wanderlust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
};

module.exports.logout =  (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next();
        }
        req.flash("success", "Welcome to wanderlust! You are logged in!");
        return res.redirect("/listings");
    })
};