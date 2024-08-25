// #ifdef MP
import {mpCheckAuthorizes} from "../src/authorize/mpAuthorizes.js";
import {promiseCallback} from "./tools.js";
// #endif
export function BluetoothAuthorize(leadText = '请允许小程序使用蓝牙') {
    return promiseCallback(mpCheckAuthorizes, 'bluetooth', leadText)
}

// 微信登录 code
export const LoginCode = () => {
    return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        uni.login({
            provider: 'weixin',
            success: function (res) {
                resolve(res);
            },
            fail: function (fail) {
                reject(fail);
            },
        });
        // #endif

    });
};


/**
 * 调起App支付
 * @param {string} provider='wxpay' 支付方式
 * @param {Object} orderInfo 订单数据
 * @param {string} orderInfo.prepayid
 * @param {string} orderInfo.appid
 * @param {string} orderInfo.partnerid
 * @param {string} orderInfo.noncestr
 * @param {string} orderInfo.timestamp
 * @param {string} orderInfo.package
 * @param {string} orderInfo.sign
 * @returns {Promise<>}
 */
export const PayMoneyApp = function ({provider, orderInfo}) {
    return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS
        uni.requestPayment({
            provider: provider || 'wxpay',
            orderInfo: orderInfo,
            success: function (PaymentSuccess) {
                resolve(PaymentSuccess);
            },
            fail: function (fail) {
                console.log(fail)
                reject(fail);
            }
        });
        // #endif
    })
}

/**
 * 微信小程序付款
 * @param {Object} paymentInfo
 * @param {string} paymentInfo.nonceStr='1713315071653'
 * @param {string} paymentInfo.package='prepay_id=wx170851119223082968c7e3942811860000'
 * @param {string} paymentInfo.paySign='5E10EBAEE6177494577D9CF9E1513236'
 * @param {string} paymentInfo.signType='MD5'
 * @param {string} paymentInfo.timeStamp='1713315072'
 * @returns {Promise<>}
 */
export const PayMoneyMp = (paymentInfo) => {
    return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        uni.requestPayment({
            timeStamp: paymentInfo.timeStamp,
            nonceStr: paymentInfo.nonceStr,
            package: paymentInfo.package,
            signType: paymentInfo.signType,
            paySign: paymentInfo.paySign,
            success(success) {
                resolve(success);
            },
            fail(fail) {
                if (fail.errMsg === 'requestPayment:fail cancel') {
                    Toast('支付取消')
                }
                reject(fail)
            },
            complete(complete) {
                resolve(complete);
            },
        });
        // #endif
        // #ifdef WEB
        resolve('WEB');
        // #endif
    });
};


/**
 * 统一提示方便全局修改
 * @param title
 * @param duration
 * @param mask
 * @param icon
 * @constructor
 */
export const Toast = (title, duration = 1500, mask = false, icon = 'none') => {
    if (!Boolean(title)) {
        return;
    }
    uni.showToast({
        title,
        duration,
        mask,
        icon
    });
}


import pagesConfig from "@/pages.json";
const {tabBar: {list: tabBarPages} = {list: []}} = pagesConfig
// const tabBarPages = []

const toTargetPage = (pagePath, parseInfo = {}, api) => {
    if (!pagePath) return;

    const pattern = /\/?([^?]+)/;
    const route = pagePath.match(pattern)[1];
    const isTabBarPage = tabBarPages.map(item => ylxFilterPath(item.pagePath)).includes(ylxFilterPath(route));


    if (isTabBarPage) {
        uni.switchTab({
            url: ylxFilterPath(route),
            fail: function (fail) {
                console.error(fail)
            }
        })
    } else {

        let startStr = pagePath.indexOf('?') === -1 ? '?' : '&';
        let queryString = '';
        if (Object.keys(parseInfo).length) {
            queryString = startStr + Object.keys(parseInfo).map((key) => `${key}=${parseInfo[key]}`).join('&');
        }

        uni[api]({
            url: ylxFilterPath(removeVueExtension(pagePath) + queryString),
            success: function (res) {
                console.log(res.errMsg)
            },
            fail: function (fail) {
                console.error('fail', fail.errMsg);
            }
        })
    }
}

/**
 * 跳转到应用内的某个页面
 * @param {string} pagePath 目标页面路径
 * @param {Object} parse={id:18} 对象参数
 */
export const NavigateTo = (pagePath, parse = {}) => toTargetPage(pagePath, parse, 'navigateTo');
/**
 * 跳转到应用内的某个页面
 * @param {string} pagePath 目标页面路径
 * @param {Object} parse={id:18} 对象参数
 */
export const RedirectTo = (pagePath, parse = {}) => toTargetPage(pagePath, parse, 'redirectTo');

export const OpenWxDebug = (env) => {
    uni.getSystemInfo({
        success(res) {
            // #ifdef MP
            const accountInfo = uni.getAccountInfoSync()
            const {miniProgram} = accountInfo
            if ((res?.brand && res.brand !== "devtools")) {
                if (process.env.NODE_ENV === 'development') {
                    // 打开调试
                    uni.setEnableDebug({
                        enableDebug: ['develop', 'trial'].includes(miniProgram.envVersion) // 区分  develop:开发版本 trial:体验版 release:正式版
                    })
                } else {
                    console.log('生产环境');

                }
            }
            // #endif

        }
    })
}

// 路径补全
const ylxFilterPath = (path) => {
    return /^\//.test(path) ? path : '/' + path
};

function removeVueExtension(filePath) {
    if (filePath.lastIndexOf('.vue') !== -1) {
        console.warn('移除.vue')
        return filePath.replace(/\.vue$/, '');
    } else {
        return filePath
    }
}
