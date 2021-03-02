import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class People extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return <div>People here!</div>;
  }
}

People.propTypes = {
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  room: state.room,
});
export default connect(mapStateToProps)(People);
