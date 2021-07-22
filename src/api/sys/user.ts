import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
  RegisterParams,
  RegisterResultModel,
} from './model/userModel';

import { RequestOptions } from '/#/axios';

enum Api {
  Login = '/v1/auth/login',
  Register = '/v1/user/register',
  Logout = '/v1/auth/logout',
  GetUserInfo = '/v1/user/info',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(
  params: LoginParams,
  options: RequestOptions = { errorMessageMode: 'modal' }
) {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    options
  );
}

export function registerApi(
  params: RegisterParams,
  options: RequestOptions = { errorMessageMode: 'modal' }
) {
  return defHttp.post<RegisterResultModel>(
    {
      url: Api.Register,
      params,
    },
    options
  );
}

/**
 * @description: getUserInfo
 */
export async function getUserInfo() {
  const user = await defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo });
  user.roles = [
    {
      roleName: 'User',
      value: 'user',
    },
  ];
  return user;
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}
