const adminName = 'admin';
const adminPassword = '$2b$12$UzgN17FxHK0Vye5XpwfIQOKqr7X6fNVMhUGQIvAF9HMuJlxpum146';
//const adminPassword = 'admin123';


const bcrypt = require('bcrypt');
const saltRounds = 12;

/*

bcrypt.hash(adminPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Your bcrypt hash is:", hash);
  }
});

*/

module.exports = {
  adminName,
  adminPassword
};