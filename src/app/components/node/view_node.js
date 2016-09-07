import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, getNode} from '../../actions/firebase_actions';
import Loading from '../helpers/loading';

class ViewNode extends Component {
  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.state = {
      message: ''
    };
    this.uid = '';

    this.props.getNode(this.props.params.uid).then(node => {
      this.uid = this.props.params.uid;
      let state = {};
      state[this.uid] = node.payload;
      this.setState(state);
    }).catch(error => {
      this.setState({message: error.errorMessage});
    });
  }

  render() {
    if (!this.props.currentUser) {
      return <Loading/>
    }
    console.log(this.state)
    return (
      <div className="col-md-10">
        <h4>{this.props.params.uid}</h4>
        <p>{this.state.message}</p>
        <p>{this.state[this.uid] && "ugh!" || "no node here"}</p>
        <p>{this.state[this.uid].text || "no text"}</p>
        <p>{this.state[this.uid].markdown || "no markdown"}</p>
        <p>{this.state[this.uid].image || "no image"}</p>
        <p>{this.state[this.uid].video || "no video"}</p>
        <p>Nodes Required to access this node</p>
        {
          (this.state[this.uid]['required_uids'] &&
          this.state[this.uid]['required_uids'].split("\n").map(node => {
            return (
              <Link key={node} to={"/nodes/" + node }>{node}</Link>
            )
          }) || <p>no required nodes</p>)
        }
        <p>Child Nodes</p>
        {
          (this.state[this.uid]['linked_uids'] &&
          this.state[this.uid]['linked_uids'].split("\n").map(node => {
            return (
              <Link key={node} to={"/nodes" + node}>{node}</Link>
            )
          })  || <p>no child_nodes</p>)
        }
        <p>{this.state[this.uid]['key_node'] || "false"}</p>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, getNode}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewNode);