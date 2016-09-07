import React from 'react';
import  {Route, IndexRoute} from 'react-router';
import App from './components/app';

import HomeIndex from './components/index_home';
import UserLogin from './components/user/login';
import UserLogout from './components/user/logout';
import UserRegister from './components/user/register';
import UserProfile from './components/user/profile';
import ResetPassword from './components/user/reset_password';

import NodesAll from './components/node/nodes_all';
import CreateNode from './components/node/create_node';
import ViewNode from './components/node/view_node';

import requireAuth from './utils/authenticated';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomeIndex}/>
    <Route path="/login" component={UserLogin}/>
    <Route path="/logout" component={UserLogout}/>
    <Route path="/register" component={UserRegister}/>
    <Route path="/reset" component={ResetPassword}/>
    <Route path="/profile" component={UserProfile} onEnter={requireAuth}/>

    <Route path="/nodes/all" component={NodesAll} onEnter={requireAuth}/>
    <Route path="/nodes/create" component={CreateNode} onEnter={requireAuth}/>
    <Route path="/nodes/:uid" component={ViewNode} onEnter={requireAuth}/>
  </Route>

);
