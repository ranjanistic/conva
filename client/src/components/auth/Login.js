import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { actions } from "./Elements";
import { get } from "../../paths/get";

import {
  inputType,
  validateTextField,
  getErrorByType,
  filterLoginUser,
  filterKeys,
} from "../../actions/validator";

class Login extends Component {
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
        stateprop: inputType.password,
        caption: "Password",
        autocomp: inputType.password,
        type: inputType.nonempty,
      },
    ];

    this.state = {
      [this.inputs[0].stateprop]: "",
      [this.inputs[1].stateprop]: "",
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
      return this.props.history.push(get.DASHBOARD); // push user to dashboard when they signup
    }
    let { errors } = nextProps.errors;
    if (nextProps.errors.loading) {
      this.setState({ errors: {}, loading: true });
    } else {
      errors = filterKeys(errors);
      this.setState({ errors: errors, loading: false });
    }
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
      if (k < 2) {
        inputfields.push(
          <div className="w3-col w3-half w3-padding input-field" key={key}>
            <input
              onChange={this.onChange}
              value={this.state[key]}
              error={errors[this.inputs[k].type]}
              id={key}
              type={key}
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

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({
      [this.inputs[0].stateprop]: document
        .getElementById(this.inputs[0].stateprop)
        .value.trim(),
      [this.inputs[1].stateprop]: document.getElementById(
        this.inputs[1].stateprop
      ).value,
      loading: true,
      errors: {},
    });
    this.props.loginUser(filterLoginUser(this.state));
  };

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
              <b>Login</b> below
            </h4>
            <br />
            <p className="grey-text text-darken-1">
              Don't have an account? <Link to={get.SIGNUP}>Register</Link>
            </p>
          </div>
          <form className="w3-row">
            {this.getInputFields(errors, loading)}
            <div className="w3-row w3-padding" id="actions">
              {actions(
                loading,
                {
                  name: "Login",
                  onclick: this.onSubmit,
                },
                {
                  name: "Need help",
                  color: "t",
                }
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(withRouter(Login));
