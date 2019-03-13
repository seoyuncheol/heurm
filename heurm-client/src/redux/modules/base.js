import { handleActions, createAction } from "redux-actions";
import produce from "immer";

const SET_HEADER_VISIBLILITY = "base/SET_HEADER_VISIBILITY";
const SET_USER_MENU_VISIBLILITY = "base/SET_USER_MENU_VISIBILITY";

export const setHeaderVisibility = createAction(SET_HEADER_VISIBLILITY);
export const setUserMenuVisibility = createAction(SET_USER_MENU_VISIBLILITY);
const initialState = {
  header: {
    visible: true
  },
  userMenu: {
    visible: false
  }
};

export default handleActions(
  {
    [SET_HEADER_VISIBLILITY]: (state, action) => {
      return produce(state, draft => {
        draft.header.visible = action.payload;
      });
    },
    [SET_USER_MENU_VISIBLILITY]: (state, action) =>
      produce(state, draft => {
        draft.userMenu.visible = action.payload;
      })
  },
  initialState
);
