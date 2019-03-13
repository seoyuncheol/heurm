import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Home, Auth } from "pages";
import HeaderContainer from "./containers/Base/HeaderContainer";

import storage from "lib/storage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

class App extends Component {
  initalizeUserInfo = async () => {
    const loggedInfo = storage.get("loggedInfo");
    if (!loggedInfo) return;

    const { UserActions } = this.props;
    UserActions.setLoggedInfo(loggedInfo);
    try {
      await UserActions.checkStatus();
    } catch (e) {
      storage.remove("loggedInfo");
      window.location.href = "/auth/login?expired";
    }
  };

  componentDidMount() {
    this.initalizeUserInfo();
  }
  render() {
    return (
      <div>
        <HeaderContainer />

        <Route exact path="/" component={Home} />
        <Route path="/auth" component={Auth} />

        <ToastContainer
          style={{ zIndex: 20 }}
          hideProgressBar={true}
          position="bottom-right"
        />
      </div>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(App);
