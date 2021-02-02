/* global XMLHttpRequest */
import React from 'react';
// import Radium from 'radium'
import { browserHistory } from 'react-router';
import axios from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';

export default (function() {
  let requestUrl = '';
  let imageUrlBase = '';
  let _isLegacyBrowser = null;
  const storage = {};

  //-----------------------------------------[7차 하이브리드앱 추가 util - start]
  let apiRootUrl = 'https://api.cash-cow.co.kr/v7.0';
  let httpOrigin = 'https://hybrid.cash-cow.co.kr/';
  let native_os = 1; //1:안드로이드, 0:ios
  let native_appver = '7.5.0';
  let native_applocale = 'kr';
  let native_bypass_emergency = 0;
  let native_cidx = 0;
  let native_R = 1;
  let onlinemall = '';
  let onlinemall_category = '';
  let onlinemall_banner = '';
  let reco_goods = '';
  let reco_goods_count = '';
  let goods = '';
  let goods_banner = '';

  let CategoryIdx = 0
  let onlinemall_offset = 1
  let goods_offset = 1
  function getGoodsOffset(){
    return goods_offset
  }
  function setGoodsOffset(int){
    goods_offset = int
  }
  function setRecoGoods(data){
    reco_goods = data
  }
  function setGoods(data){
    goods = data
  }  
  function setGoodsBanner(data){
    goods_banner = data
  }  
  function setRecoGoodsCount(data){
    reco_goods_count = data
  }
  function getRecoGoods(){
    return reco_goods
  }
  function getRecoGoodsCount(){
    return reco_goods_count
  }
  function getGoods(){
    return goods
  }
  function getGoodsBanner(){
    return goods_banner
  }


  function getOnlinemallOffset(){
    return onlinemall_offset
  }
  function setOnlinemallOffset(int){
    onlinemall_offset = int
  }
  function getCategoryIdx (){
    return CategoryIdx
  }
  function setCategoryIdx (idx){
     CategoryIdx = idx
  }

  function getOnlinemall(){
    return onlinemall
  }
  function getOnlinemallCategory(){
    return onlinemall_category
  }  
  function getOnlinemallBanner(){
    return onlinemall_banner
  }
  function setOnlinemall(data){
    onlinemall = data
  }
  function setOnlinemallCategory(data){
    onlinemall_category = data
  }
  function setOnlinemallBanner(data){
    onlinemall_banner = data
  }
  //안현상 천단위 콤마 함수 추가 by 20 09 23.
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  //안현상 쿠키값 가져오는 함수 추가 by 20 08 13.
  function getCookieValue(key) {
    let cookieKey = key + '=';
    let result = '';
    const cookieArr = document.cookie.split(';');

    for (let i = 0; i < cookieArr.length; i++) {
      if (cookieArr[i][0] === ' ') {
        cookieArr[i] = cookieArr[i].substring(1);
      }

      if (cookieArr[i].indexOf(cookieKey) === 0) {
        result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
        return result;
      }
    }
    return result;
  }
  //성인 기준값 false 추가 20 07 24
  let native_adult = false;
  //너비 기준값 false 추가 20 07 24
  let native_width = window.innerWidth;
  //Dlog 는 dev 에서만 동작하는 console.log 입니다.
  function Dlog(str) {
    if (location.href.indexOf('dev') > 1) {
      console.log(str);
    } else {
      console.log('Hello Cash-cow');
    }
  }
  //innerWidth get 함수 추가
  function getNativeWidth() {
    return native_width;
  }
  //params 값을 가져오는 함수추가 20 07 29
  function getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(location.search);
    return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
  function getNativeApiRootUrl() {
    return apiRootUrl;
  }
  //안현상 성인 값 get 함수 추가
  function getNativeAdult() {
    return native_adult;
  }
  //안현상 겟 함수 추가 20 07 23

  function getNativeOs() {
    return native_os;
  }
  function getNativeAppver() {
    return native_appver;
  }
  function getNativeApplocale() {
    return native_applocale;
  }
  function getNativeBypassEmergency() {
    return native_bypass_emergency;
  }
  function getNativeCidx() {
    return native_cidx;
  }

  function getNativeR() {
    return native_R;
  }

  //안현상 R 값 set 함수 추가
  function setR(R) {
    Dlog('set R is.........' + R);

    native_R = R;
  }
  //안현상 성인 값 set 함수 추가
  function setAdult(adult) {
    Dlog('set adult is.........' + adult);

    native_adult = adult;
  }

  //안현상 Width 값 set 함수 추가
  function setWidth(width) {
    Dlog('set width is.........' + width);

    native_width = width;
  }

  function setApiRootUrl(url) {
    if (url.substr(-1) == '/') {
      url = url.substring(0, url.length - 1);
    }
    Dlog('set api root url.........' + url);
    apiRootUrl = url;
  }

  function setHttpOrigin(origin) {
    Dlog('set http origin.........' + origin);
    httpOrigin = origin;
  }

  function setOs(os) {
    Dlog('set os.........' + os);
    native_os = os;
  }

  function setAppVer(appver) {
    Dlog('set appver.........' + appver);
    native_appver = appver;
  }

  function setCidx(cidx) {
    Dlog('set cidx.........' + cidx);
    native_cidx = cidx;
  }

  function completePullToRefresh() {
    Dlog('completePullToRefresh');
    if (isMobile.iOS()) {
      submitDataiOS({ JSB: 'completePullToRefresh' });
    } else if (isMobile.Android()) {
      submitDataAndroid('completePullToRefresh');
    }
  }

  function getPrefInfo(key) {
    Dlog('getPrefInfo....' + key);
    if (isMobile.iOS()) {
      var res = submitDataiOS({ JSB: 'getPrefInfo', key: key });
    } else if (isMobile.Android()) {
      var res = submitDataAndroid('getPrefInfo', key);
    }
    return res;
  }

  function getUuid() {
    Dlog('getUuid');
    if (isMobile.iOS()) {
      var res = submitDataiOS({ JSB: 'getUuid' });
    } else if (isMobile.Android()) {
      var res = submitDataAndroid('getUuid');
    }
    return res;
  }

  function isAdult() {
    Dlog('isAdult');
    if (isMobile.iOS()) {
      var res = submitDataiOS({ JSB: 'isAdult' });
    } else if (isMobile.Android()) {
      var res = submitDataAndroid('isAdult');
    }
    return res;
  }

  function getOS() {
    Dlog('getOS');
    if (isMobile.iOS()) {
      var res = submitDataiOS({ JSB: 'getOS' });
    } else if (isMobile.Android()) {
      var res = submitDataAndroid('getOS');
    }
    return res;
  }

  function getOsVer() {
    Dlog('getOsVer');
    if (isMobile.iOS()) {
      var res = submitDataiOS({ JSB: 'getOsVer' });
    } else if (isMobile.Android()) {
      var res = submitDataAndroid('getOsVer');
    }
    return res;
  }

  function getDeviceModel() {
    Dlog('getDeviceModel');
    if (isMobile.iOS()) {
      var res = submitDataiOS({ JSB: 'getDeviceModel' });
    } else if (isMobile.Android()) {
      var res = submitDataAndroid('getDeviceModel');
    }
    return res;
  }

  function showLoadingBar(flag) {
    Dlog('showLoadingBar...' + flag);
    if (isMobile.iOS()) {
      submitDataiOS({ JSB: 'showLoadingBar', flag: flag });
    } else if (isMobile.Android()) {
      submitDataAndroid('showLoadingBar', flag);
    }
  }

  function showBottomBar(flag) {
    Dlog('showBottomBar...' + flag);
    if (isMobile.iOS()) {
      submitDataiOS({ JSB: 'showBottomBar', flag: flag });
    } else if (isMobile.Android()) {
      submitDataAndroid('showBottomBar', flag);
    }
  }

  /*
   * [앱바(타이틀바) 설정]
   * (int) type : 0(default, 로고+알림 아이콘), 1(텍스트)
   * (string) title : 로고 대신 뿌릴 텍스트
   * (int) flag : 좌측 버튼 타입. 0(없음), 1(<), 2(X)
   */
  function setAppBar(type, title, flag) {
    Dlog('setAppBar...type/' + type + ', title/' + title + ', flag/' + flag);
    if (isMobile.iOS()) {
      var params = {
        JSB: 'setAppBar',
        type: type,
        title: encodeURI(encodeURIComponent(title)),
        flag: flag,
      };
      submitDataiOS(params);
    } else if (isMobile.Android()) {
      submitDataAndroid('setAppBar', type, title, flag);
    }
  }

  /*
   * [상품 또는 온라인몰 공유 팝업 상자 오픈]
   * @params
   * (int) type : 0(상품 공유), 1(온라인몰 공유)
   * (int) idx : 상품 또는 온라인몰 idx
   * (string) name : 상품명 또는 온라인몰 이름
   * (string) imageUrl : 이미지 URL
   * (int) reward : 리워드 포인트 또는 %
   * (string) rewardType : 리워드 type(R, F)
   * (string) storeType : 구매장소 type(B, O)
   * @return
   */
  function showShareDialog(type, idx, name, imageUrl, reward, rewardType, storeType, isAdult) {
    //안현상 isAdult 파라미터 추가 2020.07.21
    Dlog(
      'showShareDialog...type/' +
        type +
        ', idx/' +
        idx +
        ', name/' +
        name +
        ', imageUrl/' +
        imageUrl +
        ', reward/' +
        reward +
        ', rewardType/' +
        rewardType +
        ', storeType/' +
        storeType +
        ', isAdult/' +
        isAdult,
    );
    if (isMobile.iOS()) {
      var params = {
        JSB: 'showShareDialog',
        type: type,
        idx: idx,
        name: encodeURI(encodeURIComponent(name)),
        imageUrl: encodeURI(encodeURIComponent(imageUrl)),
        reward: reward,
        rewardType: rewardType,
        storeType: storeType,
        isAdult: isAdult,
      };
      var res = submitDataiOS(params);
    } else if (isMobile.Android()) {
      var res = submitDataAndroid('showShareDialog', type, idx, name, imageUrl, reward, rewardType, storeType, isAdult);
    }
  }

  function showLoginDialog() {
    Dlog('showLoginDialog');
    if (isMobile.iOS()) {
      submitDataiOS({ JSB: 'showLoginDialog' });
    } else if (isMobile.Android()) {
      submitDataAndroid('showLoginDialog');
    }
  }

  /*
   * [온라인몰로 이동(중계페이지 > 외부브라우저)]
   * (int) ccidx : 광고 idx
   * (string) name : 온라인몰 이름
   * (string) url : 온라인몰 URL
   * (string) thumb : 온라인몰 썸네일 이미지
   */
  function goToOnlineMall(ccidx, name, url, thumb) {
    Dlog('goToOnlineMall...ccidx/' + ccidx + ', name/' + name + ', url/' + url + ', thumb/' + thumb);
    if (isMobile.iOS()) {
      var params = {
        JSB: 'goToOnlineMall',
        ccidx: ccidx,
        name: encodeURI(encodeURIComponent(name)),
        url: encodeURI(encodeURIComponent(url)),
        thumb: encodeURI(encodeURIComponent(thumb)),
      };
      submitDataiOS(params);
    } else if (isMobile.Android()) {
      submitDataAndroid('goToOnlineMall', ccidx, name, url, thumb);
    }
  }

  function goToURL(url, flag) {
    Dlog('goToURL...url/' + url + ', flag/' + flag);
    if (isMobile.iOS()) {
      var params = {
        JSB: 'goToURL',
        url: url,
        flag: flag,
      };
      submitDataiOS(params);
    } else if (isMobile.Android()) {
      submitDataAndroid('goToURL', url, flag);
    }
  }

  function goToEvent(idx) {
    Dlog('goToEvent...idx/' + idx);
    if (isMobile.iOS()) {
      submitDataiOS({ JSB: 'goToEvent', idx: idx });
    } else if (isMobile.Android()) {
      submitDataAndroid('goToEvent', idx);
    }
  }

  function goToNotice(idx) {
    Dlog('goToNotice...idx/' + idx);
    if (isMobile.iOS()) {
      submitDataiOS({ JSB: 'goToNotice', idx: idx });
    } else if (isMobile.Android()) {
      submitDataAndroid('goToNotice', idx);
    }
  }
  //  url 변수 추가 by hsahn 20 08 05
  function completeLoadUrl(url) {
    Dlog('completeLoadUrl');
    if (isMobile.iOS()) {
      submitDataiOS({ JSB: 'completeLoadUrl', url: url });
    } else if (isMobile.Android()) {
      submitDataAndroid('completeLoadUrl', url);
    }
  }

  function getApiBaseUrl() {
    Dlog('getApiBaseUrl');
    if (isMobile.iOS()) {
      var res = submitDataiOS({ JSB: 'getApiBaseUrl' });
    } else if (isMobile.Android()) {
      var res = submitDataAndroid('getApiBaseUrl');
    }
    return res;
  }

  //interaction 관련 함수 추가 (showPullToRefresh / showToast / showDialog ) by 안현상 20 08 03

  function showPullToRefresh(flag) {
    Dlog('showPullToRefresh.../' + 'flag/' + flag);
    if (isMobile.iOS()) {
      var params = {
        JSB: 'showPullToRefresh',
        flag: flag,
      };
      submitDataiOS(params);
    } else if (isMobile.Android()) {
      submitDataAndroid('showPullToRefresh', flag);
    }
  }

  function showToast(text, seconds) {
    Dlog('showToast...text/' + text + ', seconds/' + seconds);
    if (isMobile.iOS()) {
      var params = {
        JSB: 'showToast',
        text: text,
        seconds: seconds,
      };
      submitDataiOS(params);
    } else if (isMobile.Android()) {
      submitDataAndroid('showToast', text, seconds);
    }
  }

  function showDialog(text, okCallback) {
    Dlog('showDialog...text/' + text + ', callback/' + okCallback);
    if (isMobile.iOS()) {
      var params = {
        JSB: 'showDialog',
        text: text,
        okCallback: okCallback,
      };
      submitDataiOS(params);
    } else if (isMobile.Android()) {
      submitDataAndroid('showDialog', text, okCallback);
    }
  }

  //함수추가-----------------------end by 안현상 20 08 03
  function getBasicParams() {
    var os = native_os;
    var appver = native_appver;
    var applocale = native_applocale;
    var bypass_emergency = native_bypass_emergency;
    var cidx = native_cidx;

    return {
      os: os,
      appver: appver,
      applocale: applocale,
      bypass_emergency: bypass_emergency,
      cidx: cidx,
    };
  }

  function fetchData(url, params, callback) {
    var api_url = apiRootUrl + url;
    var request_params = Object.assign(getBasicParams(), params);
    //console.log(request_params)

    var formData = new FormData();
    for (const [key, value] of Object.entries(request_params)) {
      formData.append(key, value);
    }

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: httpOrigin,
      },
      withCredentials: true,
      //타임아웃 시간 10초로 변경
      timeout: 10000,
    };
    axios
      .post(api_url, formData, config)
      .then((res) => {
        if (typeof callback === 'function') { 
          Dlog(res)
            if(res.data.result === 1){
              Dlog('res.data.result is..............' + res.data.result)
              callback(res);
            }else if (res.data.result === 0){
                if(url === '/product/search_keyword.json'){
                  showDialog(`검색에 실패하였습니다. \n잠시후 다시 시도해주시기 바랍니다.`, '');
                }
                else if(url === '/product/detail.json'){
                  showDialog(`상품 정보를 가져오는데 실패하였습니다. \n잠시후 다시 시도해주시기 바랍니다.`, '');
                }
                else if(url === '/online/detail.json'){
                  showDialog(`온라인몰 정보를 가져오는데 실패하였습니다. \n잠시후 다시 시도해주시기 바랍니다.`, '');
                }
                else if(url === '/online/category_list.json'){
                  showDialog(`카테고리 정보를 가져오는데 실패하였습니다.. \n잠시후 다시 시도해주시기 바랍니다.`, '');
                }
                else if(url === '/product/category_list.json'){
                  showDialog(`카테고리 정보를 가져오는데 실패하였습니다.. \n잠시후 다시 시도해주시기 바랍니다.`, '');
                }
            }
            else if(res.data.result === -1){
              //서버점검 or 강제 업데이트
              if(res.data.data.type === 'update'){
                 //강제업데이트의 경우
                showDialog(`${res.data.data.title} \n ${res.data.data.msg} `, '');
              }
              else if(res.data.data.type === 'check_server'){
                //서버점검의 경우
                showDialog(`${res.data.data.title} \n ${res.data.data.msg} `, '');
              }
            }
        }
      })
      .catch((error) => {
        if (typeof error_callback === 'function') {
          error_callback(error);
          if (error.response) {
            // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
            Dlog('error.response............');
            Dlog(error.response.data);
            Dlog(error.response.status);
            Dlog(error.response.headers);
            completePullToRefresh();
            //showLoadingBar(false);
            showDialog('네트워크 연결에 실패하였습니다. \n네트워크 연결 상태를 확인해 주세요.', '');
          } else if (error.request) {
            // 요청이 이루어 졌으나 응답을 받지 못했습니다.
            // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
            // Node.js의 http.ClientRequest 인스턴스입니다.
            Dlog('error.request............');
            if (error.code === 'ECONNABORTED') {
              showDialog('네트워크가 현재 지연되고 있습니다. \n잠시만 기다려 주시기 바랍니다.', '');
              completePullToRefresh();
              //showLoadingBar(false);
            } else {
              Dlog('Error code is.................' + error.code);
              showDialog('잠시 서비스에 일시적인 오류가 있습니다. \n잠시후 다시 시도해주시기 바랍니다.', '');
              completePullToRefresh();
              //showLoadingBar(false);
            }
          } 
          else {
            // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
            Dlog('Error is.........' + error.message);
            Dlog('오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다............');
            completePullToRefresh();
            //showLoadingBar(false);
            showDialog('네트워크 연결에 실패하였습니다. \n네트워크 연결 상태를 확인해 주세요..', '');
          }
          Dlog(error.config);
          Dlog('error.config............');
        }
      });
  }

  function fetchDataPromise(promise, callback, error_callback, pass) {
    var promise_arr = [];
    promise.map(function(item) {
      var api_url = apiRootUrl + item.url;
      var request_params = Object.assign(getBasicParams(), item.params);
      //console.log(request_params)
      var param_str = '';
      for (const [key, value] of Object.entries(request_params)) {
        param_str += '&' + key + '=' + value;
      }

      promise_arr.push(
        axios({
          baseURL: api_url + '?' + param_str.trim('&'),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Origin: httpOrigin,
          },
          withCredentials: true,
          // disable the default cache and set the cache flag
          adapter: cacheAdapterEnhancer(axios.defaults.adapter, { enabledByDefault: item.enabledByDefault }),
          //타임아웃 시간 10초로 변경
          timeout: 10000,
        }),
      );
    });

    Promise.all(promise_arr)
    .then((res) => {
      if (typeof callback === 'function') { 
        Dlog(res)
        // callback(res)
        var cnt = 0
        if(pass){
          for (var i = 0; i < res.length; i++) {
            Dlog('result is..............' + res[i].data.result)
            if(res[i].data.result === 1){
              cnt = cnt +1
            }
          }
        }
        else{
          for (var i = 0; i < res.length; i++) {
            Dlog('result is..............' + res[i].data.result)
            if(res[i].data.result === 1){
              cnt = cnt +1
            }else if (res[i].data.result === 0){
              showDialog(`잠시 서비스에 일시적인 오류가 있습니다. \n잠시후 다시 시도해주시기 바랍니다.`, '');
            }else if(res[i].data.result === -1){
              //서버점검 or 강제 업데이트
              if(res[i].data.data.type === 'update'){
                Dlog(res[i].data)
                 //강제업데이트의 경우
                showDialog(`${res[i].data.data.title} \n ${res[i].data.data.msg} `, '');
                break
              }
              else if(res[i].data.data.type === "check_server"){
                //서버점검의 경우
                showDialog(`${res[i].data.data.title} \n ${res[i].data.data.msg} `, '');
                break
              }
            }          
          }
        }


        if(cnt === res.length){
          callback(res)
        }
       
      }
    })
      .catch((error) => {
        if(!pass){
          if (typeof error_callback === 'function') {
            error_callback(error);
            Dlog(error.response)
  
            if (error.response) {
              // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
              Dlog('error.response............');
              Dlog(error.response.data);
              Dlog(error.response.status);
              Dlog(error.response.headers);
              completePullToRefresh();
              //showLoadingBar(false);
              showDialog('네트워크 연결에 실패하였습니다. \n네트워크 연결 상태를 확인해 주세요.', '');
            } else if (error.request) {
              // 요청이 이루어 졌으나 응답을 받지 못했습니다.
              // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
              // Node.js의 http.ClientRequest 인스턴스입니다.
              Dlog('error.request............');
              if (error.code === 'ECONNABORTED') {
                showDialog('네트워크가 현재 지연되고 있습니다. \n잠시만 기다려 주시기 바랍니다.', '');
                completePullToRefresh();
                //showLoadingBar(false);
              } else {
                showDialog('잠시 서비스에 일시적인 오류가 있습니다. \n잠시후 다시 시도해주시기 바랍니다.', '');
                completePullToRefresh();
                //showLoadingBar(false);
              }
            } 
            else {
              // 그외의 오류
              Dlog('Error is.........' + error.message);
              Dlog('오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다............');
              completePullToRefresh();
              //showLoadingBar(false);
              showDialog('네트워크 연결에 실패하였습니다. \n네트워크 연결 상태를 확인해 주세요.', '');
            }
            Dlog(error.config);
            Dlog('error.config............');
          }
        }

      });
  }

  //페이징 위치 도달 여부 체크
  function checkPagingAppend(element) {
    //다음 페이지를 미리 호출할 위치를 조정하기 위한 화면 기준 배율
    var br = 10;
    //viewport 높이
    var vh = window.innerHeight;
    //console.log('vh is................' + vh)
    //페이징을 위한 element 시작위치(document에서) 설정
    var ep = element.offsetTop;
    //console.log('ep is..........' + ep)
    //페이징을 위한 element 높이 설정
    var eh = element.offsetHeight;
    //console.log('eh is..........' + eh)
    //console.log("base info ep/eh..." + ep + " / " + eh)
    var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //console.log('deadline은 ' + ((ep+eh) - br*vh) + ' 입니다. 현재 스크롤의 높이는 ' + bodyScrollTop);
    //페이징 블록의 맨 밑단에서 부터 화면의 br 배수에 스크롤이 도달하면 페이징을 시작
    if (ep + eh - br * vh <= bodyScrollTop) {
      return true;
    } else {
      return false;
    }
  }

  //min ~ max 랜덤한 integer 값 획득
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //-----------------------------------------[7차 하이브리드앱 추가 util - end]

  /*
  function ConfiguredRadium (component) {
    return Radium({
      plugins: [
        Radium.Plugins.mergeStyleArray,
        Radium.Plugins.checkProps,
        Radium.Plugins.resolveMediaQueries,
        Radium.Plugins.resolveInteractionStyles,
        Radium.Plugins.keyframes,
        Radium.Plugins.visited,
        Radium.Plugins.removeNestedStyles,
        Radium.Plugins.prefix,
        Radium.Plugins.checkProps
      ]
    })(component)
  }

  function createReactClass (options) {
    return ConfiguredRadium(React.createClass(options))
  }
*/
  function getQueryParameters(str) {
    return (str || document.location.search).replace(/(^\?)/, '').split('&').map(
      function(n) {
        let tokens = n.split('=');
        this[tokens[0]] = tokens[1];
        return this;
      }.bind({}),
    )[0];
  }

  function setRequestUrl(url) {
    requestUrl = url;
  }

  function getRequestUrl() {
    return requestUrl;
  }

  function setImageUrlBase(url) {
    imageUrlBase = url;
  }

  function getImageUrlBase() {
    return imageUrlBase;
  }

  function getImageUrl(url) {
    return imageUrlBase + url;
  }

  function getQueryString(params) {
    var queryString = '?';

    if (params && typeof params === 'object') {
      var keys = Object.keys(params);

      if (keys.length > 0) {
        keys.forEach(function(key, idx) {
          queryString += (idx ? '&' : '') + key + '=' + params[key];
        });
      }
    }

    return queryString;
  }

  function goToPage(url, params) {
    window.location.href = url + getQueryString(params);
  }

  function getUrlOfCurrentPageWithNewParams(params) {
    var currentUrl = window.location.href;
    var baseUrl = currentUrl.split('?')[0];

    return baseUrl + getQueryString(params);
  }

  function pointString(point, unit) {
    unit = unit ? unit : 'P';
    if (typeof point === 'number') {
      point = point.toString();
    } else if (point === null || point === undefined) {
      point = '0';
    }

    var charsPerDelimiter = 3;
    var splittedDigits = [];

    for (var i = 0; ; i++) {
      var tail =
        i === 0 ? point.slice(-charsPerDelimiter) : point.slice(-(i + 1) * charsPerDelimiter, -i * charsPerDelimiter);

      if (tail.length === 0) {
        break;
      } else {
        splittedDigits.push(tail);
      }
    }

    var result = '';

    splittedDigits.reverse();
    splittedDigits.forEach(function(substring, idx) {
      result += (idx === 0 ? '' : ',') + substring;
    });

    return result + unit;
  }

  // below taken from http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
  function getScrollXY() {
    var scrOfX = 0;
    var scrOfY = 0;
    if (typeof window.pageYOffset === 'number') {
      // Netscape compliant
      scrOfY = window.pageYOffset;
      scrOfX = window.pageXOffset;
    } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
      // DOM compliant
      scrOfY = document.body.scrollTop;
      scrOfX = document.body.scrollLeft;
    } else if (
      document.documentElement &&
      (document.documentElement.scrollLeft || document.documentElement.scrollTop)
    ) {
      // IE6 standards compliant mode
      scrOfY = document.documentElement.scrollTop;
      scrOfX = document.documentElement.scrollLeft;
    }
    return [scrOfX, scrOfY];
  }

  // taken from http://james.padolsey.com/javascript/get-document-height-cross-browser/
  function getDocHeight() {
    var D = document;
    return Math.max(
      D.body.scrollHeight,
      D.documentElement.scrollHeight,
      D.body.offsetHeight,
      D.documentElement.offsetHeight,
      D.body.clientHeight,
      D.documentElement.clientHeight,
    );
  }

  function isScrollAtBottom() {
    return getDocHeight() === getScrollXY()[1] + window.innerHeight;
  }

  function getDate(date) {
    return date.split(' ')[0];
  }

  function isLegacyBrowser() {
    if (_isLegacyBrowser == null) {
      var ua = navigator.userAgent;

      if (/Android 4/.test(ua)) {
        _isLegacyBrowser = true;
      } else {
        _isLegacyBrowser = false;
      }
    }

    return _isLegacyBrowser;
  }

  function merge(x, y) {
    var newX = {};

    if (y === null || y === undefined) {
      y = {};
    }

    if (typeof x === 'object' && typeof y === 'object') {
      Object.keys(x).forEach(function(key) {
        // Warning: typeof null is 'object'!
        if (y[key] && typeof y[key] === 'object') {
          newX[key] = merge(x[key], y[key]);
        } else if (y.hasOwnProperty(key)) {
          newX[key] = y[key];
        } else {
          newX[key] = x[key];
        }
      });

      Object.keys(y).forEach(function(key) {
        if (!x.hasOwnProperty(key)) {
          newX[key] = y[key];
        }
      });
    }

    return newX;
  }

  // https://github.com/FormidableLabs/radium/blob/master/src/merge-styles.js
  function isNestedStyle(value) {
    // Don't merge objects overriding toString, since they should be converted
    // to string values.
    return value && value.constructor === Object && value.toString === Object.prototype.toString;
  }

  function mergeStyles(styles) {
    const result = {};

    styles.forEach((style) => {
      if (!style || typeof style !== 'object') {
        return;
      }

      if (Array.isArray(style)) {
        style = mergeStyles(style);
      }

      Object.keys(style).forEach((key) => {
        // Simple case, nothing nested
        if (!isNestedStyle(style[key]) || !isNestedStyle(result[key])) {
          result[key] = style[key];
          return;
        }

        // If nested media, don't merge the nested styles, append a space to the
        // end (benign when converted to CSS). This way we don't end up merging
        // media queries that appear later in the chain with those that appear
        // earlier.
        if (key.indexOf('@media') === 0) {
          let newKey = key;
          // eslint-disable-next-line no-constant-condition
          while (true) {
            newKey += ' ';
            if (!result[newKey]) {
              result[newKey] = style[key];
              return;
            }
          }
        }

        // Merge all other nested styles recursively
        result[key] = mergeStyles([result[key], style[key]]);
      });
    });

    return result;
  }

  function XhrSend(method, options) {
    const xhr = new XMLHttpRequest();

    // appver이 필수적으로 넘어가야한다 by hsji 181001
    options.data.appver = getAppver();

    let data = null;
    let url;

    if (method === 'GET') {
      const params = options.data || {};

      if (!options.cached) {
        params.timestamp = new Date().getTime();
      }

      url = options.url + getQueryString(params);
    } else {
      url = options.url;
    }

    /** change by simje 180530
     * XMLHttpRequest.open() 메소드 세번쨰 파라미터는 async 이며 디폴트는 true이다.
    xhr.open(method, url, true)
     */
    if ('async' in options && typeof options.async === 'boolean') {
      xhr.open(method, url, options.async);
    } else {
      options.async = true;
      xhr.open(method, url, true);
    }

    /* XHR은 비동기일 때에만 timeout을 처리한다 */
    if (options.async === true) {
      if ('timeout' in options && typeof options.timeout === 'number') {
        console.log('options.timeout=' + options.timeout);
        xhr.timeout = options.timeout;
      }
    }

    xhr.ontimeout = () => {
      console.log('XMLHttpRequest.ontimeout');
      if (options.error) {
        options.error(xhr.statusText);
      }
    };

    if (method === 'POST') {
      if (options.data && typeof options.data === 'object') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        data = getQueryString(options.data).substr(1);
      } else {
        throw 'Query data must be an object.';
      }
    }

    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (options.success) {
            try {
              options.success(JSON.parse(xhr.responseText));
            } catch (e) {
              if (options.error) {
                options.error(e);
              }
              console.error(e);
              console.error(`XhrHttpRequest responseText: ${xhr.responseText}`);
            }
          }
        } else {
          if (options.error) {
            options.error(xhr.statusText);
          }
        }
      }

      if (options.done) {
        options.done();
      }
    };

    xhr.send(data);
  }

  function XhrGet(options) {
    XhrSend('GET', options);
  }

  function XhrPost(options) {
    XhrSend('POST', options);
  }

  function getCidx() {
    //return parseInt(document.getElementById('main').getAttribute('data-cidx'))
    return document.getElementById('main').getAttribute('data-cidx');
  }

  //앱 버전 획득 by ksson 2017 05 10
  function getAppver() {
    return document.getElementById('main').getAttribute('data-appver');
  }

  //기부하기를 숨겨야 하는 버전인지 체크한다. by ksson 2017 05 10
  function checkHideDonation() {
    //현재 대상은 ios이면서 $GLOBALS['ios_hide_donation_appver'] 에 설정된 버전이다.
    if (isMobile.iOS()) {
      var appver = getAppver();
      var targetver = document.getElementById('main').getAttribute('data-ios_hide_donation_appver');

      if (appver != null && targetver != null && appver == targetver) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  //기부하기를 외부웹에서 띄우는 것인지 확인한다. by ksson 2017 05 30
  function checkExternalDonation() {
    var externalFlag = false;
    var targetVersion = '5.1.10';
    var curVersion = getAppver();
    //ios 5.1.10 이상부터 외부에 띄우도록 한다. by ksson 170608
    if (versionCompare(curVersion, targetVersion) >= 0) {
      externalFlag = true;
    }

    // 현재 대상은 ios이면서 switch 설정값이 true 면 수행한다.
    if (isMobile.iOS() && externalFlag) {
      return true;
    } else {
      return false;
    }
  }

  // Return 1 if a > b
  // Return -1 if a < b
  // Return 0 if a == b
  function versionCompare(a, b) {
    if (a === b) {
      return 0;
    }

    var a_components = a.split('.');
    var b_components = b.split('.');

    var len = Math.min(a_components.length, b_components.length);

    // loop while the components are equal
    for (var i = 0; i < len; i++) {
      // A bigger than B
      if (parseInt(a_components[i]) > parseInt(b_components[i])) {
        return 1;
      }

      // B bigger than A
      if (parseInt(a_components[i]) < parseInt(b_components[i])) {
        return -1;
      }
    }

    // If one's a prefix of the other, the longer one is greater.
    if (a_components.length > b_components.length) {
      return 1;
    }

    if (a_components.length < b_components.length) {
      return -1;
    }

    // Otherwise they are the same.
    return 0;
  }

  const isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
    },
  };

  function submitDataiOS(param) {
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', `jscall:${JSON.stringify(param)}`);
    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;
  }

  ///*
  //ccv7intapp 에서 CashcowMain 로 변경 by hsahn 20 08 28
  function submitDataAndroid(func, ...params) {
    if (window.CashcowMain) {
      var ret = window.CashcowMain[func](...params);
      return ret;
    }
  }
  //*/

  /*
  function submitDataAndroid(func, param1, param2, param3, param4, param5, param6, param7) {
    if (typeof window.Ccv7IntApp !== 'undefined' && typeof window.Ccv7IntApp[func] === 'function') {
      var ret = '';
      if (param1 !== null && param1 !== undefined) {
        if (param2 !== null && param2 !== undefined) {
          if (param3 !== null && param3 !== undefined) {
            if (param4 !== null && param4 !== undefined) {
              if (param5 !== null && param5 !== undefined) {
                if (param6 !== null && param6 !== undefined) {
                  if (param7 !== null && param7 !== undefined) {
                    ret = window.Ccv7IntApp[func](param1, param2, param3, param4, param5, param6, param7);
                  } else {
                    ret = window.Ccv7IntApp[func](param1, param2, param3, param4, param5, param6);
                  }
                } else {
                  ret = window.Ccv7IntApp[func](param1, param2, param3, param4, param5);
                }
              } else {
                ret = window.Ccv7IntApp[func](param1, param2, param3, param4);
              }
            } else {
              ret = window.Ccv7IntApp[func](param1, param2, param3);
            }
          } else {
            ret = window.Ccv7IntApp[func](param1, param2);
          }
        } else {
          ret = window.Ccv7IntApp[func](param1);
        }
      } else {
        ret = window.Ccv7IntApp[func]();
      }
      return ret;
    }
  }
  */

  // function submitPoint(point) {
  //   if (isMobile.iOS()) {
  //     submitDataiOS({ submitPoint: point });
  //   } else if (isMobile.Android()) {
  //     submitDataAndroid('submitPoint', point);
  //   }
  // }

  // function submitTitle(title, logo) {
  //   // appver이 6 이면 TitleBar에 로고이미지를 출력
  //   var appver = getAppver();
  //   appver = appver.substr(0, 1);

  //   if (appver == 6) {
  //     logo = logo ? logo : '';

  //     if (isMobile.iOS()) {
  //       var param = {
  //         submitTitle: encodeURI(encodeURIComponent(title)),
  //         imgUrl: encodeURI(encodeURIComponent(logo)),
  //       };
  //       submitDataiOS(param);
  //     } else if (isMobile.Android()) {
  //       submitDataAndroid('submitTitle', title, logo);
  //     }
  //   } else {
  //     if (isMobile.iOS()) {
  //       submitDataiOS({ submitTitle: encodeURI(encodeURIComponent(title)) });
  //     } else if (isMobile.Android()) {
  //       submitDataAndroid('submitTitle', title);
  //     }
  //   }
  // }

  // function callDonationList() {
  //   // appver이 5 이면 수행
  //   var appver = getAppver();
  //   appver = appver.substr(0, 1);

  //   if (appver == 5) {
  //     if (isMobile.iOS()) {
  //       submitDataiOS({ callDonationList: true });
  //     } else if (isMobile.Android()) {
  //       submitDataAndroid('callDonationList');
  //     }
  //   }
  // }

  // function mall_showBottomBar(show) {
  //   // appver이 5 이면 수행
  //   var appver = getAppver();
  //   appver = appver.substr(0, 1);

  //   if (appver == 5) {
  //     if (isMobile.iOS()) {
  //       submitDataiOS({ showBottomBar: show });
  //     } else if (isMobile.Android()) {
  //       submitDataAndroid('showBottomBar', show);
  //     }
  //   }
  // }

  // // 0 : 없음, 1 : <, 2 : X
  // function showBackButton(show) {
  //   // appver 5 이면 파라미터를 boolean으로
  //   var appver = getAppver();
  //   appver = appver.substr(0, 1);

  //   if (appver == 5) {
  //     show = show == 0 ? false : true;
  //   }

  //   if (isMobile.iOS()) {
  //     submitDataiOS({ showBackButton: show });
  //   } else if (isMobile.Android()) {
  //     submitDataAndroid('showBackButton', show);
  //   }
  // }

  // function showDonationListButton(show) {
  //   // appver이 5 이면 수행
  //   var appver = getAppver();
  //   appver = appver.substr(0, 1);

  //   if (appver == 5) {
  //     if (isMobile.iOS()) {
  //       submitDataiOS({ showDonationListButton: show });
  //     } else if (isMobile.Android()) {
  //       submitDataAndroid('showDonationListButton', show);
  //     }
  //   }
  // }

  // // 0: 없음, 1: 쿠폰함 이동, 2: 잔여포인트 출력
  // function showRightComponent(show) {
  //   // appver이 6 이면 수행
  //   var appver = getAppver();
  //   appver = appver.substr(0, 1);

  //   if (appver == 6) {
  //     if (isMobile.iOS()) {
  //       submitDataiOS({ showRightComponent: show });
  //     } else if (isMobile.Android()) {
  //       submitDataAndroid('showRightComponent', show);
  //     }
  //   }
  // }

  // // insert by simje 190503
  // // cashcow(dev):// 로 시작하는 앱스킴이 iOS 12.2에서 먹지 않아서 대체(테스트)용
  // function requestScheme(scheme) {
  //   // appver이 6 이면 수행
  //   var appver = getAppver();
  //   appver = appver.substr(0, 1);

  //   if (appver == 6) {
  //     if (isMobile.iOS()) {
  //       submitDataiOS({ scheme: scheme });
  //     } else if (isMobile.Android()) {
  //       submitDataAndroid('scheme', scheme);
  //     }
  //   }
  // }

  // // 웹뷰 닫기
  // function closeWebview() {
  //   if (isMobile.iOS()) {
  //     submitDataiOS({ closeWebview: true });
  //   } else if (isMobile.Android()) {
  //     submitDataAndroid('closeWebview', true);
  //   }
  // }

  // // 타이틀바 하단 border 삭제
  // function titlebarBottomBorder(show) {
  //   var appver = getAppver();
  //   appver = appver.substr(0, 1);

  //   if (appver == 6) {
  //     if (isMobile.iOS()) {
  //       submitDataiOS({ titlebarBottomBorder: show });
  //     } else if (isMobile.Android()) {
  //       submitDataAndroid('titlebarBottomBorder', show);
  //     }
  //   }
  // }

  // // 타이틀바 disabled
  // function disabledTitleBar(disabled) {
  //   var appver = getAppver();
  //   appver = appver.substr(0, 1);

  //   if (appver == 6) {
  //     if (isMobile.iOS()) {
  //       submitDataiOS({ disabledTitleBar: disabled });
  //     } else if (isMobile.Android()) {
  //       submitDataAndroid('disabledTitleBar', disabled);
  //     }
  //   }
  // }

  // // 로딩바 제어
  // function mall_showLoadingBar(show) {
  //   var appver = getAppver();
  //   appver = appver.substr(0, 1);

  //   if (appver == 6) {
  //     if (isMobile.iOS()) {
  //       submitDataiOS({ showLoadingBar: show });
  //     } else if (isMobile.Android()) {
  //       submitDataAndroid('showLoadingBar', show);
  //     }
  //   }
  // }

  // function saveFile(url, filename) {
  //   if (isMobile.iOS()) {
  //     if (window.location.href.indexOf('devmall') !== -1) {
  //       location.href = `cashcowdev://filedown/?url=${url}`;
  //     } else {
  //       location.href = `cashcow://filedown/?url=${url}`;
  //     }
  //   } else if (isMobile.Android()) {
  //     submitDataAndroid('saveFile', url, filename);
  //   }
  // }

  // function updateRemainingPoints(newPoint) {
  //   if (MallData) {
  //     if (MallData.user && MallData.user.data) {
  //       MallData.user.data.remaining_point = newPoint;
  //       submitPoint(newPoint);
  //     }
  //   }
  // }

  // function getUserPoints() {
  //   if (MallData) {
  //     if (MallData.user && MallData.user.data) {
  //       return MallData.user.data.remaining_point;
  //     }
  //   }

  //   return 0;
  // }

  // function initializeMallData() {
  //   if (typeof MallData === 'undefined') {
  //     MallData = {};
  //   } else {
  //     const currentDate = new Date();

  //     Object.keys(MallData).forEach((key) => {
  //       MallData[key].lastUpdateTime = currentDate;

  //       if (key === 'user') {
  //         const point = MallData[key].data && MallData[key].data.remaining_point;

  //         submitPoint(point);
  //       }
  //     });
  //   }
  // }

  // function remember(key, value) {
  //   storage[key] = value;
  // }

  // function recall(key) {
  //   return storage[key];
  // }

  // function encryptBase64(pText) {
  //   var result = '';
  //   if (isMobile.iOS()) {
  //     /*
  //     if(window.location.href.indexOf('devmall') !== -1) {
  //       location.href = `cashcowdev://filedown/?url=${url}`
  //     } else {
  //       location.href = `cashcow://filedown/?url=${url}`
  //     }
  //     */
  //     console.log('do not support');
  //   } else if (isMobile.Android()) {
  //     result = submitDataAndroid('encryptBase64', pText, null);
  //     console.log(result);
  //   }
  //   return result;
  // }

  // function decryptBase64(cText) {
  //   var result = '';
  //   if (isMobile.iOS()) {
  //     /*
  //     if(window.location.href.indexOf('devmall') !== -1) {
  //       location.href = `cashcowdev://filedown/?url=${url}`
  //     } else {
  //       location.href = `cashcow://filedown/?url=${url}`
  //     }
  //     */
  //     console.log('do not support');
  //   } else if (isMobile.Android()) {
  //     result = submitDataAndroid('decryptBase64', cText, null);
  //   }
  //   return result;
  // }

  // const constants = {
  //   mallHeaderHeightInPx: 50,
  // };

  return {
    //----- 7차 추가 함수 시작
    ///////////////////////////
    getGoodsOffset : getGoodsOffset,
    setGoodsOffset : setGoodsOffset,
    setRecoGoods : setRecoGoods,
    setRecoGoodsCount : setRecoGoodsCount,
    setGoods : setGoods,
    setGoodsBanner : setGoodsBanner,
    getRecoGoods : getRecoGoods,
    getRecoGoodsCount : getRecoGoodsCount,
    getGoods : getGoods,
    getGoodsBanner : getGoodsBanner,
    getOnlinemallOffset : getOnlinemallOffset,
    setOnlinemallOffset : setOnlinemallOffset,
    getCategoryIdx : getCategoryIdx,
    setCategoryIdx : setCategoryIdx,
    getOnlinemall : getOnlinemall,
    getOnlinemallCategory : getOnlinemallCategory,
    getOnlinemallBanner : getOnlinemallBanner,
    setOnlinemall : setOnlinemall,
    setOnlinemallCategory : setOnlinemallCategory,
    setOnlinemallBanner : setOnlinemallBanner,
    numberWithCommas : numberWithCommas,
    Dlog: Dlog,
    getNativeR: getNativeR,
    getCookieValue: getCookieValue,
    setR: setR,
    setWidth: setWidth,
    getNativeWidth: getNativeWidth,
    showPullToRefresh: showPullToRefresh,
    showToast: showToast,
    showDialog: showDialog,
    getNativeApiRootUrl: getNativeApiRootUrl,
    getParameterByName: getParameterByName,
    getNativeOs: getNativeOs,
    getNativeAppver: getNativeAppver,
    getNativeApplocale: getNativeApplocale,
    getNativeBypassEmergency: getNativeBypassEmergency,
    getNativeCidx: getNativeCidx,
    getNativeAdult: getNativeAdult,
    setAdult: setAdult,
    setApiRootUrl: setApiRootUrl,
    setHttpOrigin: setHttpOrigin,
    setOs: setOs,
    setAppVer: setAppVer,
    setCidx: setCidx,

    completePullToRefresh: completePullToRefresh,
    getPrefInfo: getPrefInfo,
    getUuid: getUuid,
    isAdult: isAdult,
    getOS: getOS,

    getOsVer: getOsVer,
    getDeviceModel: getDeviceModel,
    showLoadingBar: showLoadingBar,
    showBottomBar: showBottomBar,
    setAppBar: setAppBar,
    showShareDialog: showShareDialog,
    showLoginDialog: showLoginDialog,
    goToOnlineMall: goToOnlineMall,
    goToURL: goToURL,
    goToEvent: goToEvent,
    goToNotice: goToNotice,
    completeLoadUrl: completeLoadUrl,
    getApiBaseUrl: getApiBaseUrl,

    getBasicParams: getBasicParams,
    fetchData: fetchData,
    fetchDataPromise: fetchDataPromise,
    checkPagingAppend: checkPagingAppend,
    getRandomInt: getRandomInt,
    //----- 7차 추가 함수 끝
    // createReactClass: createReactClass,
    getQueryParameters: getQueryParameters,
    setRequestUrl: setRequestUrl,
    getRequestUrl: getRequestUrl,
    setImageUrlBase: setImageUrlBase,
    getImageUrlBase: getImageUrlBase,
    getImageUrl: getImageUrl,
    goToPage: goToPage,
    getUrlOfCurrentPageWithNewParams: getUrlOfCurrentPageWithNewParams,
    pointString: pointString,
    getScrollXY: getScrollXY,
    getDocHeight: getDocHeight,
    isScrollAtBottom: isScrollAtBottom,
    getDate: getDate,
    isLegacyBrowser: isLegacyBrowser,
    merge: merge,
    mergeStyles,
    // ConfiguredRadium: ConfiguredRadium,
    XhrGet: XhrGet,
    XhrPost: XhrPost,
    getCidx: getCidx,
    getAppver: getAppver,
    checkHideDonation: checkHideDonation,
    checkExternalDonation: checkExternalDonation,
    // submitPoint: submitPoint,
    // submitTitle: submitTitle,
    // callDonationList,
    // mall_showBottomBar,
    // showBackButton,
    // showDonationListButton,
    // showRightComponent,
    // requestScheme,
    // saveFile,
    // constants: constants,
    // updateRemainingPoints: updateRemainingPoints,
    // getUserPoints: getUserPoints,
    // initializeMallData: initializeMallData,
    // remember,
    // recall,
    // isMobile,
    versionCompare: versionCompare,
    // closeWebview,
    // titlebarBottomBorder,
    // disabledTitleBar,
    // mall_showLoadingBar,
    // encryptBase64,
    // decryptBase64,
  };
})();
