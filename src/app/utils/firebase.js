import 'firebase'
import {
  FIREBASE_CONFIG
} from '../config';
import {
  currentUserPromise,
  persistUserObject
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
  /**
   * Login with provider => p is provider "facebook" or "google"
   * Return the user when done
   * @param p
   * @returns {firebase.Thenable<any>|any|!firebase.Thenable.<*>}
   */
  loginWithProvider: (p) => {
    var provider = FireBaseTools.getProvider(p);
    return firebaseAuth.signInWithPopup(provider).then(function (result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // save user to localstorage
      return persistUserObject(user).then(user => {
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

  /**
   * Register a user (with email and password) and persist the user object
   * Return the user when done
   * @param user (only email and password attributes)
   * @returns {firebase.Thenable<any>|any|!firebase.Thenable.<*>}
   */
  registerUser: (user) => {
    return firebaseAuth.createUserWithEmailAndPassword(user.email, user.password).then(user => {
      return persistUserObject(user).then(user => {
        return user;
      })
    }).catch(error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Log the user out, clear data
   * @param user
   * @returns {!firebase.Promise.<*>}
   */
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

  /**
   * Get the current user (as a promise)
   * @returns {Promise}
   */
  fetchUser: () => {
    return new Promise((resolve, reject) => {
      currentUserPromise().then(user => {
        if (user)
          resolve(user)
      });

      firebaseAuth.onAuthStateChanged(
        user => {
          // Why is this commented? Why can't I just use that?
          // resolve(firebase.auth().currentUser);
          if (user) {
            persistUserObject(firebase.auth().currentUser).then(user => {
              resolve(user);
            })
          } else {
            resolve(null)
          }
        },
        error => {
          reject(error)
        });
    });

  },

  /**
   * Login the user, then return the user. Or throw an error if the login fails
   * @param user
   * @returns {firebase.Thenable<any>|any|!firebase.Thenable.<*>}
   */
  loginUser: (user) => {
    return firebaseAuth.signInWithEmailAndPassword(user.email, user.password).then(user => {
      // save user to localstorage
      return persistUserObject(user).then(user => {
        return user;
      });
    }).catch(error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Update the user display name, or photo URL
   * @param u
   * @returns {*}
   */
  updateUser: (u) => {
    if (firebaseAuth.currentUser) {
      var user = firebaseAuth.currentUser;
      return user.updateProfile({
        displayName: u.displayName,
        photoUrl: '' // field for photo url
      }).then(data => {
        // renew user
        return persistUserObject(firebase.auth().currentUser).then(user => {
          return user;
        })
      }, error => {
        return {
          errorCode: error.code,
          errorMessage: error.message
        }
      })
    }
    // Not logged in, nothing to update
    console.warn('Not logged in, nothing to update!');
    return null;
  },

  /**
   * Reset the user password by Email
   * @param email
   * @returns {!firebase.Promise.<*>}
   */
  resetPasswordEmail: (email) => {
    return firebaseAuth.sendPasswordResetEmail(email).then(data => {
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

  /**
   * Change the user password
   * @param newPassword
   * @returns {!firebase.Promise.<*>}
   */
  changePassword: (newPassword) => {
    return firebaseAuth.currentUser.updatePassword(newPassword).then(() => {
      return persistUserObject(user).then(user => {
        return user;
      })
    }, error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Create a new node, return the generated ID for the node
   * @param node
   * @returns {Promise}
   */
  createNode: (node) => {
    return new Promise((resolve, reject) => {
      try {
        // Missing certain fields
        if (!node || !node.author || !node.markdown || !node.linked_nodes || !node.required_nodes) {
          reject({
            errorCode: 1,
            errorMessage: 'Node object missing fields'
          })
        } else {
          let authorKey = node.author;
          let newNodeKey = firebaseDb.ref().child('nodes').push().key;
          var updates = {};
          updates['/nodes/' + newNodeKey] = node;
          updates['/node_history/' + newNodeKey] = {
            editor: authorKey,
            timestamp: 0, //timestamp
            node: node
          };
          updates['/user/' + authorKey + '/created/' + newNodeKey] = true;
          firebase.database().ref().update(updates);
          resolve(newNodeKey);
        }
      }
      catch (e) {
        reject(e);
      }
    });
  }
};

export default FireBaseTools;
