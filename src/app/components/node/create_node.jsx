import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, createFirebaseNode}  from '../../actions/firebase_actions';
import Loading  from '../helpers/loading';

class CreateNode extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.state = {
      message: '',
      markdown: ''
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
    // probably going to have to parse this better
    this.props.createFirebaseNode({
      author: this.props.currentUser.uid,
      markdown: markdown,
      linked_nodes: linked_nodes
    }).then(data => {
        if (data.payload.errorCode)
          this.setState({message: data.payload.errorMessage});
        else
          browserHistory.push('/node/' + data.uid);
      }
    )
  }

  handleChangeMarkdown(event) {
    this.setState({markdown: event.target.value});
  }

  render() {
    if (!this.props.currentUser) {
      return <Loading/>
    }

    return (
      <div className="col-md-6">
        <form id="frmProfile" role="form" onSubmit={this.onFormSubmit}>
          <h2>Create Node</h2>
          <p>{this.state.message}</p>
          <br />
          <div className="form-group">
            <label htmlFor="markdown">Markdown: </label>
            <textarea className="form-control" id="markdown" ref="markdown" placeholder="Enter Markdown Text"
                      name="markdown" value={this.state.markdown} onChange={this.handleChangeMarkdown.bind(this)}/>
            <p className="help-block">Markdown. Reddit/Medium stuff.</p>
          </div>
          <ReactMarkdown source={this.state.markdown}/>
          <div className="form-group">
            <label htmlFor="linked_nodes">Linked Nodes: </label>
            <textarea defaultValue="-KRCsPJ0LDq9OmsVOEfT"
                      className="form-control" ref="linked_nodes" id="linked_nodes" placeholder="Linked Nodes"
                      name="linked_nodes"/>
            <p className="help-block">Raw node keys. Separate by new line.
              Entering bad ids is fine, nothing will break.</p>

          </div>
          <button type="submit" className="btn btn-primary">Create</button>
        </form>
      </div>
    )
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, createFirebaseNode}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser, currentNode: state.currentNode};
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateNode);
