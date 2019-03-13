import React, { Component } from "react";
import {
  AuthContent,
  InputWithLabel,
  AuthButton,
  RightAlignedLink,
  AuthError
} from "components/Auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "redux/modules/auth";
import * as userActions from "redux/modules/user";
import storage from "lib/storage";
import queryString from "query-string";

class Login extends Component {
  componentWillUnmount() {
    const { AuthActions } = this.props;
    AuthActions.initializeForm("login");
  }
  componentDidMount() {
    const { location } = this.props;
    const query = queryString.parse(location.search);

    if (query.expired !== undefined) {
      this.setError("세션에 만료되었습니다. 다시 로그인하세요.");
    }
  }

  setError = message => {
    const { AuthActions } = this.props;
    AuthActions.setError({
      form: "login",
      message
    });
    return false;
  };

  handleChange = e => {
    const { AuthActions } = this.props;
    const { name, value } = e.target;
    AuthActions.changeInput({
      name,
      value,
      form: "login"
    });
  };

  handleLocalLogin = async () => {
    const { form, AuthActions, UserActions, history } = this.props;
    const { email, password } = form;

    try {
      await AuthActions.localLogin({ email, password });
      const loggedInfo = this.props.result;

      UserActions.setLoggedInfo(loggedInfo);
      history.push("/");
      storage.set("loggedInfo", loggedInfo);
    } catch (e) {
      console.log("a");
      this.setError("잘못된 계정정보입니다.");
    }
  };

  render() {
    const { error } = this.props;
    const { email, password } = this.props.form;
    const { handleChange, handleLocalLogin } = this;
    return (
      <AuthContent title="로그인">
        <InputWithLabel
          label="이메일"
          name="email"
          placeholder="이메일"
          value={email}
          onChange={handleChange}
        />
        <InputWithLabel
          label="비밀번호"
          name="password"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={handleChange}
        />
        {error && <AuthError>{error}</AuthError>}
        <AuthButton onClick={handleLocalLogin}>로그인</AuthButton>
        <RightAlignedLink to="/auth/register">회원가입</RightAlignedLink>
      </AuthContent>
    );
  }
}

export default connect(
  ({ auth }) => ({
    form: auth.login.form,
    error: auth.login.error,
    result: auth.result
  }),
  dispatch => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(Login);
