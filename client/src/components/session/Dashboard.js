import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { createRoom, enterRoom, getRooms } from "../../actions/roomActions";
import { Actions } from "../elements/Actions";

import {
  inputType,
  validateTextField,
  getErrorByType,
  filterRoomCreateData,
  filterKeys,
  validRoomCreateData,
} from "../../utils/validator";

import { get } from "../../paths/get";
import { Loading } from "../elements/Loader";
import { Input } from "../elements/Input";

class Dashboard extends Component {
  constructor() {
    super();
    this.inputs = [
      {
        stateprop: inputType.title,
        caption: "New room title",
        autocomp: inputType.text,
        type: inputType.text,
      },
    ];
    this.state = {
      [this.inputs[0].stateprop]: "",
      user: {},
      rooms: [],
      errors: {},
      loading: false,
      roomsloading: true,
    };
  }

  componentDidUpdate(props, state) {}

  componentDidMount(prevState) {
    console.log(this.props);
    console.log(prevState);
    if(!this.props.auth.user.verified){
      return this.props.history.push(get.auth.VERIFY);
    }
    if(this.props.auth.user.temp){
      return this.props.logoutUser();
    }
    this.setState({ ...this.state, loading: false, roomsloading: true });
    this.props.getRooms();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps);
    console.log(prevState);
    const { event, room, data } = nextProps;
    if (
      Object.keys(filterKeys(event.errors)).length &&
      !validRoomCreateData(filterRoomCreateData(prevState)).isValid
    ) {
      return {
        errors: event.loading ? {} : filterKeys(event.errors),
        loading: event.loading,
      };
    }
    if (event.loading && room._id) {
      nextProps.history.push(`${get.room.self(room._id)}`);
      return null;
    }
    console.log("data",data.rooms);
    return { ...prevState, roomsloading: false, errors: {}, rooms: data.rooms };
  }

  getInputFields(errors, disabled = false) {
    let inputfields = [];
    Object.keys(this.state).forEach((key, k) => {
      if (k < this.inputs.length) {
        inputfields.push(
          Input({
            id:key,
            value:this.state[key],
            type:this.inputs[k].type,
            caption:this.inputs[k].caption,
            error:errors[key],
            disabled:disabled,
            onChange:this.onChange,
            autocomp:this.inputs[k].autocomp,
            autoFocus:k === 0,
            classnames:"w3-half"
          })
        );
      }
    });
    return inputfields;
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value, errors: {} });
    validateTextField(
      e.target,
      () => {
        this.setState({
          [e.target.id]: e.target.value,
          errors: {
            [e.target.id]: getErrorByType(
              this.inputs.find((ip) => ip.stateprop === e.target.id).stateprop
            ),
          },
        });
      },
      e.target.type,
      () => {
        this.setState({ [e.target.id]: e.target.value, errors: {} });
      }
    );
  };

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  enterRoom = (e)=>{
    e.preventDefault();
    console.log(e.target.parentNode.id)
    this.props.enterRoom(e.target.parentNode.id)
  }

  onCreateRoomClick = (e) => {
    e.preventDefault();
    this.setState({
      [this.inputs[0].stateprop]: document
        .getElementById(this.inputs[0].stateprop)
        .value.trim(),
      loading: true,
      errors: {},
    });
    console.log(this.state);
    this.props.createRoom(filterRoomCreateData(this.state));
  };

  getRoomsList(loading, rooms = []) {
    if (!rooms.length || loading)
      return (
        <div
          className="w3-center w3-jumbo w3-padding w3-text-gray"
          style={{ marginTop: "30vh" }}
        >
          {loading ? "No rooms yet.":Loading(120)}
        </div>
      );
    let roombtns = [];
    rooms.forEach((room, r) => {
      roombtns.push(
        <div className="w3-padding" key={r}>
          <div className="w3-row btn-flat secondary waves-effect" id={room._id} style={{ width: "100%" }} onClick={this.enterRoom}>
            <div className="w3-row">{room.title}</div>
          </div>
        </div>
      );
    });
    return roombtns;
  }

  render() {
    const { user } = this.props.auth,
      { loading, rooms, errors, roomsloading } = this.state;
    console.log(roomsloading);
    return (
      <div className="w3-row">
        <div
          className="w3-col w3-twothird secondary z-depth-4"
          style={{ padding: "8rem 4rem" }}
        >
          <div className="w3-row w3-padding" id="navbar">
            <Link to={get.ROOT}>
              <span className="btn-flat waves-effect">
                <i className="material-icons left">home</i> Home
              </span>
            </Link>
            <span className="w3-right">
              <Link to={get.ACCOUNT}>
                <span
                  title="Account"
                  className="btn-flat blue white-text waves-effect waves-light"
                >
                  <i className="material-icons">manage_accounts</i>
                </span>
              </Link>
              <span
                title="Logout"
                className="btn-flat red white-text waves-effect waves-light"
                onClick={this.onLogoutClick}
              >
                <i className="material-icons">logout</i>
              </span>
            </span>
          </div>
          <div className="w3-row w3-padding">
            <h4>Welcome, {user.username.split(" ")[0]}.</h4>
            <br />
            <p className="grey-text text-darken-1">
              Create a new room by setting a title below. Or view any of your
              existing rooms from the list.
            </p>
          </div>
          <form className="w3-row">
            {this.getInputFields(errors, loading)}
            <div className="w3-row w3-padding" id="actions">
              {Actions(loading, {
                name: "Create Room",
                onclick: this.onCreateRoomClick,
              })}
            </div>
          </form>
        </div>
        <div
          className="w3-col w3-third w3-padding primary"
          style={{ height: "100vh" }}
        >
          {this.getRoomsList(roomsloading, rooms)}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  createRoom: PropTypes.func.isRequired,
  enterRoom: PropTypes.func.isRequired,
  getRooms: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  event: state.event,
  room: state.room,
  meet: state.meet,
  data: state.data,
});

export default connect(mapStateToProps, {
  logoutUser,
  createRoom,
  enterRoom,
  getRooms,
})(Dashboard);
