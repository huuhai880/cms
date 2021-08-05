import Api from "./ApiRestful";
import { store } from "../store";
import { userAuthSet } from "../actions/user";

const api = new Api();
window._apiInst = api;

const headers = () => {
  const state = store.getState();
  const {
    userAuth: { accessToken, tokenKey, tokenType },
  } = state;
  return {
    headers: {
      [tokenKey]: `${tokenType} ${accessToken}`,
    },
  };
};

const refreshToken = () => {
  const _static = window._globModelUser;
  api
    .addEventListener("beforeRequest", (event) => {
      let {
        args: { config },
      } = event;
      // Inject 'header'
      let { headers = {} } = config;
      // +++ auth token data
      let { name: hAuthName, value: hAuthValue } = _static.buildAuthHeader();
      if (hAuthName && hAuthValue) {
        headers[hAuthName] = hAuthValue;
      }
      Object.assign(config, { headers });
      //.end*/
      // console.log('beforeRequest: ', config);
    })
    .addEventListener("request", (event) => {
      let {
        args: { /* config, */ incomming },
      } = event;
      //
      incomming.then((apiData) => {
        delete apiData._;
        // chain call
        return apiData;
      });
    })
    .addEventListener("beforeRefreshToken", (event) => {
      let { args: authData } = event;
      let userAuth = _static.getUserAuthStatic();
      Object.assign(authData, userAuth);
    })
    .addEventListener("afterRefreshToken", (event) => {
      let { args: authData } = event;
      _static.storeUserAuthStatic(authData);
    });
};

const fnGet = async ({ url, query = {}, _config = {} }) => {
  refreshToken();
  const config = { ..._config };
  const data = await api.get(url, query, config);
  return data;
};

const fnPost = async ({ url, body = {} }) => {
  refreshToken();
  const data = await api.post(url, body);
  return data;
};

const fnUpdate = async ({ url, body = {} }) => {
  refreshToken();
  const data = await api.put(url, body);
  return data;
};

const fnDelete = async ({ url }) => {
  refreshToken();
  const data = await api.delete(url);
  return data;
};

export { fnGet, fnUpdate, fnDelete, fnPost };
