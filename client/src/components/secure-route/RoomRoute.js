import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {get} from "../../paths/get";

const RoomRoute = ({ component: Component, auth, room, ...rest }) => { 
  return (
  <Route
    {...rest}
    render={props =>
      (auth.isAuthenticated && room._id)? (
        <Component {...props} />
      ) : (
        <Redirect to={get.DASHBOARD} />
      )
    }
  />
)};
RoomRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  room: state.room
});
export default connect(mapStateToProps)(RoomRoute);