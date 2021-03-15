import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Actions } from "../elements/Actions";
import { get } from "../../paths/get";
import { Input } from "../elements/Input";
import { logoutUser, send2FACode, verify2FACode } from "../../actions/authActions";
import {
  inputType,
  validateTextField,
  getErrorByType,
  filterKeys,
} from "../../utils/validator";

class Verification extends Component {
  constructor() {
    super();
    this.inputs = [
      {
        stateprop: "twofacode",
        caption: "Type the code",
        autocomp: inputType.text,
        type: inputType.text,
      }
    ];
    this.initState = {
      [this.inputs[0].stateprop]: "",
      errors: {},
      loading: false,
      nextUrl: get.DASHBOARD,
    }
    this.state = this.initState;
  }

  componentDidMount() {
    if(this.props.auth.user.verified){
        this.props.history.push(get.DASHBOARD);
    }
  }

  static getDerivedStateFromProps(nextProps,prevState){
    const { event } = nextProps;
    return ({
        errors: event.loading ? {} : filterKeys(event.errors),
        loading: event.loading,
    });
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
    });
    return inputfields;
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({
      [this.inputs[0].stateprop]: document.getElementById(this.inputs[0].stateprop).value.trim(),
      loading: true,
      errors: {},
    });
    this.props.verify2FACode(this.props.auth.user.email,this.state.twofacode);
  };


  sendCode = (e) => {
    this.props.send2FACode(this.props.auth.user.email);
  }

  onLogoutClick=(e)=>{
      this.props.logoutUser();
  }

  render() {
    const { errors, loading } = this.state, {user} = this.props.auth;
    return (
      <div style={{ marginTop: "4rem" }} className="container">
        <div className="w3-row w3-padding">
          <Link to={get.ROOT}>
            <span className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back
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
          <div className="w3-row w3-padding">
            <h4>
              <b>Account verification</b>.
            </h4>
            <br/>
            <p>To let you use Conva, we need to verify you. Click 'Send code' to send yourself a code at <b>{user.email}</b>, and then enter that code here to verify.</p>
          </div>
          <form className="w3-row">
            {this.getInputFields(errors, loading)}
            <div className="w3-row w3-padding" id="actions">
              {Actions(
                loading,
                {
                    name: "Send code",
                    onclick: this.sendCode
                },
                {
                  name: "Verify",
                  onclick: this.onSubmit,
                },
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Verification.propTypes = {
  send2FACode: PropTypes.func.isRequired,
  verify2FACode: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  event: state.event,
});
export default connect(mapStateToProps,{send2FACode,verify2FACode, logoutUser})(withRouter(Verification));
