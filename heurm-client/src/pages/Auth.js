import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as baseActions from "redux/modules/base";
import { AuthWrapper } from "components/Auth";
import { Route } from "react-router-dom";
import { Login, Register } from "containers/Auth";

class Auth extends Component {
  componentWillMount() {
    const { BaseActions } = this.props;
    BaseActions.setHeaderVisibility(false);
  }

  componentWillUnmount() {
    const { BaseActions } = this.props;
    BaseActions.setHeaderVisibility(true);
  }

  render() {
    return (
      <AuthWrapper>
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/register" component={Register} />
      </AuthWrapper>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(Auth);
