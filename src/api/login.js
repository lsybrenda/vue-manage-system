import request from '../utils/request';
import qs from 'qs';

export const userLogin = loginData => {
    return request({
        url: '/identity/login/',
        method: 'post',
        params: loginData
    })
}