import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import { pender } from "redux-pender";
import * as PostAPI from "lib/api/posts";

const CHANGE_WRITE_POST_INPUT = "home/CHANGE_WRITE_POST_INPUT";
const WRITE_POST = "home/WRITE_POST";

export const changeWritePostInput = createAction(CHANGE_WRITE_POST_INPUT);
export const writePost = createAction(WRITE_POST, PostAPI.write);

const initialState = {
  writePost: {
    value: ""
  }
};

export default handleActions(
  {
    [CHANGE_WRITE_POST_INPUT]: (state, action) =>
      produce(state, draft => {
        draft.writePost.value = action.payload;
      }),
    ...pender({
      type: WRITE_POST,
      onPending: (state, action) =>
        produce(state, draft => {
          draft = writePost.value = "";
        })
    })
  },
  initialState
);
