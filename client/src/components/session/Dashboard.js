import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { createRoom,enterRoom } from "../../actions/roomActions";
import { actions } from "../elements/Elements";
import classnames from "classnames";

import {
  inputType,
  validateTextField,
  getErrorByType,
  filterRoomCreateData,
  filterKeys,
} from "../../actions/validator";

import { get } from "../../paths/get";

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
    };
    
  }

  componentDidMount(){
    console.log(this.props);
    // const {meet} = this.props;
    // if (meet.isActive) {
    //   return refer(`${get.MEET.room(meet.roomid)}`);
    // }
    this.setState({rooms:{}})
    // console.log("here");
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    const { event,room } = nextProps;
    this.setState({ errors: event.loading?{}:filterKeys(event.errors), loading: event.loading });
    if (event.loading&&room.id) {
      return this.props.history.push(`${get.room.self(room.id)}`);
    }
  }

  getInputFields(errors, disabled = false) {
    let inputfields = [];
    Object.keys(this.state).forEach((key, k) => {
      if (k < this.inputs.length) {
        inputfields.push(
          <div className="w3-col w3-half w3-padding input-field" key={key}>
            <input
              onChange={this.onChange}
              value={this.state[key]}
              error={errors[this.inputs[k].type]}
              id={key}
              type={this.inputs[k].type}
              disabled={disabled}
              autoFocus={k === 0}
              autoComplete={this.inputs[k].autocomp}
              className={classnames("", {
                invalid: errors[key],
              })}
            />
            <label htmlFor={key} className="w3-padding">
              {this.inputs[k].caption}
            </label>
            <span className="red-text">{errors[key]}</span>
          </div>
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

  onJoinClick=(e)=>{
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
  }

  getRoomsList(rooms=[]){
    if (!rooms.length) return <div className="w3-center w3-jumbo w3-padding w3-text-gray" style={{ marginTop:"30vh"}}>No rooms yet.</div>;
    rooms.forEach((room, r) => {
      <div className="btn waves-effect w3-row w3-margin" key={r}>
        <div className="w3-row">{room.title}</div>
      </div>;
    });
  }

  render() {
    const {user} = this.props.auth,
      { loading, rooms, errors} = this.state;
    return (
      <div className="w3-row">
        <div className="w3-col w3-twothird secondary z-depth-4" style={{ padding:"8rem 4rem" }}>
          <div className="w3-row w3-padding" id="navbar">
            <Link to={get.ROOT}>
              <span className="btn-flat waves-effect">
                <i className="material-icons left">home</i> Home
              </span>
            </Link>
            <span className="w3-right">
              <Link to={get.ACCOUNT}>
                <span title="Account" className="btn-flat blue white-text waves-effect waves-light">
                  <i className="material-icons">manage_accounts</i>
                </span>
              </Link>
              <span title="Logout" className="btn-flat red white-text waves-effect waves-light" onClick={this.onLogoutClick}>
                <i className="material-icons">logout</i>
              </span>
            </span>
          </div>
          <div className="w3-row w3-padding">
            <h4>
              Welcome, {user.username.split(" ")[0]}.
            </h4>
            <br/>
            <p className="grey-text text-darken-1">
              Create a new room by setting a title below. Or view any of your existing rooms from the list.
            </p>
          </div>
          <form className="w3-row">
            {this.getInputFields(errors,loading)}
            <div className="w3-row w3-padding" id="actions">
              {actions(loading, {
                name: "Create Room",
                onclick:this.onJoinClick,
              })}
            </div>
          </form>
        </div>
        <div className="w3-col w3-third w3-padding primary" style={{height:"100vh"}}>
          {this.getRoomsList(rooms)}
        </div>
        <div id="dialog">
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  event: state.event,
  room: state.room,
  meet: state.meet
});

export default connect(mapStateToProps, { logoutUser, createRoom, enterRoom})(Dashboard);
