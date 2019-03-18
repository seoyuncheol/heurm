import { createAction, handleActions } from "redux-actions";

import produce from "immer";
import * as PostAPI from "lib/api/posts";
import { pender } from "redux-pender";

const LOAD_POST = "posts/LOAD_POST";
const PREFETCH_POST = "posts/PREFETCH_POST";
const SHOW_PREFETCHED_POST = "posts/SHOW_PREFETCHED_POST";
const RECEIVE_NEW_POST = "posts/RECEIVE_NEW_POST";
const LIKE_POST = "posts/LIKE_POST";
const UNLIKE_POST = "posts/UNLIKE_POST";

// 덧글
const TOGGLE_COMMENT = "posts/TOGGLE_COMMENT";
const CHANGE_COMMENT_INPUT = "posts/CHANGE_COMMENT_INPUT";

export const loadPost = createAction(LOAD_POST, PostAPI.list);
export const prefetchPost = createAction(PREFETCH_POST, PostAPI.next);
export const showPrefetchedPost = createAction(SHOW_PREFETCHED_POST);
export const receiveNewPost = createAction(RECEIVE_NEW_POST);
export const toggleComment = createAction(TOGGLE_COMMENT);
export const changeCommentInput = createAction(CHANGE_COMMENT_INPUT);

export const likePost = createAction(
  LIKE_POST,
  PostAPI.like,
  payload => payload
);
export const unlikePost = createAction(
  UNLIKE_POST,
  PostAPI.unlike,
  payload => payload
);

const initialState = {
  next: "",
  data: [],
  nextData: [],
  comments: {}
};

export default handleActions(
  {
    ...pender({
      type: LOAD_POST,
      onSuccess: (state, action) => {
        const { next, data } = action.payload.data;

        return produce(state, draft => {
          draft.next = next;
          draft.data = data;
        });
      }
    }),

    ...pender({
      type: PREFETCH_POST,

      onSuccess: (state, action) => {
        const { next, data } = action.payload.data;
        return produce(state, draft => {
          draft.next = next;
          draft.nextData = data;
        });
      }
    }),

    [SHOW_PREFETCHED_POST]: (state, action) =>
      produce(state, draft => {
        let { data, nextData } = state;
        data = data.concat(nextData);

        draft.data = data;
        draft.nextData = [];
      }),

    [RECEIVE_NEW_POST]: (state, action) =>
      produce(state, draft => {
        draft.data.unshift(action.payload);
      }),

    ...pender({
      type: LIKE_POST,
      onPending: (state, action) => {
        const index = state.data.findIndex(post => post._id === action.meta);

        return produce(state, draft => {
          let post = draft.data[index];
          post.liked = true;
          post.likesCount += 1;
        });
      },
      onSuccess: (state, action) => {
        const index = state.data.findIndex(post => post._id === action.meta);
        return produce(state, draft => {
          draft.data[index].likesCount = action.payload.data.likesCount;
        });
      }
    }),

    ...pender({
      type: UNLIKE_POST,
      onPending: (state, action) => {
        const index = state.data.findIndex(post => post._id === action.meta);

        return produce(state, draft => {
          let post = draft.data[index];
          post.liked = false;
          post.likesCount -= 1;
        });
      },
      onSuccess: (state, action) => {
        const index = state.data.findIndex(post => [post._id === action.meta]);
        return produce(state, draft => {
          draft.data[index].likesCount = action.payload.data.likesCount;
        });
      }
    }),

    [TOGGLE_COMMENT]: (state, action) =>
      produce(state, draft => {
        const comment = state.comments[action.payload];
        console.log(comment);
        if (comment) {
          draft.comments[action.payload].visible = !comment.visible;
          console.log(!comment.visible);
        }
        draft.comments[action.payload] = { visible: true, value: "" };
      }),

    [CHANGE_COMMENT_INPUT]: (state, action) =>
      produce(state, draft => {
        const { postId, value } = action.payload;
        draft.comments[postId].value = value;
      })
  },
  initialState
);
