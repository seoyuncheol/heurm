import React, { Component } from "react";
import PostList from "components/Shared/PostList";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as postActions from "redux/modules/posts";
import { toast } from "react-toastify";

class PostListContainer extends Component {
  prev = null;

  handleToggleLike = ({ postId, liked }) => {
    const { PostActions, logged } = this.props;

    const message = message => (
      <div style={{ fontSize: "1.1rem" }}>{message}</div>
    );

    if (!logged) {
      return toast(message("로그인 후 이용 하실 수 있습니다."), {
        type: "error"
      });
    }
    if (liked) {
      PostActions.unlikePost(postId);
    } else {
      PostActions.likePost(postId);
    }
  };

  load = async () => {
    const { PostActions } = this.props;

    try {
      await PostActions.loadPost();
      const { next } = this.props;

      if (next) {
        await PostActions.prefetchPost(next);
      }
    } catch (e) {
      console.log(e);
    }
  };

  loadNext = async () => {
    const { PostActions, next } = this.props;
    PostActions.showPrefetchedPost();
    if (next === this.prev || !next) return;
    this.prev = next;

    try {
      await PostActions.prefetchPost(next);
    } catch (e) {
      console.log(e);
    }
    this.handleScroll();
  };

  handleScroll = () => {
    const { nextData } = this.props;
    if (nextData.length === 0) return;

    const { innerHeight } = window;
    const { scrollHeight } = document.body;

    // IE 에서는 body.scrollTop 대신에 document.documentElement.scrollTop 사용해야함
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    if (scrollHeight - innerHeight - scrollTop < 100) {
      this.loadNext();
    }
  };

  handleCommentClick = postId => {
    const { PostActions } = this.props;
    PostActions.toggleComment(postId);
  };

  componentDidMount() {
    this.load();
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    const { data } = this.props;
    const { handleToggleLike, handleCommentClick } = this;
    return (
      <PostList
        posts={data}
        onToggleLike={handleToggleLike}
        onCommentClick={handleCommentClick}
      />
    );
  }
}

export default connect(
  ({ posts, user }) => ({
    next: posts.next,
    data: posts.data,
    nextData: posts.nextData,
    logged: user.logged
  }),
  dispatch => ({
    PostActions: bindActionCreators(postActions, dispatch)
  })
)(PostListContainer);
