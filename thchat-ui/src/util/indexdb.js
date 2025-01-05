/**
 * @fileoverview IndexDB 数据库工具类
 * 提供对 IndexDB 数据库的基础操作封装，包括数据的存储、读取和删除
 * 支持多个存储对象库：active、tabStorage、chatStorage、fileStorage
 */

const DB_NAME = 'thchat-db';
const DB_VERSION = 1;
const STORE_NAMES = ['active', 'tabStorage', 'chatStorage', 'kbStorage'];

class IndexDBUtil {
    /**
     * 创建 IndexDBUtil 实例并初始化数据库连接
     */
    constructor() {
        this.db = null;
        this.dbReady = this.init();
    }

    /**
     * 初始化 IndexDB 数据库连接
     */
    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error('IndexDB 数据库打开失败:', event);
                reject(event);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('IndexDB 数据库连接成功');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                STORE_NAMES.forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName);
                    }
                });
            };
        });
    }

    /**
     * 向指定的存储对象库中存储数据
     * @param {string} storeName - 存储对象库名称
     * @param {string} key - 存储键名
     * @param {any} value - 要存储的数据值
     */
    async set(storeName, key, value) {
        await this.dbReady;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const serializedValue = JSON.parse(JSON.stringify(value));
            const request = store.put(serializedValue, key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 从指定的存储对象库中获取数据
     * @param {string} storeName - 存储对象库名称
     * @param {string} key - 要获取的数据键名
     */
    async get(storeName, key) {
        await this.dbReady;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 从指定的存储对象库中删除数据
     * @param {string} storeName - 存储对象库名称
     * @param {string} key - 要删除的数据键名
     */
    async delete(storeName, key) {
        await this.dbReady;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

const indexDBUtil = new IndexDBUtil();
export default indexDBUtil;