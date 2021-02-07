import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { validLoginUser } from "../../actions/validator";

class Login extends Component {
  constructor() {
    super();
    this.inputs = [
      {
        stateprop: "email",
        caption: "Email address",
        autocomp: "email",
        type: "email",
      },
      {
        stateprop: "password",
        caption: "Password",
        autocomp: "password",
        type: "password",
      },
    ];
    this.state = {
      [this.inputs[0].stateprop]: "",
      [this.inputs[1].stateprop]: "",
      errors: {},
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.auth.isAuthenticated) {
      return this.props.history.push("/dashboard"); // push user to dashboard when they signup
    }
    if (Object.keys(nextProps.errors).length) {
      Object.keys(nextProps.errors).forEach((key) => {
        if (!nextProps.errors[key]) delete nextProps.errors[key];
      });
      this.setState({
        errors: nextProps.errors,
      });
    } else {
      this.setState({ errors: {} });
    }
  }

  onChange = (e) => {
    const result = validLoginUser(this.state);
    if (!result.isValid) {
      const errors = result.err;
      Object.keys(errors).forEach((key) => {
        if (!errors[key]) {
          delete errors[key];
        }
      });
      this.setState({
        [e.target.id]: e.target.value,
        errors: { [e.target.id]: errors[e.target.id] },
      });
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }
  };

  getInputFields(errors) {
    let inputs = [];
    Object.keys(this.state).forEach((key, k) => {
      if (k !== 2) {
        inputs.push(
          <div className="w3-col w3-half w3-padding input-field" key={key}>
            <input
              onChange={this.onChange}
              value={this.state[key]}
              error={errors[key]}
              id={key}
              type={this.inputs[k].type}
              autoFocus={k === 0}
              autoComplete={this.inputs[k].autocomp}
              className={classnames("", {
                invalid: errors[key],
              })}
            />
            <label htmlFor={key} className="w3-padding">{this.inputs[k].caption}</label>
            <span className="red-text">{errors[key]}</span>
          </div>
        );
      }
    });
    return inputs;
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ errors: {} });
    this.props.loginUser(this.state); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };

  render() {
    const { errors } = this.state;
    return (
      <div style={{ marginTop: "4rem" }} className="container">
        <div className="w3-row w3-padding">
          <Link to="/" className="btn-flat waves-effect w3-top">
            <i className="material-icons left">keyboard_backspace</i> Back
          </Link>
          <div className="w3-row w3-padding">
            <h4>
              <b>Login</b> below
            </h4>
            <br/>
            <p className="grey-text text-darken-1">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
          <form className="w3-row" onSubmit={this.onSubmit}>
            {this.getInputFields(errors)}
            <div className="w3-row w3-padding">
              <button
                style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                }}
                type="submit"
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Login
              </button>
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
