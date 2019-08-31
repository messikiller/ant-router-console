import axios from "axios";
import qs from 'qs';

//请求成功
function success (res,cb){
    cb && cb(res.data) 
}
//请求失败
function error (text){
    console.log(text)
}

function post (url,params,cb,noStringify = null){
    let _params = params;
    if (!noStringify){
        _params = qs.stringify(params);
    }
    axios.post (url,_params,{headers:{}}).then((res)=>{
        success (res,cb)
    }).catch((err)=>{
        error (null)  
    });
}

function get (url,params,cb){
    axios.get (url,{headers:{},params:params}).then((res)=>{
        success (res,cb)
    }).catch((err)=>{
        error (null)  
    });
}

export const getServerData = (params,cb) => {
    get('http://localhost:8080/static/json/1.json',params,cb)
}

export const getChartsData = (params,cb) => {
    get('http://localhost:8080/static/json/2.json',params,cb)
}





