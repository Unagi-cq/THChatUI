/**
 * 单个标签页类
 */
class TabAtom {
	constructor(title, uuid) {
		this.title = title;
		this.uuid = uuid;
	}
}

/**
 * 标签页列表管理类
 */
class Tab {
	/**
	 * 创建标签页管理实例
	 * @param {Object} data - 初始化数据 {list: [{title: string, uuid: string}]}
	 */
	constructor(data = {}) {
		let list = [];
		
		if (data.list && Array.isArray(data.list)) {
			list = data.list;
		}

		// 转换TabAtom实例
		this.list = list.map(tab => {
			return tab instanceof TabAtom ? tab : new TabAtom(tab.title, tab.uuid);
		});
	}

	/**
	 * 添加新标签页
	 * @param {string} title - 标签页标题
	 * @param {string} uuid - 标签页唯一标识符
	 */
	addTab(title, uuid) {
		this.list.unshift(new TabAtom(title, uuid));
	}

	/**
	 * 移除指定标签页
	 * @param {string} uuid - 要移除的标签页的唯一标识符
	 */
	removeTab(uuid) {
		this.list = this.list.filter(tab => tab.uuid !== uuid);
	}

	/**
	 * 获取指定标签页的前一个标签页的UUID 删除标签页之前调用
	 * @param {string} uuid - 当前标签页的唯一标识符
	 * @returns {string} 前一个标签页的UUID，如果不存在则返回空字符串
	 */
	getPrevUuid(uuid) {
		const index = this.list.findIndex(tab => tab.uuid === uuid);
		if (index === -1 || this.list.length === 1) {
			return '';
		}
		if (index === 0) {
			return this.list[1].uuid;
		}
		return this.list[index - 1].uuid;
	}

	/**
	 * 查找指定UUID的标签页
	 * @param {string} uuid - 标签页的唯一标识符
	 * @returns {TabAtom|undefined} 找到的标签页实例或undefined
	 */
	findTab(uuid) {
		return this.list.find(tab => tab.uuid === uuid);
	}

	/**
	 * 获取所有标签页
	 * @returns {TabAtom[]} 标签页实例数组
	 */
	getAllTabs() {
		return this.list;
	}

	/**
	 * 获取标签页总数
	 * @returns {number} 标签页数量
	 */
	getCount() {
		return this.list.length;
	}
}

export { TabAtom, Tab }; 