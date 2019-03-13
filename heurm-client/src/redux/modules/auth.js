import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import { pender } from "redux-pender";
import * as AuthAPI from "lib/api/auth";

const CHANGE_INPUT = "auth/CHAGNE_INPUT";
const INITIALIZE_FORM = "auth/INITIALIZE_FORM";

const CHECK_EMAIL_EXISTS = "auth/CHECK_EMAIL_EXISTS";
const CEHCK_USERNAME_EXISTS = "auth/CHECK_USERNAME_EXISTS";

const LOCAL_REGISTER = "auth/LOCAL_REGISTER";
const LOCAL_LOGIN = "auth/LOCAL_LOGIN";

const SET_ERROR = "auth/SET_ERROR"; // 오류 설정

export const changeInput = createAction(CHANGE_INPUT);
export const initializeForm = createAction(INITIALIZE_FORM);

export const checkEmailExists = createAction(
  CHECK_EMAIL_EXISTS,
  AuthAPI.checkEmailExists
);
export const checkUsernameExists = createAction(
  CEHCK_USERNAME_EXISTS,
  AuthAPI.checkUsernameExists
);

export const localRegister = createAction(
  LOCAL_REGISTER,
  AuthAPI.localRegister
);
export const localLogin = createAction(LOCAL_LOGIN, AuthAPI.localLogin);

export const setError = createAction(SET_ERROR); // { form, message }

const initalState = {
  register: {
    form: {
      email: "",
      username: "",
      password: "",
      passwordConfirm: ""
    },

    exists: {
      email: false,
      username: false
    },

    error: null
  },

  login: {
    form: {
      email: "",
      password: ""
    },

    error: null
  },

  result: {}
};

export default handleActions(
  {
    [CHANGE_INPUT]: (state, action) => {
      const { name, value, form } = action.payload;
      return produce(state, draft => {
        draft[form].form[name] = value;
      });
    },

    [initializeForm]: (state, action) => {
      const initialForm = initalState[action.payload];
      return produce(state, draft => {
        draft[action.payload] = initialForm;
      });
    },

    ...pender({
      type: CHECK_EMAIL_EXISTS,
      onSuccess: (state, action) =>
        produce(state, draft => {
          draft.register.exists.email = action.payload.data.exists;
        })
    }),

    ...pender({
      type: CEHCK_USERNAME_EXISTS,
      onSuccess: (state, action) =>
        produce(state, draft => {
          draft.register.exists.username = action.payload.data.exists;
        })
    }),

    ...pender({
      type: LOCAL_REGISTER,
      onSuccess: (state, action) =>
        produce(state, draft => {
          draft.result = action.payload.data;
        })
    }),

    ...pender({
      type: LOCAL_LOGIN,
      onSuccess: (state, action) =>
        produce(state, draft => {
          draft.result = action.payload.data;
        })
    }),
    [SET_ERROR]: (state, action) => {
      const { form, message } = action.payload;
      return produce(state, draft => {
        draft[form].error = message;
      });
    }
  },
  initalState
);
