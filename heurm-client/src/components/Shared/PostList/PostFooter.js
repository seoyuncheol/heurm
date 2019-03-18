import React from "react";
import styled from "styled-components";
import oc from "open-color";
import { FaHeart } from "react-icons/fa";
import { FaCommentDots } from "react-icons/fa";
// 테두리, 패딩을 설정하고 내부의 svg 와 span 스타일을 설정해줌
const Wrapper = styled.div`
  padding: 1rem;
  border-top: 1px solid ${oc.gray[1]};
  display: flex;
  color: ${oc.gray[5]};
  svg {
    font-size: 1.75rem;
    cursor: pointer;
  }
  span {
    margin-left: 0.25rem;
    font-size: 0.8rem;
    padding-bottom: 0.25rem;
  }
`;

// 좋아요
const Likes = styled.div`
  display: flex;
  align-items: center;
  svg {
    &:hover {
      color: ${oc.gray[6]};
    }
    &:active {
      color: ${oc.pink[6]};
    }
  }
  ${props =>
    props.active &&
    `
        svg {
            color: ${oc.pink[6]};
            &:hover {
                color: ${oc.pink[5]};
            }
        }
    `}
`;

// 덧글, 우측정렬됨
const Comments = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  svg {
    &:hover {
      color: ${oc.gray[6]};
    }
    &:active {
      color: ${oc.cyan[6]};
    }
  }
`;
const PostFooter = ({
  liked,
  likesCount = 0,
  comments = [],
  onToggleLike,
  onCommentClick
}) => (
  <Wrapper>
    <Likes active={liked}>
      <FaHeart onClick={onToggleLike} />
      <span>좋아요 {likesCount}개</span>
    </Likes>
    <Comments>
      <FaCommentDots onClick={onCommentClick} />
      <span>덧글 {comments.length}개</span>
    </Comments>
  </Wrapper>
);
export default PostFooter;
