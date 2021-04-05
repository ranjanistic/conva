import { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Input } from "../elements/Input";
import { inputType } from "../../utils/validator";
import { connectToPeople, disconnectFromPeople } from "./Socket";
import { Toast } from "../elements/Toast";
import { navigatorShare } from "../../actions/actions";

class People extends Component {
  constructor() {
    super();
    this.input = {
      stateprop: "findmember",
      caption: "Filter members",
      autocomp: inputType.nonempty,
      type: inputType.text,
    };
    this.state = {
      [this.input.stateprop]: "",
      activepeople: [],
      members: [],
    };
  }

  componentDidMount(){
    connectToPeople(this.props.room._id,(err,activeperson)=>{
      let activepeople = this.state.activepeople;
      activepeople.push(activeperson);
      console.log(activepeople)
      this.setState({activepeople})
    })
  }

  componentWillUnmount(){
    disconnectFromPeople(this.props.room._id)
  }

  getAllMembers=_=>this.setState({members:this.props.room.people});

  showMembers = (activepeople,allmembers) => {
    let peopleview = [];
    if(allmembers.length){
      //todo: check if allmembers contain any activepeople & prevent duplicacy.
      activepeople = activepeople.concat(allmembers)
    }
    console.log(activepeople)
    activepeople.forEach((person, p) => {
      peopleview.push(
        <div className="w3-row w3-padding-small" key={p}>
          <div className="w3-col w3-half">
          {person.username}
          </div>
          <div className="w3-col w3-half">
            {person.online?'online':'offline'} since {person.join}
          </div>
        </div>
      );
    });
    return peopleview;
  };

  onInputChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    const {activepeople, members} = this.state;
    return (
      <Fragment>
        <div
          className="w3-col z-depth-4 secondary"
          style={{
            overflowY: "scroll",
            height:"100%",
            width: "100%",
            borderRadius: "12px",
            padding: "8px 0",
          }}
        >
          <div className="w3-row primary">
            <div className="w3-col w3-twothird">
              {Input({
                id: this.input.stateprop,
                value: this.state[this.input.stateprop],
                type: this.input.type,
                caption: this.input.caption,
                onChange: this.onInputChange,
              })}
            </div>
            <div className="w3-col w3-third w3-padding">
              <button className="btn-flat waves-effect" onClick={this.getInviteLink}>Invite</button>
            </div>
          </div>
          <div className="w3-row w3-padding-small">{this.showMembers(activepeople,members)}</div>
        </div>
      </Fragment>
    );
  }
  getInviteLink=(e)=>{
    document.execCommand('copy',true,'url')
    Toast.action('Invite link copied to clipboard! Click here to share.',_=>navigatorShare('Conva Room Invitation','url'));
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
