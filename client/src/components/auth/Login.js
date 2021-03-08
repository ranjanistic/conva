import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import { Actions } from "../elements/Actions";
import { get } from "../../paths/get";

import {
  inputType,
  validateTextField,
  getErrorByType,
  filterLoginUser,
  filterKeys,
} from "../../actions/validator";
import { Input } from "../elements/Input";

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
      nextUrl: get.DASHBOARD,
    };
  }

  componentDidMount() {
    let qString = this.props.location.search;
    qString = qString.replace("?","");
    let queries = qString.split("&");
    let nexturl = this.state.nextUrl;
    queries.some((query) => {
      if (query.split("=")[0] === "next") {
        nexturl = query.split("=")[1];
        this.setState({nextUrl:nexturl})
        return true;
      }
      return false;
    });
    if (this.props.auth.isAuthenticated) {
      return this.props.history.push(nexturl);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      return this.props.history.push(this.state.nextUrl);
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
            type: key,
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
              Don't have an account? <Link to={get.auth.SIGNUP}>Register</Link>
            </p>
          </div>
          <form className="w3-row">
            {this.getInputFields(errors, loading)}
            <div className="w3-row w3-padding" id="actions">
              {Actions(
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
  event: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  event: state.event,
});
export default connect(mapStateToProps, { loginUser })(withRouter(Login));
