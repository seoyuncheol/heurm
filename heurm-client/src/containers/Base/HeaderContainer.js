import React, { Component } from "react";
import { Header, LoginButton, UserThumbnail } from "components/Base/Header";
import { connect } from "react-redux";
import * as userActions from "redux/modules/user";
import * as baseActions from "redux/modules/base";
import { bindActionCreators } from "redux";
import storage from "lib/storage";
import UserMenuContainer from "./UserMenuContainer";

class HeaderContainer extends Component {
  handleThumbnailClick = () => {
    const { BaseActions } = this.props;
    BaseActions.setUserMenuVisibility(true);
  };
  handleLogout = async () => {
    const { UserActions } = this.props;
    try {
      await UserActions.logout();
    } catch (e) {
      console.log(e);
    }

    storage.remove("loggedInfo");
    window.location.href = "/";
  };
  render() {
    const { visible, user } = this.props;
    const { handleThumbnailClick } = this;

    if (!visible) return null;
    return (
      <Header>
        {user.logged ? (
          <UserThumbnail
            thumbnail={user.loggedInfo.thumbnail}
            onClick={handleThumbnailClick}
          />
        ) : (
          <LoginButton />
        )}
        <UserMenuContainer eventTypes="click" />
      </Header>
    );
  }
}

export default connect(
  ({ base, user }) => ({
    visible: base.header.visible,
    user: user
  }),
  dispatch => ({
    UserActions: bindActionCreators(userActions, dispatch),
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(HeaderContainer);
