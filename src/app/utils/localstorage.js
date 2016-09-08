/**
 * Save the Firebase user object to local storage. Then return the user.
 * @param obj
 * @returns {Promise}
 */
export function persistUserObject(obj) {
  return new Promise((resolve, reject) => {
    try {
      let user = {
        'email': obj.email,
        'uid': obj.uid,
        'u': obj.u,
        'displayName': obj.displayName,
        'refreshToken': obj.refreshToken,
        'emailVerified': obj.emailVerified,
        'isAnonymous': obj.isAnonymous,
        'photoUrl': obj.photoUrl
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      let userObject = localStorage.getItem('currentUser');
      resolve(JSON.parse(userObject));
    } catch (e) {
      reject(e);
    }
  })
}

/**
 * Get the current Firebase user from local storage as a promise.
 * @returns {Promise}
 */
export function currentUserPromise() {
  return new Promise((resolve, reject) => {
    try {
      let userObject = localStorage.getItem('currentUser');
      resolve(JSON.parse(userObject));
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Get the current Firebase user from local storage synchronously.
 */
export function currentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}
