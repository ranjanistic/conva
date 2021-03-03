import { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Input } from "../elements/Input";
import { inputType } from "../../actions/validator";

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
      activeMembers: [],
      members: [],
    };
  }

  getMembers = () => {
    let members = [];
    [1, 2, 4].forEach((member, m) => {
      members.push(
        <div className="w3-padding-small" key={m}>
          {member}
        </div>
      );
    });
    return members;
  };
  onInputChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
      <Fragment>
        <div
          className="w3-col z-depth-4 secondary"
          style={{
            overflowY: "scroll",
            height: "85vh",
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
                autoFocus:true
              })}
            </div>
            <div className="w3-col w3-third w3-padding">
              <button className="btn-flat waves-effect">Invite</button>
            </div>
          </div>
          <div className="w3-row w3-padding-small">{this.getMembers()}</div>
        </div>
      </Fragment>
    );
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
