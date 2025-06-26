const admin = require('firebase-admin');

// Initialize your app with service account
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

// Replace with the user's UID you want to make admin or reviewer
const uid = '6COAu6Fa1TWrhIzKovGvl72G1TL2';

// Set custom claims (edit as needed)
const customClaims = {
  admin: true,      // Set to true for admin
  reviewer: false   // Set to true for reviewer, or both for both roles
};

admin.auth().setCustomUserClaims(uid, customClaims)
  .then(() => {
    console.log('Custom claims set for user', uid, customClaims);
    process.exit();
  })
  .catch(error => {
    console.error('Error setting custom claims:', error);
    process.exit(1);
  });