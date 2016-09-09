import {
  SET_CLIENT_NODE
} from './types';

export function setClientNode(node) {
  return {
    type: SET_CLIENT_NODE,
    payload: node
  }
}
