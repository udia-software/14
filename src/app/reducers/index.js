import {combineReducers} from 'redux';
import FireBaseUserReducer from './firebase_user_reducer';
import FireBaseNodeReducer from './firebase_node_reducer';

const rootReducer = combineReducers({
  currentUser: FireBaseUserReducer,
  currentNode: FireBaseNodeReducer
});

export default rootReducer;
