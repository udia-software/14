import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser, createNode}  from '../../actions/firebase_actions';
import Loading  from '../helpers/loading';
import ReactMarkdown from 'react-markdown';

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

  /**
   * Convert a new line separated string into an object where the key is the string, with true
   * @param someString
   * @returns {*}
   * @private
   */
  static _convertNewLineSeparatedToObjKeys(someString) {
    if ('' + someString) {
      let objKeys = {};
      let all_ids = ('' + someString).split('\n');
      for (let i = 0; i < all_ids.length; i++) {
        objKeys[all_ids[i]] = true;
      }
      return objKeys;
    }
    return {};
  }

  onFormSubmit(event) {
    event.preventDefault();
    // New line separated, convert to {$uid: true}
    let linked_nodes = CreateNode._convertNewLineSeparatedToObjKeys(this.refs.linked_nodes.value);
    let required_nodes = CreateNode._convertNewLineSeparatedToObjKeys(this.refs.required_nodes.value);
    let markdown = this.refs.markdown.value;
    let author = this.props.currentUser.uid;
    this.props.createNode({
      author: author,
      markdown: markdown,
      linked_nodes: linked_nodes,
      required_nodes: required_nodes
    }).then(data => {
        console.log(data);
        if (data.payload.errorCode)
          this.setState({message: data.payload.errorMessage})
        else
          this.setState({
            message: "Updated successfuly!"
          })
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
        <form id="formNode" role="form" onSubmit={this.onFormSubmit}>
          <h2>Create New Node</h2>
          <p>{this.state.message}</p>
          <br />
          <div className="form-group">
            <label htmlFor="linked_nodes">Linked Nodes: </label>
            <textarea className="form-control" id="linked_nodes"
                      ref="linked_nodes" placeholder="New line separated" name="linked_nodes"/>
          </div>
          <div className="form-group">
            <label htmlFor="required_nodes">Required Nodes: </label>
            <textarea className="form-control" id="required_nodes"
                      ref="required_nodes" placeholder="New line separated" name="required_nodes"/>
          </div>
          <div className="form-group">
            <label htmlFor="markdown">Markdown: </label>
            <textarea className="form-control" id="markdown"
                      ref="markdown" placeholder="Enter your markdown here." name="markdown"
                      value={this.state.markdown} onChange={this.handleChangeMarkdown.bind(this)}
            />
          </div>
          <ReactMarkdown source={this.state.markdown}/>
          <button type="submit" className="btn btn-primary">Create Node</button>
        </form>
      </div>
    )
  }

}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, createNode}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateNode);
