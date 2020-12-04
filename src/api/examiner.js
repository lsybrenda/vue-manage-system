import request from '../utils/request';
import qs from 'qs';

export const fileUpload = formData => {
    return request({
        url: '/examiner/fileUpload/',
        method: 'post',
        data: formData
    });
}

export const fetchData = query => {
    return request({
        url: '/examiner/getExamList/',
        method: 'get',
        params: query
    });
}