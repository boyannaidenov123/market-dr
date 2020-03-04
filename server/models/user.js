const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var nodemailer = require('nodemailer');


const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    isTrader: {
        type: Boolean,
        require: true
    },
    admin: {
        type: Boolean,
        require: true,
        default: false
    },
    confirmationCode: {
        type: String,
    },
    authenticated: {
        type: Boolean,
        required: true
    }
});

userSchema.methods.generateConfirmationCode = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    this.confirmationCode = text;
    this.save();
}

userSchema.methods.sendEmail = function (options) {
    async function main(user) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'flowermarket67@gmail.com',
                pass: 'asdfasdf03'
            },
        });
        let info = await transporter.sendMail({
            from: "Flower Market",
            to: user.email,
            subject: options.subject,
            text: options.text
        });
        console.log("Message sent to " + user.name);
    }
    main(this, function () {

    }).catch(console.error);
}

userSchema.methods.sendConfirmationCode = function () {
    this.generateConfirmationCode();
    var options = {
        subject: "Verification of your email adress",
        text:
            `        
          Wellcome ${this.name},
          You have just registered at flowerMarket.com with the email <${this.email}> ,
          if this was not you please ignore this mail. Otherwise we have send you a 
          vericication code down below which you have to use in order to get access to 
          your account.
          
          code: ${this.confirmationCode}`
    }
    console.log(options.text);
    this.sendEmail(options, function () {
        
    });
};

userSchema.methods.getAccess = function (code, callback) {
    if (code == this.confirmationCode) {
        this.authenticated = true;
        this.confirmationCode = '';
        this.save(function () {
            callback(true);
        });
    } else {
        callback(false);
    }
}

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);