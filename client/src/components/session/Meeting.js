import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { leaveMeeting } from "../../actions/meetActions";
import { get } from "../../paths/get";
import { Icon } from "../elements/Icon";

class Meeting extends Component {
  constructor(){
    super();
    this.state = {
      room:{},
      actions:{
        cam:false,
        mic:false,
        chatbox:false,
        active:true,
      }
    }
  }

  leave = (e) => {
    e.preventDefault();
    this.props.leaveMeeting();
  };


  componentDidMount() {
    console.log(this.props);
    // if (!this.props.meet.isActive) {
    //   this.props.history.push(get.DASHBOARD);
    // }
    this.setState({room:this.props.room})
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    const {room,meet} = nextProps;
    if(!meet.active){
      this.props.history.push(get.room.self(room.id));
    }
    // if(!nextProps.meet.isActive){
    //   this.props.history.push(get.DASHBOARD);
    // }
  }

  meetActions=()=>{
    let actions = [];
    const allacts = [
      {
        content:Icon(this.getToggleViewById('cam',true),{classnames:"blue-text"}),
        classnames:"white w3-right",
        onclick:this.toggle
      },
      {
        content:Icon(this.getToggleViewById('mic',true),{classnames:"blue-text"}),
        classnames:"white w3-center",
      },
      {
        content:Icon("chat"),
        classnames:"blue w3-center",
        onclick:this.toggleChatBox
      },
      {
        content:Icon("more_horiz"),
        classnames:"w3-center",
        onclick:this.toggleAbout
      },
      {
        content:Icon("call_end"),
        classnames:"red w3-left",
        onclick:this.leave
      }
    ]
    allacts.forEach((action)=>{
      actions.push(
        <div style={{ width:`${100/allacts.length}%`}} className="w3-col w3-padding-small w3-center">
          <button className={`btn-floating btn-large waves-effect ${action.classnames}`} onClick={action.onclick}>
            {action.content}
          </button>
        </div>
      )
    })
    return (<span>{actions}</span>)
  }

  getChildernFrames(){
    let children = [];
    [1,2,3,4].forEach((e)=>{
      children.push(
        <div className="w3-padding w3-row shadow" key={e}>
          <div style={{ height: "30vh", width:"100%", padding:"0",borderRadius:"8px" }} className="btn black waves-effect waves-light">
            <video height="100%" width="100%">
            </video>
          </div>
        </div>
      )
    })
    return children;
  }

  toggleChatBox=(e)=>{
    
  }

  toggleAbout=(e)=>{
    
  }
  render() {
    const {room} = this.state;
    return (
      <div className="w3-row" style={{height:"100vh"}}>

          <div className="w3-col w3-twothird" style={{height:"100vh"}}>
            <div className="w3-row" style={{ height: "85vh"}}>
              <video className="black white-text" style={{ width:"100%",height:"100%" }} id="parent"></video>
            </div>
            <div className="w3-row" style={{ height: "15vh"}}>
              <div className="w3-col w3-half" style={{ height: "15vh",overflowY: "scroll"}}>
                <h3 style={{paddingLeft:"1rem"}}>{room.title}</h3>
              </div>
              <div className="w3-col w3-half red" style={{ height: "15vh"}}>

              </div>
            </div>
          </div>

          <div className="w3-col w3-third" style={{height: "100vh"}}>
            <div className="w3-row w3-center w3-padding-small" id="actions" style={{height: "10vh"}}>
              {this.meetActions()}
            </div>
            <div className="w3-row secondary" id="children"  style={{ overflowY: "scroll", height: "90vh"}}>
              {this.getChildernFrames()}
            </div>
          </div>
      </div>
    );
  }

  toggle=(e)=>{
    console.log(e.target.id);
    this.setState({
      actions:{[e.target.id]:!this.state.actions[e.target.id]}
    });
  }

  getToggleViewById(id,on = false){
    switch(id){
      case 'cam':return on?'videocam':'videocam_off';
      case 'mic':return on?'mic':'mic_off';
      default: return on;
    }
  }
}

Meeting.propTypes = {
  leaveMeeting: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  meet: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  room: state.room,
  meet: state.meet,
});
export default connect(mapStateToProps, { leaveMeeting })(Meeting);
