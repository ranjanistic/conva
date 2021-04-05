import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { get } from "./../../paths/get"
import icon from "../../graphics/icon.svg";
import { Button } from "../elements/Button";
import { Image } from "../elements/Image";
import { Actions } from "../elements/Actions";

class Landing extends Component {
  render() {
    const {isAuthenticated:auth,user} = this.props.auth;
    return (
      <div className="w3-col secondary">
        <nav className="w3-row navbar secondary">
        <Link to={get.ROOT}>{Image({src:icon,alt:'Icon',width:40})}</Link>Conva
          <span className="w3-right">{((auth)=>{
            if(auth)
              return (<Link to={get.DASHBOARD}>{Button.flat(user.username.split(' ')[0],_=>{},"secondary-text")}</Link>)
            return (<><Link to={get.auth.LOGIN}>{Button.flat('Login')}</Link><Link to={get.auth.SIGNUP}>{Button.flat('Register',_=>{},"positive")}</Link></>)
          })(auth)}</span>
        </nav>
        <br/>
        <div className="w3-col w3-half w3-padding-small">
        <div className="w3-row w3-padding text-primary">
          <h1>Say hello to<br/> Conva.</h1>
        </div>
        <div className="w3-row w3-padding text-secondary">
          <h5>Join convameet now for a fluid meeting experience.</h5>
        </div>
        <div className="w3-row w3-padding">
          <Link to={get.auth.SIGNUP}>{Actions(false,{
          name:'Register',
          
        })}</Link>
        </div>
        </div>
        <div className="w3-col w3-half w3-padding w3-center">
          {Image({src:icon,alt:'Icon',width:"100%"})}
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Landing);
