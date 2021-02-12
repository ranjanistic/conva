import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import {get} from "../../paths/get";
import {
  inputType,
  validateTextField,
  getErrorByType,
  filterLoginUser,
  filterKeys,
  constant,
  isStringValid
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
    console.log('nextprops',nextProps);
    let {errors} = nextProps.errors;
    if (nextProps.auth.isAuthenticated) {
      return this.props.history.push(get.DASHBOARD); // push user to dashboard when they signup
    }
    if(nextProps.errors.loading){
      this.setState({errors:{},loading:true});
    } else {
      console.log('filtering errs',errors);
      errors = filterKeys(errors);
      console.log('filtered errs',errors);
      this.setState({ errors: errors,loading:false});
      this.state.errors = errors;
      console.log('final state',this.state);
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value, errors:{}});
    validateTextField(
      e.target,
      () => {
        console.log(e.target.type);
        this.setState({
          [e.target.id]: e.target.value,
          errors: { [e.target.id]: getErrorByType(e.target.type) },
        });
      },
      e.target.type,
      () => {
        this.setState({ [e.target.id]: e.target.value, errors: {} });
      }
    );
  };

  getInputFields(errors) {
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
      [this.inputs[0].stateprop]: document.getElementById(this.inputs[0].stateprop).value.trim(),
      [this.inputs[1].stateprop]: document.getElementById(this.inputs[1].stateprop).value,
      errors:{
        email:0,
        password:0
      },
      loading:true,
    });
    this.state.errors = {};
    console.log(this.state);
    this.props.loginUser(filterLoginUser(this.state));
  };

  getAction = (isLoading = false) => {
    if(isLoading){
      return (
        <Loader
          type="Oval"
          color="#216bf3"
          height={100}
          width={100}
          timeout={0} //infinite
        />
      )
    }
    return (
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
    );
  };

  render() {
    const { errors } = this.state;
    const {loading} = this.state;
    return (
      <div style={{ marginTop: "4rem" }} className="container">
        <div className="w3-row w3-padding">
          <Link to={get.ROOT} className="btn-flat waves-effect w3-top">
            <i className="material-icons left">keyboard_backspace</i> Back
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
          <form className="w3-row" onSubmit={this.onSubmit}>
            {this.getInputFields(errors)}
            <div className="w3-row w3-padding" id="actions">
              {this.getAction(loading)}
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
