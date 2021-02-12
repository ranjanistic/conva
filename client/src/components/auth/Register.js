import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import {
  inputType,
  validateTextField,
  getErrorByType,
} from "../../actions/validator";

class Register extends Component {
  constructor() {
    super();
    this.inputs = [
      {
        stateprop:inputType.username,
        caption:"Display name",
        autocomp:"name",
        type:inputType.text,
      },
      {
        stateprop:inputType.email,
        caption:"Email address",
        autocomp:"email",
        type:inputType.email,
      },
      {
        stateprop:inputType.password,
        caption:"New password",
        autocomp:"password",
        type:inputType.password,
      },
    ]
    this.state = {
      [this.inputs[0].stateprop]: "",
      [this.inputs[1].stateprop]: "",
      [this.inputs[2].stateprop]: "",
      errors: {},
      loading:false,
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }


  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.auth.isAuthenticated) {
      return this.props.history.push("/dashboard"); // push user to dashboard when they signup
    }
    if(nextProps.auth.loading){
      this.setState({errors:{},loading:true});
    } else {
      this.setState({errors:{},loading:false});
      if (Object.keys(nextProps.errors).length) {
        Object.keys(nextProps.errors).forEach((key) => {
          if (!nextProps.errors[key]) delete nextProps.errors[key];
        });
        this.setState({
          errors: nextProps.errors,
          loading:false,
        });
      }
    }
    //  else {
    //   this.setState({ errors: {},loading:false});
    // }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value, errors: {} });
    validateTextField(
      e.target,
      () => {
        this.setState({
          [e.target.id]: e.target.value,
          errors: { [e.target.id]: getErrorByType(e.target.type) },
        });
      },
      e.target.type,
      () => {
        this.setState({ errors: {} });
      }
    );
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({errors:{},loading:true});
    this.props.registerUser(this.state, this.props.history);
  };

  getInputFields(errors) {
    let inputfields = [];
    Object.keys(this.state).forEach((key, k) => {
      if (k < 3) {
        inputfields.push(
          <div className="w3-col w3-third input-field w3-padding" key={key}>
            <input
              onChange={this.onChange}
              value={this.state[key]}
              error={errors[key]}
              id={key}
              type={this.inputs[k].type}
              autoFocus={k===0}
              autoComplete={this.inputs[k].autocomp}
              className={classnames("", {
                invalid: errors[key],
              })}
            />
            <label htmlFor={key} className="w3-padding">{this.inputs[k].caption}</label>
            <span className="red-text">{errors[key]}</span>
          </div>
        )
      }
    });
    return inputfields;
  }

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
        Register
      </button>
    );
  };

  render() {
    const { errors,loading } = this.state;
    return (
      <div style={{ marginTop: "4rem" }} className="container">
        <div className="w3-row w3-padding">
            <Link to="/" className="btn-flat waves-effect w3-top">
              <i className="material-icons left">keyboard_backspace</i> Back
            </Link>
            <div className="w3-row w3-padding">
              <h4>
                <b>The only step</b> you won't need again.
              </h4>
              <br/>
              <p className="grey-text text-darken-1">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
            <br/>
            <form className="w3-row" onSubmit={this.onSubmit}>
              {this.getInputFields(errors)}
              <br/>
              <div className="w3-row w3-padding">
                {this.getAction(loading)}
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
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { registerUser })(withRouter(Register));
