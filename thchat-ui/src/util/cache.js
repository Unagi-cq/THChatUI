import indexDBUtil from './indexdb'

class Cache {
    constructor() {
        this.db = indexDBUtil;
    }

    async set(storeName, key, value) {
        await this.db.set(storeName, key, value);
    }

    async get(storeName, key) {
        return await this.db.get(storeName, key);
    }

    async remove(storeName, key) {
        await this.db.delete(storeName, key);
    }
}

export default {
    local: new Cache()
};
