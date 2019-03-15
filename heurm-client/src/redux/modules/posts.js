import { createAction, handleActions } from "redux-actions";

import produce from "immer";
import * as PostAPI from "lib/api/posts";
import { pender } from "redux-pender";

const LOAD_POST = "posts/LOAD_POST";
const PREFETCH_POST = "post_PREFETCH_POST";
const SHOW_PREFETCHED_POST = "post/post_SHOW_PREFETCHED_POST";
const RECEIVE_NEW_POST = "post/RECEIVE_NEW_POST";

export const loadPost = createAction(LOAD_POST, PostAPI.list);
export const prefetchPost = createAction(PREFETCH_POST, PostAPI.next);
export const showPrefetchedPost = createAction(SHOW_PREFETCHED_POST);
export const receiveNewPost = createAction(RECEIVE_NEW_POST);

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
      console.log("===========================");

      return produce(state, draft => {
        draft.data.unshift(action.payload);
      });
    }
  },
  initialState
);
