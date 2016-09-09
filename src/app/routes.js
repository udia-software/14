import React from 'react';
import  {Route, IndexRoute} from 'react-router';
import App from './components/app';

import HomeIndex from './components/index_home';
import UserLogin from './components/user/login';
import UserLogout from './components/user/logout';
import UserRegister from './components/user/register';
import UserProfile from './components/user/profile';
import ResetPassword from './components/user/reset_password';

import CreateNode from './components/node/create_node';
import EditNode from './components/node/edit_node';
import Node from './components/node/node';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomeIndex}/>
    <Route path="/login" component={UserLogin}/>
    <Route path="/logout" component={UserLogout}/>
    <Route path="/register" component={UserRegister}/>
    <Route path="/reset" component={ResetPassword}/>
    <Route path="/profile" component={UserProfile}/>

    <Route path="/node/create" component={CreateNode}/>
    <Route path="/node/:uid" component={Node}/>
    <Route path="/node/edit/:uid" component={EditNode}/>
  </Route>

);
