import React, { Component } from "react";
import WritePost from "components/Home/WritePost/WritePost";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as homeActions from "redux/modules/home";
import { toast } from "react-toastify";

class WritePostContainer extends Component {
  handleChange = e => {
    const { HomeActions } = this.props;
    HomeActions.changeWritePostInput(e.target.value);
  };
  handlePost = async () => {
    const { HomeActions, value } = this.props;

    // 알림에서 보여줄 DOM
    const message = message => (
      <div stype={{ fontSize: "1.1rem" }}>{message}</div>
    );

    // 사전 오류 핸들링
    if (value.length < 5) {
      HomeActions.changeWritePostInput("");
      return toast(message("너무 짧습니다. 5자 이상 입력하세요."), {
        type: "error"
      });
    }

    if (value.length > 1000) {
      HomeActions.changeWritePostInput("");
      return toast(message("최대 1000자까지 입력 할 수 있습니다."), {
        type: "error"
      });
    }

    try {
      await HomeActions.writePorst(value);
      toast(message("생각이 작성되었습니다."), { type: "success" });
    } catch (e) {
      toast(message("오류가 발생했습니다."), { type: "error" });
    }
    HomeActions.writePost(value);
  };
  render() {
    const { handleChange, handlePost } = this;
    const { value } = this.props;
    return (
      <WritePost value={value} onChange={handleChange} onPost={handlePost} />
    );
  }
}

export default connect(
  ({ home }) => ({
    value: home.writePost.value
  }),
  dispatch => ({
    HomeActions: bindActionCreators(homeActions, dispatch)
  })
)(WritePostContainer);