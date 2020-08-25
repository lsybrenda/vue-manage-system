import request from '../utils/request';
import qs from 'qs';

export const fetchData = query => {
    console.log(query)
    return request({
        /* url: './table.json', */
        url: '/relation/getRelations/',
        method: 'get',
        params: query
    });
}

export const saveEditInfo = query => {
    return request({
      // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
      url: '/relation/updateRelation/',
      method: 'get',
      params: query
    })
}

export const addRelationInfo = query => {
    return request({
      url: '/relation/addRelationInfo/',
      method: 'get',
      params: query
    })
}

export const deleteRelationInfo = delList => {
    return request({
        url: '/relation/deleteRelationInfo/',
        method: 'post',
        data: delList
    });
}

export const upload = formData => {
    return request({
        url: '/relation/upload/',
        method: 'post',
        data: formData
    });
}