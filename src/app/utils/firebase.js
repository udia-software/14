import 'firebase'
import {
  FIREBASE_CONFIG
} from '../config';
import {
  currentUserPromise,
  fetchUserObject
} from './localstorage';

// You can remove it
if (FIREBASE_CONFIG.apiKey.length < 1) {
  alert("Please fill your Firebase settings to config.js ");
}

export const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();

// FIREBASE TOOL OBJECT LITERAL
var FireBaseTools = {

  getProvider: (provider) => {

    switch (provider) {
      case "facebook":
        return new firebase.auth.FacebookAuthProvider();
        break;
      case "google":
        return new firebase.auth.GoogleAuthProvider();
        break;
      default:

    }
  },
  // Login with provider => p is provider "facebook" or "google"
  loginWithProvider: (p) => {

    var provider = FireBaseTools.getProvider(p);
    return firebaseAuth.signInWithPopup(provider).then(function (result) {

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // save user to localstorage
      return fetchUserObject(user).then(user => {
        return user;
      })


    }).catch(function (error) {

      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;

      return {
        errorCode: error.code,
        errorMessage: error.message
      }

    });

  },
  registerUser: (user) => {

    return firebaseAuth.createUserWithEmailAndPassword(user.email, user.password).then(user => {

      return fetchUserObject(user).then(user => {
        return user;
      })

    }).catch(error => {

      return {
        errorCode: error.code,
        errorMessage: error.message
      }

    });

  },
  logoutUser: (user) => {

    return firebaseAuth.signOut().then(function () {
      // Sign-out successful and clear data.
      localStorage.clear();
      return {
        success: 1,
        message: "logout"
      };
    });
  },
  fetchUser: () => {

    return new Promise((resolve, reject) => {
      currentUserPromise().then(user => {
        if (user) {
          resolve(user)
        }
      });

      firebaseAuth.onAuthStateChanged(user => {
        //resolve(firebase.auth().currentUser);
        if (user) {
          fetchUserObject(firebase.auth().currentUser).then(user => {
            resolve(user);
          })
        } else {
          resolve(null)
        }
      });
    });

  },
  loginUser: (user) => {

    return firebaseAuth.signInWithEmailAndPassword(user.email, user.password).then(user => {
      // save user to localstorage
      return fetchUserObject(user).then(user => {
        return user;
      })

    }).catch(error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }

    });
  },
  updateUser: (u) => {

    if (firebaseAuth.currentUser) {
      var user = firebaseAuth.currentUser;
      return user.updateProfile({
        displayName: u.displayName,
        photoUrl: '' // field for photo url
      }).then(data => {

        // renew user
        return fetchUserObject(firebase.auth().currentUser).then(user => {
          return user;
        })

      }, error => {
        return {
          errorCode: error.code,
          errorMessage: error.message
        }
      })
    } else {
      return null;
    }


  },
  resetPasswordEmail: (email) => {

    return firebaseAuth.sendPasswordResetEmail(email).then((data) => {
      return {
        message: 'Email sent',
        errorCode: null
      }
    }, error => {
      // An error happened.
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });

  },
  changePassword: (newPassword) => {

    return firebaseAuth.currentUser.updatePassword(newPassword).then(() => {
      return fetchUserObject(user).then(user => {
        return user;
      })

    }, error => {

      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });

  },
  // CRUD INTERACTIONS WITH NODES
  /*
   * uid: {
   *   author: $user_uid
   *   text: ''
   *   markdown: ''
   *   image: ''
   *   video: ''
   *   required_uids: [ $node_uid ]
   *   linked_uids: [ $node_uid ]
   *   key_node: $boolean
   * }
   *
   */
  getNodes: () => {
    return new Promise((resolve, reject) => {
      firebaseDb.ref('nodes').on('value', snapshot => {
        resolve(snapshot.val());
      }, error => {
        reject({
          errorCode: error.code,
          errorMessage: error.message
        })
      })
    });
  },
  createNode: (node) => {
    return new Promise((resolve, reject) => {
      let newNodeKey = firebaseDb.ref('nodes').push().key;
      let updates = {};
      updates['/nodes/' + newNodeKey] = node;
      updates['/user_nodes/' + node.author + '/' + newNodeKey] = node;
      resolve(firebaseDb.ref().update(updates));
    })
  },
  getNode: (uid) => {
    return new Promise((resolve, reject) => {
      firebaseDb.ref('nodes/' + uid).on('value', snapshot => {
        resolve(snapshot.val());
      }, error => {
        reject({
          errorCode: error.code,
          errorMessage: error.message
        })
      })
    });
  }
};

export default FireBaseTools;
