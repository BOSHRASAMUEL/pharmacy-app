const bcrypt = require('bcrypt');
const password = "25328";

bcrypt.hash(password, 10, (err, hash) => {
    console.log("الـ Hash بتاعك:");
    console.log(hash);
});