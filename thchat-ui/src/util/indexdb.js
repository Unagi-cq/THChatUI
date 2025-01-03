const DB_NAME = 'thchat-db';
const DB_VERSION = 1;
const STORE_NAMES = ['active', 'tabStorage', 'chatStorage', 'fileStorage'];

class IndexDBUtil {
    constructor() {
        this.db = null;
        this.dbReady = this.init();
    }

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