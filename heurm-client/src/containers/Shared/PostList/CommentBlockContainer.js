import React, { Component } from "react";
import CommentBlock from "components/Shared/PostList/CommentBlock";
import { connect } from "react-redux";

class CommentBlockContainer extends Component {
  render() {
    const { status } = this.props;
    const { visible, value } = status ? status : {};

    console.log(status);

    if (!visible) return null;

    return <CommentBlock value={value} />;
  }
}

export default connect((state, ownProps) => ({
  status: state.posts.comments[ownProps._id]
}))(CommentBlockContainer);
