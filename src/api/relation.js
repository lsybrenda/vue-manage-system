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