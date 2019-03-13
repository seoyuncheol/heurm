import React, { Component } from "react";
import UserMenu, { UserMenuItem, Username } from "components/Base/UserMenu";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as baseActions from "redux/modules/base";
import * as userActions from "redux/modules/user";
import storage from "lib/storage";

const ClickOutHandler = require("react-onclickout");

class UserMenuContainer extends Component {
  handleClickOutside = e => {
    const { BaseActions } = this.props;
    BaseActions.setUserMenuVisibility(false);
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
    const { visible, username } = this.props;
    const { handleLogout, handleClickOutside } = this;

    if (!visible) {
      return null;
    }
    return (
      <ClickOutHandler onClickOut={handleClickOutside}>
        <UserMenu>
          <Username username={username} />
          <UserMenuItem>나의 흐름</UserMenuItem>
          <UserMenuItem>설정</UserMenuItem>
          <UserMenuItem onClick={handleLogout}>로그아웃</UserMenuItem>
        </UserMenu>
      </ClickOutHandler>
    );
  }
}

export default connect(
  ({ base, user }) => ({
    visible: base.userMenu.visible,
    username: user.loggedInfo.username
  }),
  dispatch => ({
    BaseActions: bindActionCreators(baseActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(UserMenuContainer);
