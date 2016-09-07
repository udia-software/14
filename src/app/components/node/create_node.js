import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Loading from '../helpers/loading';
import {fetchUser, createNode} from '../../actions/firebase_actions';

class CreateNode extends Component {
  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.state = {
      message: '',
      // node
      author_uid: null,
      text: null,
      markdown: null,
      image: null,
      video: null,
      required_uids: null,
      linked_uids: null,
      key_node: null
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();
    var createNode = {
      author: this.props.currentUser.uid,
      text: this.state.text,
      markdown: this.state.markdown,
      image: this.state.image,
      video: this.state.video,
      required_uids: this.state.required_uids,
      linked_uids: this.state.linked_uids
    };
    this.props.createNode(createNode).then(data => {
      if (data.error)
        this.setState({message: data.payload});
      else {
        this.setState({
          message: "Updated successfully!"
        })
      }
    })
  }

  handleChangeText(event) {
    this.setState({text: event.target.value});
  }

  handleChangeMarkdown(event) {
    this.setState({markdown: event.target.value})
  }

  handleChangeImage(event) {
    this.setState({image: event.target.value});
  }

  handleChangeVideo(event) {
    this.setState({video: event.target.value});
  }

  handleChangeRequiredUIDs(event) {
    this.setState({required_uids: event.target.value});
  }

  handleChangeLinkedUIDs(event) {
    this.setState({linked_uids: event.target.value});
  }

  handleChangeKeyNode(event) {
    this.setState({key_node: event.target.value});
  }

  render() {
    console.log(this.state);
    if (!this.props.currentUser) {
      return <Loading/>
    }
    return (
      <div className="col-md-10">
        <form id="formNode" role="form" onSubmit={this.onFormSubmit}>
          <h2>Create Node</h2>
          <p>{this.state.message}</p>
          <br />
          <div className="form-group">
            <label>Text</label>
            <input type="text" className="form-control" id="text" placeholder="Perhaps a title?"
                   value={this.state.text}
                   onChange={this.handleChangeText.bind(this)}
            />
            <label>Markdown</label>
            <textarea className="form-control" id="markdown" placeholder="##Hoho, this doesn't work yet"
                      value={this.state.markdown}
                      onChange={this.handleChangeMarkdown.bind(this)}
            />
            <label>Image</label>
            <input type="text" className="form-control" id="image" placeholder="Link to an image?"
                   value={this.state.image}
                   onChange={this.handleChangeImage.bind(this)}
            />
            <label>Video</label>
            <input type="text" className="form-control" id="video" placeholder="Link to a video?"
                   value={this.state.video}
                   onChange={this.handleChangeVideo.bind(this)}
            />
          </div>
          <div className="form-group">
            <label>Required UIDs</label>
            <textarea className="form-control" id="required_uids" placeholder="Line separated UIDs"
                      value={this.state.required_uids}
                      onChange={this.handleChangeRequiredUIDs.bind(this)}
            />
          </div>
          <div className="form-group">
            <label>Linked UIDs</label>
            <textarea className="form-control" id="linked_uids" placeholder="Line separated UIDs"
                      value={this.state.linked_uids}
                      onChange={this.handleChangeLinkedUIDs.bind(this)}
            />
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
      </div>
    )
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, createNode}, dispatch);
}

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateNode);
