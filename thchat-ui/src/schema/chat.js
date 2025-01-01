/**
 * 单次问答类
 */
class QA {
    constructor(qaId, query, answer, files, responseTime, finishTime, series, modelName, modelType) {
        this.qaId = qaId;
        this.query = query;
        this.answer = answer;
        this.files = files;
        this.responseTime = responseTime;
        this.finishTime = finishTime;
        this.series = series;
        this.modelName = modelName;
        this.modelType = modelType;
    }

    setResponse(time) {
        this.responseTime = time;
    }

    setAnswer(answer) {
        this.answer = answer;
    }

    setFinish(time) {
        this.finishTime = time;
    }

    toJSON() {
        return {
            qaId: this.qaId,
            query: this.query,
            responseTime: this.responseTime,
            answer: this.answer, 
            files: this.files,
            finishTime: this.finishTime,
            modelName: this.modelName,
            series: this.series,
            modelType: this.modelType
        };
    }
}

/**
 * 会话类
 */
class Session {
    /**
     * 创建新的会话实例
     * @param {string} sessionId - 会话的唯一标识符
     * @param {Array} [data=[]] - 会话中的问答数据数组
     */
    constructor(sessionId, data = []) {
        this.sessionId = sessionId;
        this.data = data.map(qa => {
            return qa instanceof QA ? qa : new QA(
                qa.qaId,
                qa.query,
                qa.answer,
                qa.files,
                qa.responseTime,
                qa.finishTime,
                qa.series,
                qa.modelName,
                qa.modelType
            );
        });
    }

    /**
     * 向会话添加新的问答
     * @param {QA|Object} qa - 要添加的问答对象
     */
    addQA(qa) {
        this.data.push(qa instanceof QA ? qa : new QA(
            qa.qaId,
            qa.query, 
            qa.answer,
            qa.files,
            qa.responseTime,
            qa.finishTime,
            qa.series,
            qa.modelName,
            qa.modelType
        ));
    }

    /**
     * 根据qaId查找特定的问答
     * @param {string} qaId - 问答的唯一标识符
     * @returns {QA|undefined} 找到的问答对象，如果未找到则返回undefined
     */
    findQA(qaId) {
        return this.data.find(qa => qa.qaId === qaId);
    }

    /**
     * 从会话中移除指定的问答
     * @param {string} qaId - 要移除的问答的唯一标识符
     */
    removeQA(qaId) {
        this.data = this.data.filter(qa => qa.qaId !== qaId);
    }

    toJSON() {
        return {
            sessionId: this.sessionId,
            data: this.data.map(qa => qa.toJSON())
        };
    }
}

/**
 * 聊天管理类
 */
class Chat {
    /**
     * 创建聊天管理实例
     * @param {Object} [data={}] - 初始化数据
     * @param {Array} [data.list=[]] - 会话列表
     */
    constructor(data = {}) {
        let list = [];
		
		if (data.list && Array.isArray(data.list)) {
			list = data.list;
		}

        this.list = list.map(session => {
            return session instanceof Session ? session : new Session(session.sessionId, session.data);
        });
    }

    /**
     * 添加新会话到列表开头
     * @param {Session} session - 要添加的会话对象
     */
    addSession(session) {
        this.list.unshift(session);
    }

    /**
     * 移除指定的会话
     * @param {string} sessionId - 要移除的会话的唯一标识符
     */
    removeSession(sessionId) {
        this.list = this.list.filter(session => session.sessionId !== sessionId);
    }

    /**
     * 查找指定的会话
     * @param {string} sessionId - 要查找的会话的唯一标识符
     * @returns {Session|undefined} 找到的会话对象，如果未找到则返回undefined
     */
    findSession(sessionId) {
        return this.list.find(session => session.sessionId === sessionId);
    }

    /**
     * 将聊天数据转换为JSON格式
     * @returns {Object} JSON格式的聊天数据
     */
    toJSON() {
        return {list: this.list.map(session => session.toJSON())};
    }

    /**
     * 从JSON数据创建Chat实例
     * @param {Object} json - JSON格式的聊天数据
     * @returns {Chat} 新的Chat实例
     */
    static fromJSON(json) {
        return new Chat(json);
    }
}

export { Chat, Session, QA }; 