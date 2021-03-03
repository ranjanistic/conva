import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { Actions } from "../elements/Actions";
import { get } from "../../paths/get";

import {
  inputType,
  validateTextField,
  getErrorByType,
  filterSignupUser,
  filterKeys,
} from "../../actions/validator";
import { Input } from "../elements/Input";

class Register extends Component {
  constructor() {
    super();
    this.inputs = [
      {
        stateprop: inputType.username,
        caption: "Display name",
        autocomp: inputType.name,
        type: inputType.text,
      },
      {
        stateprop: inputType.email,
        caption: "Email address",
        autocomp: inputType.email,
        type: inputType.email,
      },
      {
        stateprop: inputType.password,
        caption: "New password",
        autocomp: inputType.password,
        type: inputType.password,
      },
    ];
    this.state = {
      [this.inputs[0].stateprop]: "",
      [this.inputs[1].stateprop]: "",
      [this.inputs[2].stateprop]: "",
      errors: {},
      loading: false,
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push(get.DASHBOARD);
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      return this.props.history.push(get.DASHBOARD);
    }
    const { event } = nextProps;
    this.setState({
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
              this.inputs.find((ip) => ip.stateprop === e.target.id).autocomp
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

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({
      [this.inputs[0].stateprop]: document
        .getElementById(this.inputs[0].stateprop)
        .value.trim(),
      [this.inputs[1].stateprop]: document
        .getElementById(this.inputs[1].stateprop)
        .value.trim(),
      [this.inputs[2].stateprop]: document.getElementById(
        this.inputs[2].stateprop
      ).value,
      loading: true,
      errors: {},
    });
    this.props.registerUser(filterSignupUser(this.state));
  };

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
            autoFocus:k === 0
          })
        );
      }
    });
    return inputfields;
  }

  render() {
    const { errors, loading } = this.state;
    return (
      <div style={{ marginTop: "4rem" }} className="container">
        <div className="w3-row w3-padding">
          <Link to={get.ROOT}>
            <span className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back
            </span>
          </Link>
          <div className="w3-row w3-padding">
            <h4>
              <b>The only step</b> you won't need again.
            </h4>
            <br />
            <p className="grey-text text-darken-1">
              Already have an account? <Link to={get.auth.LOGIN}>Log in</Link>
            </p>
          </div>
          <br />
          <form className="w3-row">
            {this.getInputFields(errors, loading)}
            <br />
            <div className="w3-row w3-padding">
              {Actions(loading, {
                name: "Register",
                onclick: this.onSubmit,
              })}
            </div>
          </form>
        </div>
      </div>
    );
  }
}
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  event: state.event,
});
export default connect(mapStateToProps, { registerUser })(withRouter(Register));
