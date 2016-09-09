import {
  GET_FIREBASE_NODE,
  CREATE_FIREBASE_NODE,
  SET_FIREBASE_NODE,

  SET_CLIENT_NODE
} from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case GET_FIREBASE_NODE:
      return action.payload;
    case CREATE_FIREBASE_NODE:
      return action.payload;
    case SET_FIREBASE_NODE:
      return action.payload;
    case SET_CLIENT_NODE:
      return action.payload;

  }
  return state;
}
