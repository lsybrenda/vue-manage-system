import request from '../utils/request';
import qs from 'qs';

export const fetchData = query => {
    return request({
        url: '/score/getCandidates/',
        method: 'get',
        params: query
    });
}