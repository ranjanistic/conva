import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {get} from "../../paths/get";

const MeetRoute = ({ component: Component, auth, room, meet, ...rest }) => { 
  return (
  <Route
    {...rest}
    render={props =>
      (auth.isAuthenticated && room._id && meet.active)? (
        <Component {...props} />
      ) : (
        <Redirect to={get.DASHBOARD} />
      )
    }
  />
)};
MeetRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  meet: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,
  room: state.room,
  meet: state.meet
});

export default connect(mapStateToProps)(MeetRoute);