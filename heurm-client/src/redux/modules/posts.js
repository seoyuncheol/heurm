import { createAction, handleActions } from "redux-actions";

import produce from "immer";
import * as PostAPI from "lib/api/posts";
import { pender } from "redux-pender";

const LOAD_POST = "posts/LOAD_POST";
const PREFETCH_POST = "posts/post_PREFETCH_POST";
const SHOW_PREFETCHED_POST = "posts/post_SHOW_PREFETCHED_POST";
const RECEIVE_NEW_POST = "posts/RECEIVE_NEW_POST";
const LIKE_POST = "posts/LIKE_POST";
const UNLIKE_POST = "posts/UNLIKE_POST";

export const loadPost = createAction(LOAD_POST, PostAPI.list);
export const prefetchPost = createAction(PREFETCH_POST, PostAPI.next);
export const showPrefetchedPost = createAction(SHOW_PREFETCHED_POST);
export const receiveNewPost = createAction(RECEIVE_NEW_POST);
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
  nextData: []
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
      onSucess: (state, action) => {
        const nextData = state.nextData;
        return produce(state, draft => {
          draft.data.concat(nextData);
          draft.nextData = [];
        });
      }
    }),
    [RECEIVE_NEW_POST]: (state, action) => {
      return produce(state, draft => {
        draft.data.unshift(action.payload);
      });
    },

    ...pender({
      type: LIKE_POST,
      onPending: (state, action) => {
        const index = state.data.findIndex(post => post._id === action.meta);
        return produce(state, draft => {
          let post = draft.data[index];
          post.liked = true;
          post.likedCount += 1;
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
          post.likedCount -= 1;
        });
      },
      onSuccess: (state, action) => {
        const index = state.data.findIndex(post => [post._id === action.meta]);
        return produce(state, draft => {
          draft.data[index].likesCount = action.payload.data.likesCount;
        });
      }
    })
  },
  initialState
);
