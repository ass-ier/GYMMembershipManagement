const bcrypt = require('bcrypt');

const hashedPassword = '$2a$10$4ahwPDvG0FVjf2y4254pbubi98x.GOoigmteu9vtR.iA/vLDqJNeC'; // your hash from DB
const plainPassword = 'Manager123'; // password you want to test

bcrypt.compare(plainPassword, hashedPassword).then(result => {
  console.log('Password match?', result); // should print true or false
});
