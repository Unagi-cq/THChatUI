/**
 * @description 讯飞平台的接口采用WebSocket请求方式
 */
import CryptoJS from "crypto-js";
import {preProcess} from "@/util/rule";

// 四个必要参数 这里的是spark lite模型 官方已经完全免费 可无限调用
const URL = "wss://spark-api.xf-yun.com/v1.1/chat";
const APPID = "aa19c316";
const API_SECRET = "NjBkZDgwMWNiNjBjZGI0Y2I1MWJkNDBm";
const API_KEY = "414d88c1dadf5c3abb761766d5be1f14";

/**
 * 调用讯飞平台的接口
 * @param model_version 模型名
 * @param prompt 用户输入的问题
 * @param history 历史对话消息 在SendBox中限制最多三轮
 * @param groupIndex 前处理组的索引 由于不同厂商的接口参数不同，需要根据厂商的接口文档来确定传参的结构
 * @param controller 控制请求的取消
 * @param onopen 连接成功时的回调函数
 * @param onmessage 接收到消息时的回调函数
 * @param onclose 连接关闭时的回调函数
 * @param onerror 处理错误时的回调函数
 * @returns {Promise<void>}
 */
export async function remote({model_version, prompt, history, groupIndex, controller, onopen, onmessage, onclose, onerror}) {
    return new Promise((resolve, reject) => {
        let fullMsg = "";
        const webSocket = new WebSocket(getWebSocketUrl());
        webSocket.onmessage = (e) => {
            try {
                const resultData = e.data;
                console.log(resultData)
                const jsonData = JSON.parse(resultData);
                if (jsonData.header.code === 0) {
                    const msg = getContent(jsonData);
                    console.log("Got message", msg);
                    fullMsg += msg;
                    onmessage(msg);
                    if (jsonData.header.status === 2) {
                        console.log("API response finished", fullMsg);
                        webSocket.close();
                        resolve(fullMsg);
                    }
                } else {
                    const error = new Error(
                        `${jsonData.header.code}:${jsonData.header.message}`,
                    );
                    console.error("API error:", error);
                    reject(error);
                }
            } catch (e) {
                console.error("Handle message exception:", e);
                reject(e);
            }
        };
        // 监听信号中断事件
        controller.signal.addEventListener('abort', () => {
            // 当信号被中断时，关闭 WebSocket 连接
            webSocket.close();
        });
        webSocket.onerror = (e) => {
            onclose();
            reject(e);
        };
        webSocket.onopen = () => {
            onopen();
            let body = preProcess(model_version, prompt, history, groupIndex);
            body["header"] = {
                "app_id": APPID,
                "uid": "fd3f47e40d",
            }
            webSocket.send(JSON.stringify(body));
        };
        webSocket.onclose = () => {
            onclose();
        };
    });
}

function getWebSocketUrl() {
    var host = location.host;
    var date = new Date().toUTCString();
    var algorithm = "hmac-sha256";
    var headers = "host date request-line";
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`;
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, API_SECRET);
    var signature = CryptoJS.enc.Base64.stringify(signatureSha);
    var authorizationOrigin = `api_key="${API_KEY}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    var authorization = btoa(authorizationOrigin);
    return `${URL}?authorization=${authorization}&date=${date}&host=${host}`;
}

function getContent(jsonData) {
    let content = "";
    try {
        if (jsonData.header.code === 0) {
            for (const choice of jsonData.payload.choices.text) {
                content += choice.content;
            }
        }
    } catch (e) {
        console.error("Get content error:", e);
    }
    return content;
}
