import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Loading  from '../helpers/loading';
import {fetchUser, getNodes} from '../../actions/firebase_actions';


/**
 * Get all of the nodes. ALL of them.
 */
class NodesAll extends Component {

  constructor(props) {
    super(props);
    this.props.fetchUser();
    this.state = {
      message: '',
      nodes: []
    };
  }

  render() {
    if (!this.props.currentUser) {
      return <Loading/>
    }
    return (
      <div className="col-md-10">
        <h4>All Nodes Loaded</h4>
        {Object.keys(this.state.nodes).map(key => {
          let node = this.state.nodes[key];
          return (
            <div key={key} className="panel panel-default">
              <div className="panel-heading">
                <Link to={"/nodes/" + key}>{key}</Link>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  componentDidMount() {
    this.props.getNodes().then(nodes => {
      this.setState({'nodes': nodes.payload});
    }).catch(error => {
      this.setState({message: error.errorMessage});
    });
  }

  componentWillUnmount() {

  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUser, getNodes}, dispatch);
}


function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}


export default connect(mapStateToProps, mapDispatchToProps)(NodesAll);
