import { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Input } from "../elements/Input";
import { inputType } from "../../actions/validator";
import { Actions } from "../elements/Actions";

class Chat extends Component {
  constructor() {
    super();
    this.input = {
      stateprop: "chatinput",
      caption: "Your message",
      autocomp: inputType.nonempty,
      type: inputType.text,
    };
    this.state = {
      [this.input.stateprop]: "",
      chats: [],
    };
  }

  getChats = () => {
    let chats = [];
    [1, 2, 4].forEach((chat, c) => {
      chats.push(
        <div className="w3-padding-small" key={c}>
          {chat}
        </div>
      );
    });
    return chats;
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
            height: "100%",
            width:"100%",
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
            <div className="w3-col w3-third">
              {Actions(false,{
                name:"Send",
                size:'small'
              })}
            </div>
          </div>
          <div className="w3-row w3-padding-small">{this.getChats()}</div>
        </div>
      </Fragment>
    );
  }
}

Chat.propTypes = {
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  room: state.room,
});
export default connect(mapStateToProps)(Chat);
