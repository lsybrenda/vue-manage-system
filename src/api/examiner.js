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

export const getDetail = query => {
    return request({
        url: '/examiner/getExamDetail/',
        method: 'get',
        params: query
    });
}

export const deleteExamIds = delIDs => {
    return request({
        url: '/examiner/deleteExamIds/',
        method: 'post',
        data: {
            owner:delIDs
        }
    });
}

export const wordEmpty = function() {
    return request({
        url: '/examiner/wordEmpty/',
        method: 'post'
    })
}

export const excelEmpty = function(){
    return request({
        url: '/examiner/excelEmpty',
        method: 'post'
    })
}

export const getWordContent = function(){
    return request({
        url: '/examiner/getWordContent/',
        method: 'post'
    })
}