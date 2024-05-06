// 海底捞签到
/**
 * 海底捞小程序签到
 * cron 0 8 * * *  Hi.js
 * 
 * ========= 青龙--配置文件 ===========
 * # 项目名称
 * export hdl_token='token @ token'
 * 
 * 多账号用 换行 或 @ 分割
 * 抓包 https://superapp-public.kiwa-tech.com/activity/wxapp , 找到 _haidilao_app_token 即可
 * ====================================
 *   
 */

 let { delay, getCurrentData, getDataList, sendEmail, getCurrentTime, Env, checkEnv, SendMsg } = require('./common.js')
 const $ = new Env("海底捞兑换");
 const ckName = "hdlTk";
 let allDataList = [];
 var request = require("request");
 function getActivityId (token) {
   return new Promise((resolve, reject) => {
     request({
       url: 'https://superapp-public.kiwa-tech.com/activity/wxapp/signin/querySite',
       method: "POST",
       json: true,
       headers: {
         'Host': 'superapp-public.kiwa-tech.com',
         'deviceid': null,
         'accept': 'application/json, text/plain, */*',
         'content-type': 'application/json',
         'user-agent': 'Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160027 MMWEBSDK/20231105 MMWEBID/1420 MicroMessenger/8.0.44.2502(0x28002C51) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 miniProgram/wx1ddeb67115f30d1a',
         'reqtype': 'APPH5',
         '_haidilao_app_token': token,
         'origin': 'https://superapp-public.kiwa-tech.com',
         'x-requested-with': 'com.tencent.mm',
         'sec-fetch-site': 'same-origin',
         'sec-fetch-mode': 'cors',
         'sec-fetch-dest': 'empty',
         'referer': `https://superapp-public.kiwa-tech.com/app-sign-in/?SignInToken=${token}&source=MiniApp`
       },
       body: {"signinSource":"MiniApp"}
     }, function(error, response, body) {
       if (body && body.data && body.data.convertUrl) {
         let arr = body.data.convertUrl.split('/')
         let activityId = arr[arr.length - 1]
         resolve(activityId)
       } else {
        resolve('')
       }
     })
   })
 }

 function queryList (token, activityId) {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://superapp-public.kiwa-tech.com/activity/wxapp/exchange/queryCommodityList',
      method: "POST",
      json: true,
      headers: {
        'Host': 'superapp-public.kiwa-tech.com',
        'deviceid': null,
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160027 MMWEBSDK/20231105 MMWEBID/1420 MicroMessenger/8.0.44.2502(0x28002C51) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 miniProgram/wx1ddeb67115f30d1a',
        'reqtype': 'APPH5',
        '_haidilao_app_token': token,
        'origin': 'https://superapp-public.kiwa-tech.com',
        'x-requested-with': 'com.tencent.mm',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': `https://superapp-public.kiwa-tech.com/app-sign-in/?SignInToken=${token}&source=MiniApp`
      },
      body: {"exchangeActivityId": activityId}
    }, function(error, response, body) {
      if (body && body.data && body.data.commodityDetailList) {
        resolve(body.data.commodityDetailList)
      } else {
       resolve([])
      }
    })
  })
}
 
 // 查询签到周期
 function pay (token, activityId ,commodityId) {
   return new Promise((resolve, reject) => {
     request({
       url: 'https://superapp-public.kiwa-tech.com/activity/wxapp/exchange/exchangeCommodity',
       method: "POST",
       json: true,
       headers: {
         'Host': 'superapp-public.kiwa-tech.com',
         'deviceid': null,
         'accept': 'application/json, text/plain, */*',
         'content-type': 'application/json',
         'user-agent': 'Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160027 MMWEBSDK/20231105 MMWEBID/1420 MicroMessenger/8.0.44.2502(0x28002C51) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 miniProgram/wx1ddeb67115f30d1a',
         'reqtype': 'APPH5',
         '_haidilao_app_token': token,
         'origin': 'https://superapp-public.kiwa-tech.com',
         'x-requested-with': 'com.tencent.mm',
         'sec-fetch-site': 'same-origin',
         'sec-fetch-mode': 'cors',
         'sec-fetch-dest': 'empty',
         'referer': `https://servicewechat.com/wx1ddeb67115f30d1a/131/page-frame.html`
       },
       body: {"commodityId": commodityId, "exchangeActivityId": activityId, "exchangeResource": ''}
     }, function(error, response, body) {
      console.log(body)
       if (body.code == 'ok' && body.data) {
         resolve(body.data.validatecodedesc || body.data.validateCodeDesc)
       } else {
         resolve('')
       }
     })
     
   })
 }
 
 
 // 查询签到周期
 function queryFragment (token) {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://superapp-public.kiwa-tech.com/activity/wxapp/signin/queryFragment',
      method: "POST",
      json: true,
      headers: {
        'Host': 'superapp-public.kiwa-tech.com',
        'deviceid': null,
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160027 MMWEBSDK/20231105 MMWEBID/1420 MicroMessenger/8.0.44.2502(0x28002C51) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 miniProgram/wx1ddeb67115f30d1a',
        'reqtype': 'APPH5',
        '_haidilao_app_token': token,
        'origin': 'https://superapp-public.kiwa-tech.com',
        'x-requested-with': 'com.tencent.mm',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': `https://superapp-public.kiwa-tech.com/app-sign-in/?SignInToken=${token}&source=MiniApp`
      },
      body: {"signinSource":"MiniApp"}
    }, function(error, response, body) {
      if (body.code == 'ok') {
        console.log(body)
          console.log('碎片过期日期:' + body.data.expireDate.substring(0,10))
          if (body.data.expireDate.substring(0,10) == body.data.today.substring(0,10)) {
              resolve(true)
          } else {
           resolve(false)
          }
      } else {
        resolve(false)
      }
    })
    
  })
}
 // 方法主体
let autoSign = async () => {
  let msg = '';
  if (allDataList.length > 0) {
    if (!await queryFragment(allDataList[0])) {
      console.log('未到兑换日期,暂不兑换')
      return
    }
  } else {
    return
  }
  await delay() // 延迟
  for(let key = 0; key < allDataList.length; key++) {
    let activityId = await getActivityId(allDataList[key])
    await delay() // 延迟
    let shopList = await queryList(allDataList[key], activityId)
    await delay() // 延迟
    console.log(`-------------第${key +1 }个账号开始尝试兑换----------`)
    if (shopList.length > 0) {
      for(let i = 0; i < shopList.length; i++) {
        let item = shopList[i]
        if (item.commodityName && item.commodityName.indexOf('清油麻辣火锅') > -1) {
          // 兑换 海底捞新一代番茄火锅
          msg = await pay(allDataList[key], activityId, item.id)
          break;
        }
      }
    }
    console.log('兑换结果:' + msg)
  }
}
 
 //固定的调用方法,无需修改
 !(async () => {
   if (!(await checkEnv($, ckName))) return;
   allDataList = await checkEnv($, ckName)
   if (allDataList.length > 0) {
       await autoSign();
   }
  //  console.log(msg)
 })()
   .catch((e) => console.log(e))
   .finally(() => $.done());
 
