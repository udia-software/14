import firebase from 'firebase';
import {FIREBASE_CONFIG} from '../config';

export const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();

var FireBaseTools = {

  /**
   * Return an instance of a firebase auth provider based on the provider string.
   *
   * @param provider
   * @returns {firebase.auth.AuthProvider}
   */
  getProvider: (provider) => {
    switch (provider) {
      case "email":
        return new firebase.auth.EmailAuthProvider();
      case "facebook":
        return new firebase.auth.FacebookAuthProvider();
      case "github":
        return new firebase.auth.GithubAuthProvider();
      case "google":
        return new firebase.auth.GoogleAuthProvider();
      case "twitter":
        return new firebase.auth.TwitterAuthProvider();
      default:
    }
  },

  /**
   * Login with provider => p is provider "email", "facebook", "github", "google", or "twitter"
   * Uses Popup therefore provider must be an OAuth provider. EmailAuthProvider will throw an error
   *
   * @returns {any|!firebase.Thenable.<*>|firebase.Thenable<any>}
   */
  loginWithProvider: (p) => {
    let provider = FireBaseTools.getProvider(p);
    return firebaseAuth.signInWithPopup(provider).then(function (result) {
      return firebaseAuth.currentUser;
    }).catch(function (error) {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Register a user with email and password
   *
   * @param user
   * @returns {any|!firebase.Thenable.<*>|firebase.Thenable<any>}
   */
  registerUser: (user) => {
    return firebaseAuth.createUserWithEmailAndPassword(user.email, user.password).then(user => {
      return user;
    }).catch(error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Sign the user out
   *
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
  logoutUser: () => {
    return firebaseAuth.signOut().then(() => {
      return {
        success: 1,
        message: "logout"
      };
    });
  },

  /**
   * Retrieve the current user (Promise)
   * @returns {Promise}
   */
  fetchUser: () => {
    return new Promise((resolve, reject) => {
      const unsub = firebaseAuth.onAuthStateChanged(user => {
        unsub();
        resolve(user);
      }, error => {
        reject(error);
      })
    })
  },

  /**
   * Log the user in using email and password
   *
   * @param user
   * @returns {any|!firebase.Thenable.<*>|firebase.Thenable<any>}
   */
  loginUser: (user) => {
    return firebaseAuth.signInWithEmailAndPassword(user.email, user.password).then(user => {
      return user;
    }).catch(error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Update a user's profile data
   *
   * @param u
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
  updateUserProfile: (u) => {
    return firebaseAuth.currentUser.updateProfile(u).then(() => {
      return firebaseAuth.currentUser;
    }, error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    })
  },

  /**
   * Reset the password given the specified email
   *
   * @param email {string}
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
  resetPasswordEmail: (email) => {
    return firebaseAuth.sendPasswordResetEmail(email).then(() => {
      return {
        message: 'Email sent'
      }
    }, error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Update the user's password with the given password
   *
   * @param newPassword {string}
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
  changePassword: (newPassword) => {
    return firebaseAuth.currentUser.updatePassword(newPassword).then(user => {
      return user;
    }, error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Send an account email verification message for the currently logged in user
   *
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
  sendEmailVerification: () => {
    return firebaseAuth.currentUser.sendEmailVerification().then(() => {
      return {
        message: 'Email sent'
      }
    }, error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Get one Firebase node.
   *
   * @param key {string}
   * @returns {firebase.Promise<any>|!firebase.Promise.<*>}
   */
  getFirebaseNodeOnce: (key) => {
    return firebaseDb.ref('nodes').child(key).once('value',
      snapshot => {
        return snapshot.exportVal();
      }, error => {
        return {
          errorCode: error.code,
          errorMessage: error.message
        }
      })
  },

  /**
   * Create one Firebase node.
   *
   * @param node
   * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
   */
  createFirebaseNode: (node) => {
    // Get a new key for the node
    let newNodeKey = firebaseDb.ref().child('nodes').push().key;

    // Write the new node's data simultaneously in the nodes list and the user's node list.
    let updates = {};
    updates['/nodes/' + newNodeKey] = node;
    updates['/user-nodes/' + node.author + '/' + newNodeKey] = node;
    return firebaseDb.ref().update(updates).then(() => {
      return node.uid = newNodeKey;
    });
  },

  /**
   * Set one firebase node. Used for updating nodes.
   *
   * @param key {string} UID of the node to update
   * @param node {*} New node object. author, markdown, linked_nodes
   * @returns {!firebase.Promise.<void>|firebase.Promise<any>}
   */
  setFirebaseNode: (key, node) => {
    return firebaseDb.ref().child('nodes').child(key).set(node).then(() => {
      return node;
    });
  },

  /**
   * Listen to a firebase node
   *
   * @param key {string} The uid of the node
   * @param callback {function} Callback is passed a DataSnapshot.
   * @param cancelCallback {function} Optional callback for if the event is cancelled or lost
   * @param context {*} If provided, this object will be used as this when calling the callbacks.
   * @returns {function}
   */
  listenToFirebaseNode: (key, callback, cancelCallback, context) => {
    return firebaseDb.ref('nodes').child(key).on('value', callback, cancelCallback, context);
  },

  /**
   * Stop listening to a firebase node
   *
   * @param key {string} The uid of the node
   * @param callback {function} Optional, the callback function that was passed to listenToFirebaseNode
   * @param context {*} Optional, the context that was passed to listenToFirebaseNode
   * @returns {any}
   */
  stopListeningToFirebaseNode: (key, callback, context) => {
    return firebaseDb.ref('nodes').child(key).off('value', callback, context);
  }

};

export default FireBaseTools;
