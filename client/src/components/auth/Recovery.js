import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Actions } from "../elements/Actions";
import { get } from "../../paths/get";

import {
  inputType,
  validateTextField,
  getErrorByType,
  filterKeys,
} from "../../utils/validator";
import { Input } from "../elements/Input";
import { send2FACode, verify2FACode, setRecoveryPassword} from "../../actions/authActions";

class Recovery extends Component {
  constructor() {
    super();
    this.inputs = [
      {
        stateprop: inputType.email,
        caption: "Email address",
        autocomp: inputType.email,
        type: inputType.email,
      },
      {
        stateprop: "twofacode",
        caption: "Type the code",
        autocomp: inputType.text,
        type: inputType.text,
      },
      {
        stateprop: "newpassword",
        caption: "Create New Password",
        autocomp: inputType.password,
        type: inputType.password,
      },
    ];
    this.initState = {
      [this.inputs[0].stateprop]: "",
      [this.inputs[1].stateprop]: "",
      [this.inputs[2].stateprop]: "",
      errors: {},
      loading: false,
    };
    this.state = this.initState;
  }

  componentDidMount() {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { event, auth } = nextProps;
    console.log(prevState);
    console.log(nextProps);
    if(auth.twofa.verified){
      if(!auth.isAuthenticated){
        return nextProps.history.push(get.auth.login());
      }
    }
    if (auth.twofa.sent) {
      return {
        errors: {},
        loading: false,
      };
    }
    return {
      errors: event.loading ? {} : filterKeys(event.errors),
      loading: event.loading,
    };
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
              this.inputs.find((ip) => ip.stateprop === e.target.id).type
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

  getInputFields(errors, disabled = false) {
    let inputfields = [];
    Object.keys(this.state).forEach((key, k) => {
      if (k < this.inputs.length) {
        if (this.props.auth.twofa.verified) {
          if (key === this.inputs[2].stateprop)
            inputfields.push(
              Input({
                id: key,
                value: this.state[key],
                type: this.inputs[k].type,
                caption: this.inputs[k].caption,
                error: errors[key],
                disabled: disabled,
                onChange: this.onChange,
                autocomp: this.inputs[k].autocomp,
                autoFocus: k === 0,
                classnames: "w3-half",
              })
            );
        } else if (this.props.auth.twofa.sent&&!this.props.auth.twofa.expired) {
          if (key === this.inputs[1].stateprop)
            inputfields.push(
              Input({
                id: key,
                value: this.state[key],
                type: this.inputs[k].type,
                caption: this.inputs[k].caption,
                error: errors[key],
                disabled: disabled,
                onChange: this.onChange,
                autocomp: this.inputs[k].autocomp,
                autoFocus: k === 0,
                classnames: "w3-half",
              })
            );
        } else {
          if (key === this.inputs[0].stateprop)
            inputfields.push(
              Input({
                id: key,
                value: this.state[key],
                type: this.inputs[k].type,
                caption: this.inputs[k].caption,
                error: errors[key],
                disabled: disabled,
                onChange: this.onChange,
                autocomp: this.inputs[k].autocomp,
                autoFocus: k === 0,
                classnames: "w3-half",
              })
            );
        }
      }
    });
    return inputfields;
  }

  setPassword = (e) => {
    e.preventDefault();
    this.setState({
      [this.inputs[2].stateprop]: document
        .getElementById(this.inputs[2].stateprop)
        .value.trim(),
      loading: true,
      errors: {},
    });
    this.props.setRecoveryPassword(this.state.email,this.state.newpassword);
  }

  submitCode = (e) => {
    e.preventDefault();
    this.setState({
      [this.inputs[1].stateprop]: document
        .getElementById(this.inputs[1].stateprop)
        .value.trim(),
      loading: true,
      errors: {},
    });
    this.props.verify2FACode(this.state.email, this.state.twofacode);
  };

  sendCode = (e) => {
    e.preventDefault();
    this.setState({
      [this.inputs[0].stateprop]: document
        .getElementById(this.inputs[0].stateprop)
        .value.trim(),
      loading: true,
      errors: {},
    });
    this.props.send2FACode(this.state.email);
  };

  render() {
    const { errors, loading } = this.state,
      {
        twofa: { sent, verified, expired },
      } = this.props.auth;
    return (
      <div style={{ marginTop: "4rem" }} className="container">
        <div className="w3-row w3-padding">
          <Link to={get.DASHBOARD}>
            <span className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back
            </span>
          </Link>
          <div className="w3-row w3-padding">
            <h4>
              <b>We're always here </b>to help.
            </h4>
            <br />
            <p>
              {
                (_=>{
                  if(verified){
                    return (<span className="green-text">Your code has been verified. You may set a new password for your <b>{this.state.email}</b> account. You'll have to re-login with your new password.</span>) 
                  }
                  if(expired){
                   return (<span className="red-text">The last code we sent you is no longer valid.</span>) 
                  }
                  if(sent){
                   return (<span>If your account exists, you'll receive a code at <b>{this.state.email}</b>.</span>) 
                  }
                  return (<span>But before we let you reset your password, we need your email address.</span>) 
                })()
              }
            </p>
          </div>
          <form className="w3-row">
            {this.getInputFields(errors, loading)}
            <div className="w3-row w3-padding" id="actions">
              {Actions(
                loading,
                ((_) => {
                  if(verified) return {
                    name: "Set Password",
                    onclick: this.setPassword,
                  }
                  if(expired) return {
                    name: "Resend Code",
                    onclick: this.sendCode,
                  }
                  if(sent) return {
                    name: "Verify",
                    onclick: this.submitCode,
                  }
                  return {
                    name: "Send Code",
                    onclick: this.sendCode,
                  }
                })()
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Recovery.propTypes = {
  send2FACode: PropTypes.func.isRequired,
  verify2FACode: PropTypes.func.isRequired,
  setRecoveryPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  event: state.event,
});
export default connect(mapStateToProps, { send2FACode, verify2FACode, setRecoveryPassword })(
  withRouter(Recovery)
);
