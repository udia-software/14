import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, getFirebaseNode, setFirebaseNode}  from '../../actions/firebase_actions';
import Loading  from '../helpers/loading';

class EditNode extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.props.getFirebaseNode(this.props.params.uid).then(result => {
      let editNode = result.payload.exportVal();
      this.setState({markdown: editNode.markdown});
      this.setState({originalAuthor: editNode.author});
      let linked_nodes = Object.keys(editNode.linked_nodes).join('\n');
      this.setState({linked_nodes: linked_nodes});
    });
    this.state = {
      message: '',
      markdown: '',
      originalAuthor: '',
      linked_nodes: ''
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();
    var markdown = this.refs.markdown.value;
    var raw_links = this.refs.linked_nodes.value;
    var linked_nodes = {};
    raw_links.split('\n').map(node => {
      if (node) {
        linked_nodes[node] = true
      }
    });
    console.log(linked_nodes);
    // probably going to have to parse this better
    this.props.setFirebaseNode(this.props.params.uid, {
      author: this.props.currentUser.uid,
      markdown: markdown,
      linked_nodes: linked_nodes
    }).then(data => {
        if (data.payload.errorCode)
          this.setState({message: data.payload.errorMessage});
        else
          browserHistory.push('/node/' + this.props.params.uid);
      }
    )
  }

  handleChangeMarkdown(event) {
    this.setState({markdown: event.target.value});
  }

  handleChangeLinkedNodes(event) {
    this.setState({linked_nodes: event.target.value});
  }

  render() {
    if (!this.props.currentUser) {
      return <Loading/>
    }

    return (
      <div className="col-md-6">

        {this.state.originalAuthor !== '' && this.state.originalAuthor !== this.props.currentUser.uid &&
        <div className="alert alert-danger">
          <h4>
            Ha ha ha. So you have discovered that you can edit any node.
            This is intentional. I will know. You signed in with your account.

            What you decide to do is up to you.
          </h4>
        </div>}

        <form id="frmProfile" role="form" onSubmit={this.onFormSubmit}>
          <h2>Editing {this.props.params.uid}</h2>
          <p>{this.state.message}</p>
          <br />
          <div className="form-group">
            <label htmlFor="markdown">Markdown: </label>
            <textarea className="form-control" id="markdown" ref="markdown" placeholder="Enter Markdown Text"
                      name="markdown" onChange={this.handleChangeMarkdown.bind(this)}
                      value={this.state.markdown}/>
            <p className="help-block">Markdown. Reddit/Medium stuff.</p>
          </div>
          <ReactMarkdown source={this.state.markdown}/>
          <div className="form-group">
            <label htmlFor="linked_nodes">Linked Nodes: </label>
            <textarea value={this.state.linked_nodes} onChange={this.handleChangeLinkedNodes.bind(this)}
                      className="form-control" ref="linked_nodes" id="linked_nodes" placeholder="Linked Nodes"
                      name="linked_nodes"/>
            <p className="help-block">Raw node keys. Separate by new line.
              Entering bad ids is fine, nothing will break.</p>

          </div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    )
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, getFirebaseNode, setFirebaseNode}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser, currentNode: state.currentNode};
}


export default connect(mapStateToProps, mapDispatchToProps)(EditNode);
