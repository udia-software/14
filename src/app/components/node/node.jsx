import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import firebase from '../../utils/firebase';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser}  from '../../actions/firebase_actions';
import {setClientNode} from '../../actions/client_actions';
import Loading  from '../helpers/loading';

class Node extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.state = {
      message: ''
    };
  }


  render() {
    if (!this.props.currentUser || !this.state.currentNode) {
      return <Loading/>
    }
    return (
      <div className="col-md-6">
        <h2>{this.props.params.uid}</h2>
        <p>{this.state.message}</p>
        {
          this.state.currentNode.author === this.props.currentUser.uid &&
          <p>
            <span className="glyphicons glyphicons-user">Welcome back, </span>
            <Link to={"/node/edit/" + this.props.params.uid}>{this.state.currentNode.author}</Link>
          </p>
        }
        {
          this.state.currentNode.author !== this.props.currentUser.uid &&
          <p>
            <span className="glyphicons glyphicons-user">Author: </span>
            {this.state.currentNode.author}
          </p>
        }
        <ReactMarkdown source={this.state.currentNode.markdown}/>
        <ul>
          <li><Link to="/node/-KRCsPJ0LDq9OmsVOEfT" onClick={this._linkClicked.bind(this)('-KRCsPJ0LDq90msV0Eft')}>Udia</Link></li>
          {this.state.currentNode.linked_nodes && Object.keys(this.state.currentNode.linked_nodes).map(linked_node => {
            return (
              <li key={linked_node}>
                <Link to={"/node/" + linked_node} onClick={this._linkClicked.bind(this)(linked_node)}>{linked_node}</Link>
              </li>
            )
          })}
        </ul>
        <br />
      </div>
    )
  }

  _linkClicked(event) {
    return (uid) => {
      firebase.stopListeningToFirebaseNode(this.props.params.uid, this._setNodeSnapshot, this);
      console.log(this.props.params.uid, uid);
      firebase.listenToFirebaseNode(uid, this._setNodeSnapshot, error => {
        console.error(error);
      }, this)
    }
  }

  _setNodeSnapshot(snapshot) {
    let nodeSnapshot = snapshot.exportVal();
    this.props.setClientNode(nodeSnapshot);
    // TODO: Why do I have to do this? Doesn't setClientNode do this for you? Possible bug.
    this.setState({currentNode: nodeSnapshot});
  }

  componentDidMount() {
    console.log(this.props.params.uid);
    firebase.listenToFirebaseNode(this.props.params.uid, this._setNodeSnapshot, error => {
      console.error(error);
    }, this)
  }

  componentWillUnmount() {
    firebase.stopListeningToFirebaseNode(this.props.params.uid, this._setNodeSnapshot, this);
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, setClientNode}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser, currentNode: state.currentNode};
}


export default connect(mapStateToProps, mapDispatchToProps)(Node);
