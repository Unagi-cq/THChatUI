/**
 * 单次问答类
 */
class QA {
    constructor(qaId, query, answer, responseTime, finishTime, series, modelName, modelType) {
        this.qaId = qaId;
        this.query = query;
        this.answer = answer;
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
    constructor(sessionId, data = []) {
        this.sessionId = sessionId;
        this.data = data.map(qa => {
            return qa instanceof QA ? qa : new QA(
                qa.qaId,
                qa.query,
                qa.answer,
                qa.responseTime,
                qa.finishTime,
                qa.series,
                qa.modelName,
                qa.modelType
            );
        });
    }

    addQA(qa) {
        this.data.push(qa instanceof QA ? qa : new QA(
            qa.qaId,
            qa.query, 
            qa.answer,
            qa.responseTime,
            qa.finishTime,
            qa.series,
            qa.modelName,
            qa.modelType
        ));
    }

    findQA(qaId) {
        return this.data.find(qa => qa.qaId === qaId);
    }

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
    constructor(data = {}) {
        let list = [];
		
		if (data.list && Array.isArray(data.list)) {
			list = data.list;
		}

        this.list = list.map(session => {
            return session instanceof Session ? session : new Session(session.sessionId, session.data);
        });
    }

    addSession(session) {
        this.list.unshift(session);
    }

    removeSession(sessionId) {
        this.list = this.list.filter(session => session.sessionId !== sessionId);
    }

    findSession(sessionId) {
        return this.list.find(session => session.sessionId === sessionId);
    }

    toJSON() {
        return {list: this.list.map(session => session.toJSON())};
    }

    static fromJSON(json) {
        return new Chat(json);
    }
}

export { Chat, Session, QA }; 