import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { createRoom, enterRoom, getRooms } from "../../actions/roomActions";
import { Actions } from "../elements/Actions";
import classnames from "classnames";

import {
  inputType,
  validateTextField,
  getErrorByType,
  filterRoomCreateData,
  filterKeys,
  validRoomCreateData,
} from "../../actions/validator";

import { get } from "../../paths/get";
import { Loading } from "../elements/Loader";

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
      roomsloading:true,
    };
    
  }

  componentDidUpdate(props,state){
    
  }

  componentDidMount(prevState){
    console.log(this.props);
    console.log(prevState);
    this.setState({...this.state,loading:false,roomsloading:true})
    this.props.getRooms();
  }

  static getDerivedStateFromProps(nextProps, prevState) { 
    console.log(nextProps);
    console.log(prevState);
    const {event,room,data} = nextProps;
    console.log(Object.keys(filterKeys(event.errors)).length)
    console.log(validRoomCreateData(filterRoomCreateData(prevState)))
    if(Object.keys(filterKeys(event.errors)).length&&!validRoomCreateData(filterRoomCreateData(prevState)).isValid){
      console.log('errors')
      return ({ errors: event.loading?{}:filterKeys(event.errors), loading: event.loading });
    }
    if (event.loading&&room.id) {
      console.log('room')
      return nextProps.history.push(`${get.room.self(room.id)}`);
    } 
    console.log("else")
    return ({ ...prevState,roomsloading:false,errors: {}, rooms:data.rooms });
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
    this.setState({ [e.target.id]: e.target.value, errors: {}});
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

  onCreateRoomClick=(e)=>{
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

  getRoomsList(loading,rooms=[]){
    if (!rooms.length||loading) return <div className="w3-center w3-jumbo w3-padding w3-text-gray" style={{ marginTop:"30vh"}}>{loading?Loading(120):'No rooms yet.'}</div>;
    let roombtns = []
    rooms.forEach((room, r) => {
      roombtns.push(
        <div className="w3-padding" key={r}>
          <div className="w3-row btn waves-effect" style={{width:"100%"}}>
            <div className="w3-row">{r}</div>
            <div className="w3-row">{room.title}</div>
          </div>
        </div>
      )
    });
    return roombtns;
  }

  render() {
    const {user} = this.props.auth, { loading, rooms, errors, roomsloading} = this.state;
    console.log(roomsloading);
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
              {Actions(loading, {
                name: "Create Room",
                onclick:this.onCreateRoomClick,
              })}
            </div>
          </form>
        </div>
        <div className="w3-col w3-third w3-padding primary" style={{height:"100vh"}}>
          {this.getRoomsList(roomsloading,rooms)}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  createRoom:PropTypes.func.isRequired,
  enterRoom:PropTypes.func.isRequired,
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

export default connect(mapStateToProps, { logoutUser, createRoom, enterRoom, getRooms})(Dashboard);
