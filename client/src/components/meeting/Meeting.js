import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { leaveMeeting } from "../../actions/meetActions";

class Meeting extends Component {
  onLeaveClick = (e) => {
    e.preventDefault();
    this.props.leaveMeeting();
  };
  componentWillReceiveProps(nextProps) {
    if (!nextProps.meet.isActive) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }
  render() {
    const { user } = this.props.auth;
    // const { meet } = this.props;
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              In Meeting room as {user.name}
            </h4>
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem",
              }}
              onClick={this.onLeaveClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Meeting.propTypes = {
  leaveMeeting: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  meet:PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  meet: state.meet
});
export default connect(mapStateToProps, { leaveMeeting })(Meeting);
