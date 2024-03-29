import { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Input } from "../elements/Input";
import { inputType } from "../../utils/validator";
import { Actions } from "../elements/Actions";
import { connectToChat, disconnectFromChat } from "./Socket";

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
      oldchats: [],
      chats:[]
    };
  }
  
  componentDidMount(){
    connectToChat(this.props.room._id,(err,newchat)=>{
      let chats = this.state.chats;
      chats.push(newchat);
      this.setState({chats})
    })
  }

  componentWillUnmount(){
    disconnectFromChat(this.props.room._id)
  }

  getAllChats=_=>this.setState({oldchats:this.props.room.chats});

  showChats = (newchats,oldchats) => {
    console.log(newchats,oldchats);
    let chatview = [];
    if(oldchats.length){
      newchats = newchats.concat(oldchats)
    }
    console.log(newchats)
    newchats.forEach((chat, c) => {
      chatview.push(
        <div className="w3-row w3-padding-small" key={c}>
          <div className="w3-col">
          <span className="blue-text">{chat.time}:{chat.username}</span>:{chat.msg}
          </div>
        </div>
      );
    });
    return chatview;
  };

  onInputChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  
  render() {
    const {chats,oldchats} = this.state;
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
              })}
            </div>
            <div className="w3-col w3-third">
              {Actions(false,{
                name:"Send",
                size:'small'
              })}
            </div>
          </div>
          <div className="w3-row w3-padding-small scrollY">
            {this.showChats(chats,oldchats)}
          </div>
        </div>
      </Fragment>
    );
  }

}

Chat.propTypes = {
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  room: state.room,
  data: state.data,
});
export default connect(mapStateToProps)(Chat);
