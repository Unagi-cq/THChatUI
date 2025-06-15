<template>
	<div class="mcp-container">
		<div class="mcp-sidebar">
			<div class="add-server">
				<el-button type="primary" @click="handleAddServer">添加服务器</el-button>
			</div>
			<div class="server-list">
				<div v-for="(server, key) in mcpServers" :key="key"
					:class="['server-item', { active: currentServer === key }]" @click="selectServer(key)">
					{{ server.name }}
				</div>
			</div>
		</div>

		<div class="mcp-content">
			<div v-if="!currentServer && !isAddingServer" class="empty-state">
				请选择或添加一个MCP服务器
			</div>
			<div v-else class="server-config">
				<div class="config-header">
					<h2>{{ isAddingServer ? '添加服务器' : '编辑服务器' }}</h2>
					<div class="header-actions">
						<el-switch v-model="currentConfig.enabled" />
						<el-button type="primary" @click="saveConfig">保存</el-button>
					</div>
				</div>

				<div class="config-form">
					<div class="form-item">
						<div class="form-label required">名称</div>
						<el-input v-model="currentConfig.name" placeholder="请输入名称" />
					</div>

					<div class="form-item">
						<div class="form-label required">类型</div>
						<div class="radio-group">
							<el-radio v-model="currentConfig.type" label="stdio" disabled>标准输入/输出(stdio)</el-radio>
							<el-radio v-model="currentConfig.type" label="sse">服务器发送事件(sse)</el-radio>
						</div>
					</div>

					<div class="form-item">
						<div class="form-label required">URL</div>
						<el-input v-model="currentConfig.url" placeholder="请输入URL" />
					</div>
				</div>

				<!-- 工具管理区域 -->
				<div v-if="!isAddingServer && currentConfig.enabled" class="tools-section">
					<div class="tools-header">
						<h3>工具管理</h3>
						<div class="tools-actions">
							<el-button 
								type="primary" 
								:loading="isLoadingTools" 
								@click="loadTools"
								:disabled="!currentConfig.url"
							>
								{{ isLoadingTools ? '查询中...' : '查询工具' }}
							</el-button>
						</div>
					</div>

					<!-- 连接状态 -->
					<div v-if="connectionStatus" class="connection-status">
						<el-alert 
							:title="connectionStatus.message" 
							:type="connectionStatus.type" 
							:closable="false"
							show-icon
						/>
					</div>

					<!-- 工具列表 -->
					<div v-if="tools.length > 0" class="tools-list">
						<div class="tools-count">
							<span>共找到 {{ tools.length }} 个工具</span>
						</div>
						<el-row :gutter="16" class="tools-grid">
							<el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-for="(tool, index) in tools" :key="index">
								<div class="tool-card">
									<div class="tool-header">
										<h4 class="tool-name">{{ tool.name }}</h4>
										<el-tag size="small" type="info">{{ tool.inputSchema?.type || 'object' }}</el-tag>
									</div>
									<div class="tool-description">
										{{ tool.description || '暂无描述' }}
									</div>
									<div v-if="tool.inputSchema?.properties" class="tool-parameters">
										<div class="parameters-title">参数:</div>
										<div class="parameters-list">
											<div v-for="(param, paramName) in tool.inputSchema.properties" :key="paramName" class="parameter-item">
												<span class="param-name">{{ paramName }}</span>
												<span class="param-type">{{ param.type }}</span>
												<span v-if="tool.inputSchema.required?.includes(paramName)" class="param-required">*</span>
												<div v-if="param.description" class="param-description">{{ param.description }}</div>
											</div>
										</div>
									</div>
									<div class="tool-actions">
										<el-button size="small" type="primary" @click="testTool(tool)">测试工具</el-button>
									</div>
								</div>
							</el-col>
						</el-row>
					</div>

					<!-- 空状态 -->
					<div v-else-if="!isLoadingTools && hasTriedLoading" class="tools-empty">
						<el-empty description="暂无可用工具" />
					</div>
				</div>

				<div v-if="!isAddingServer" class="config-actions">
					<el-button type="danger" @click="deleteServer">删除</el-button>
				</div>
			</div>
		</div>

		<!-- 工具测试对话框 -->
		<el-dialog v-model="showTestDialog" title="测试工具" width="600px">
			<div v-if="testingTool" class="test-dialog-content">
				<div class="test-tool-info">
					<h4>{{ testingTool.name }}</h4>
					<p>{{ testingTool.description }}</p>
				</div>
				<div v-if="testingTool.inputSchema?.properties" class="test-parameters">
					<div class="test-form">
						<div v-for="(param, paramName) in testingTool.inputSchema.properties" :key="paramName" class="test-form-item">
							<label class="test-label">
								{{ paramName }}
								<span v-if="testingTool.inputSchema.required?.includes(paramName)" class="required">*</span>
							</label>
							<el-input 
								v-model="testParameters[paramName]" 
								:placeholder="param.description || `请输入${paramName}`"
								:type="param.type === 'number' ? 'number' : 'text'"
							/>
							<div v-if="param.description" class="test-param-desc">{{ param.description }}</div>
						</div>
					</div>
				</div>
				<div class="test-result" v-if="testResult">
					<h5>执行结果:</h5>
					<pre class="result-content">{{ JSON.stringify(testResult, null, 2) }}</pre>
				</div>
			</div>
			<template #footer>
				<div class="">
					<el-button @click="closeTestDialog">取消</el-button>
					<el-button type="primary" :loading="isTestingTool" @click="executeTest">
						{{ isTestingTool ? '执行中...' : '执行测试' }}
					</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
	name: 'McpView',

	data() {
		return {
			mcpServers: {},
			currentServer: '',
			isAddingServer: false,
			currentConfig: {
				name: '',
				type: 'sse',
				url: '',
				enabled: true
			},
			connectionStatus: null,
			tools: [],
			isLoadingTools: false,
			hasTriedLoading: false,
			showTestDialog: false,
			testingTool: null,
			testParameters: {},
			testResult: null,
			isTestingTool: false,
			mcpClient: null
		};
	},

	mounted() {
		// 从settings中获取现有的MCP配置
		const settings = this.$store.state.setting;
		if (settings.mcpServers) {
			this.mcpServers = settings.mcpServers;
		}
	},

	beforeUnmount() {
		// 断开MCP客户端连接
		if (this.mcpClient && typeof this.mcpClient.disconnect === 'function') {
			try {
				this.mcpClient.disconnect();
			} catch (error) {
				console.error('断开MCP客户端连接失败:', error);
			}
		}
	},

	methods: {
		// 选择服务器
		selectServer(key) {
			// 断开之前的连接
			if (this.mcpClient && typeof this.mcpClient.disconnect === 'function') {
				try {
					this.mcpClient.disconnect();
				} catch (error) {
					console.error('断开之前的MCP连接失败:', error);
				}
			}

			this.currentServer = key;
			this.isAddingServer = false;

			// 加载选中服务器的配置
			Object.assign(this.currentConfig, this.mcpServers[key]);
			
			// 重置工具相关状态
			this.tools = [];
			this.connectionStatus = null;
			this.hasTriedLoading = false;
			this.mcpClient = null;
		},

		// 添加新服务器
		handleAddServer() {
			this.isAddingServer = true;
			this.currentServer = '';

			// 重置配置
			Object.assign(this.currentConfig, {
				name: '',
				type: 'sse',
				url: '',
				enabled: true
			});
			
			// 重置工具相关状态
			this.tools = [];
			this.connectionStatus = null;
			this.hasTriedLoading = false;
			this.mcpClient = null;
		},

		// 保存配置
		saveConfig() {
			if (!this.currentConfig.name) {
				ElMessage.error('请输入服务器名称');
				return;
			}

			if (!this.currentConfig.url) {
				ElMessage.error('请输入URL');
				return;
			}

			const newMcpServers = { ...this.mcpServers };

			if (this.isAddingServer) {
				// 生成唯一ID
				const serverId = `server_${Date.now()}`;
				newMcpServers[serverId] = { ...this.currentConfig };
				this.currentServer = serverId;
			} else {
				// 更新现有服务器
				newMcpServers[this.currentServer] = { ...this.currentConfig };
			}

			// 更新状态并保存到本地
			this.mcpServers = newMcpServers;
			this.$store.dispatch('changeSetting', {
				key: 'mcpServers',
				value: newMcpServers
			});

			this.isAddingServer = false;
			ElMessage.success('保存成功');
		},

		// 删除服务器
		deleteServer() {
			ElMessageBox.confirm(
				'确定要删除此服务器吗？此操作不可恢复。',
				'警告',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(() => {
					const newMcpServers = { ...this.mcpServers };
					delete newMcpServers[this.currentServer];

					// 更新状态并保存到本地
					this.mcpServers = newMcpServers;
					this.$store.dispatch('changeSetting', {
						key: 'mcpServers',
						value: newMcpServers
					});

					this.currentServer = '';
					ElMessage.success('删除成功');
				})
				.catch(() => { });
		},

		// 创建MCP客户端
		async createMCPClient() {
			try {
				// 动态导入MCP客户端
				// const { MCPClient } = await import('mcp-client');
				
				// 创建真实的MCP客户端
				// this.mcpClient = new MCPClient({
				// 	name: "THChatUI",
				// 	version: "1.0.0",
				// });
				
				return this.mcpClient;
			} catch (error) {
				console.error('创建MCP客户端失败:', error);
				throw error;
			}
		},

		// 加载工具列表
		async loadTools() {
			this.isLoadingTools = true;
			this.hasTriedLoading = true;
			this.connectionStatus = null;

			try {
				// 创建MCP客户端
				const client = await this.createMCPClient();
				
				// 连接到MCP服务器
				await client.connect({
					sseUrl: this.currentConfig.url
				});

				// 获取工具列表
				const tools = await client.getTools();
				
				this.tools = tools || [];
				this.connectionStatus = {
					message: `连接成功，找到 ${this.tools.length} 个工具`,
					type: 'success'
				};
				
				ElMessage.success(`工具加载成功，共 ${this.tools.length} 个工具`);
			} catch (error) {
				console.error('加载工具失败:', error);
				this.tools = [];
				
				let errorMessage = '连接失败';
				if (error.message) {
					errorMessage += `: ${error.message}`;
				}
				if (error.code) {
					errorMessage += ` (错误代码: ${error.code})`;
				}
				
				this.connectionStatus = {
					message: errorMessage,
					type: 'error'
				};
				ElMessage.error(errorMessage);
			} finally {
				this.isLoadingTools = false;
			}
		},

		// 测试工具
		testTool(tool) {
			this.testingTool = tool;
			this.showTestDialog = true;
			this.testParameters = {};
			this.testResult = null;
			
			// 初始化参数
			if (tool.inputSchema?.properties) {
				Object.keys(tool.inputSchema.properties).forEach(paramName => {
					this.testParameters[paramName] = '';
				});
			}
		},

		// 执行工具测试
		async executeTest() {
			if (!this.mcpClient) {
				ElMessage.error('MCP客户端未连接');
				return;
			}

			// 验证必需参数
			if (this.testingTool.inputSchema?.required) {
				for (const requiredParam of this.testingTool.inputSchema.required) {
					if (!this.testParameters[requiredParam]) {
						ElMessage.error(`请填写必需参数: ${requiredParam}`);
						return;
					}
				}
			}

			this.isTestingTool = true;

			try {
				// 处理参数类型转换
				const processedParameters = {};
				Object.keys(this.testParameters).forEach(key => {
					const value = this.testParameters[key];
					const paramSchema = this.testingTool.inputSchema?.properties?.[key];
					
					if (value !== '' && value !== null && value !== undefined) {
						// 根据参数类型进行转换
						if (paramSchema?.type === 'number') {
							processedParameters[key] = Number(value);
						} else if (paramSchema?.type === 'boolean') {
							processedParameters[key] = Boolean(value);
						} else if (paramSchema?.type === 'array') {
							console.log(`{'data': ${value}}`)
							processedParameters[key] = JSON5.parse(`{'data': ${value}}`)['data'];
						} else {
							processedParameters[key] = value;
						}
					}
				});

				console.log({
					name: this.testingTool.name,
					arguments: processedParameters
				})

				// 调用真实的MCP工具
				const result = await this.mcpClient.callTool({
					name: this.testingTool.name,
					arguments: processedParameters
				});
				
				this.testResult = result;
				ElMessage.success('工具执行成功');
			} catch (error) {
				console.error('工具执行失败:', error);
				this.testResult = {
					error: true,
					message: error.message,
					stack: error.stack
				};
				ElMessage.error(`工具执行失败: ${error.message}`);
			} finally {
				this.isTestingTool = false;
			}
		},

		// 关闭测试对话框
		closeTestDialog() {
			this.showTestDialog = false;
			this.testingTool = null;
			this.testParameters = {};
			this.testResult = null;
		}
	}
};
</script>

<style scoped>
.mcp-container {
	display: flex;
	height: 100%;
	overflow: hidden;
	color: var(--page-mcp-text-color);
	transition: all 0.3s ease;
}

.mcp-sidebar {
	margin: 20px 0;
    border: 1px solid var(--page-mcp-sidebar-border);
    display: flex;
    flex-direction: column;
    overflow: auto;
    background-color: var(--standard-page-bg-color);
    transition: all 0.3s ease;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    box-shadow: 0 2px 12px 0 var(--page-mcp-content-shadow);
}

.add-server {
	padding: 20px;
	border-bottom: 1px solid var(--page-mcp-sidebar-border);
	display: flex;
	justify-content: center;
}

.add-server button {
	width: 100%;
	font-weight: 500;
	transition: all 0.2s ease;
}

.server-list {
	flex: 1;
	overflow: auto;
	padding: 8px 0;
}

.server-item {
	padding: 10px 20px;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
	margin: 4px 8px;
	border-radius: 6px;
	font-weight: 500;
	position: relative;
	overflow: hidden;
}

.server-item:hover {
	background-color: var(--page-mcp-server-hover-bg);
	transform: translateX(2px);
}

.server-item.active {
    background-color: var(--page-mcp-server-active-bg);
    color: var(--page-mcp-server-active-color);
}

.mcp-content {
	flex: 1;
	padding: 30px;
	overflow: auto;
	background-color: var(--standard-page-bg-color);
	margin: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 var(--page-mcp-content-shadow);
	transition: all 0.3s ease;
	animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.empty-state {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--page-mcp-empty-text-color);
	font-size: 18px;
	opacity: 0.7;
}

.config-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 30px;
	padding-bottom: 15px;
	border-bottom: 1px solid var(--page-mcp-header-border);
}

.config-header h2 {
	margin: 0;
	font-size: 22px;
	font-weight: 600;
	color: var(--page-mcp-header-text);
	position: relative;
	padding-left: 16px;
}

.config-header h2::before {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	height: 60%;
	width: 4px;
	background-color: var(--page-mcp-header-accent);
	border-radius: 2px;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 16px;
}

.config-form {
	display: flex;
	flex-direction: column;
	gap: 24px;
	transition: all 0.3s ease;
	animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateX(20px);
	}

	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.form-item {
	display: flex;
	flex-direction: column;
	gap: 10px;
	transition: all 0.2s ease;
}

.form-label {
	font-weight: 500;
	font-size: 15px;
	color: var(--page-mcp-form-label);
}

.form-label.required::before {
	content: '*';
	color: #f56c6c;
	margin-right: 4px;
}

.radio-group {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	padding: 4px 0;
}

.config-actions {
	margin-top: 36px;
	padding-top: 20px;
	border-top: 1px solid var(--page-mcp-actions-border);
	display: flex;
	justify-content: flex-end;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
	.mcp-container {
		flex-direction: column;
	}

	.mcp-sidebar {
		margin: 10px;
        max-height: 200px;
        border-radius: 8px;
	}

	.mcp-content {
		margin: 10px;
		padding: 20px;
	}

	.server-item {
		margin: 2px 4px;
		padding: 12px 16px;
	}

	.config-header {
		flex-direction: column;
		align-items: flex-start;
		gap: 15px;
	}

	.header-actions {
		width: 100%;
		justify-content: space-between;
	}

	.tools-header {
		flex-direction: column;
		align-items: flex-start;
		gap: 15px;
	}

	.tools-actions {
		width: 100%;
		justify-content: flex-end;
	}

	.tools-grid {
		margin-top: 16px;
	}

	.tool-card {
		width: 100%;
	}

	.parameter-item {
		width: 100%;
		margin-bottom: 8px;
	}

	.parameters-list {
		flex-direction: column;
	}
}

.tools-section {
	margin-top: 36px;
	padding-top: 20px;
	border-top: 1px solid var(--page-mcp-actions-border);
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.tools-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
}

.tools-header h3 {
	margin: 0;
	font-size: 22px;
	font-weight: 600;
	color: var(--page-mcp-header-text);
	position: relative;
	padding-left: 16px;
}

.tools-header h3::before {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	height: 60%;
	width: 4px;
	background-color: var(--page-mcp-header-accent);
	border-radius: 2px;
}

.tools-actions {
	display: flex;
	align-items: center;
	gap: 16px;
}

.connection-status {
	margin-bottom: 16px;
}

.tools-list {
	margin-top: 16px;
}

.tools-count {
	margin-bottom: 16px;
	font-weight: 500;
}

.tools-grid {
	margin-top: 16px;
}

.tool-card {
	width: 100%;
	height: 100%;
	padding: 16px;
	border: 1px solid var(--page-mcp-tool-border);
	border-radius: 6px;
	transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
	box-sizing: border-box;
}

.tool-card:hover {
	background-color: var(--page-mcp-tool-hover-bg);
	transform: translateY(-2px);
}

.tool-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
}

.tool-name {
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: var(--page-mcp-tool-text);
}

.tool-description {
	margin: 0;
	font-size: 14px;
	color: var(--page-mcp-tool-description);
}

.tool-parameters {
	margin-top: 16px;
}

.parameters-title {
	font-weight: 500;
	font-size: 15px;
	color: var(--page-mcp-form-label);
	margin-bottom: 8px;
}

.parameters-list {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.parameter-item {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.param-name {
	font-weight: 500;
	font-size: 14px;
	color: var(--page-mcp-form-label);
}

.param-type {
	font-size: 12px;
	color: var(--page-mcp-form-label);
}

.param-required {
	color: #f56c6c;
	font-size: 12px;
}

.param-description {
	font-size: 12px;
	color: var(--page-mcp-form-label);
}

.tool-actions {
	margin-top: 16px;
	display: flex;
	justify-content: flex-end;
}

.tools-empty {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--page-mcp-empty-text-color);
	font-size: 18px;
	opacity: 0.7;
}

.test-dialog-content {
	padding: 20px;
}

.test-tool-info {
	margin-bottom: 20px;
}

.test-tool-info h4 {
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: var(--page-mcp-tool-text);
}

.test-tool-info p {
	margin: 0;
	font-size: 14px;
	color: var(--page-mcp-tool-description);
}

.test-parameters {
	margin-top: 20px;
}

.test-form {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.test-form-item {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.test-label {
	font-weight: 500;
	font-size: 15px;
	color: var(--page-mcp-form-label);
}

.test-label.required::before {
	content: '*';
	color: #f56c6c;
	margin-right: 4px;
}

.test-result {
	margin-top: 20px;
}

.test-result h5 {
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: var(--page-mcp-header-text);
	margin-bottom: 16px;
}

.result-content {
	background-color: var(--page-mcp-result-bg);
	padding: 16px;
	border-radius: 6px;
}

.test-param-desc {
	font-size: 12px;
	color: var(--page-mcp-form-label);
}

.dialog-footer {
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
}
</style>