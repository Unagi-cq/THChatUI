<template>
	<el-dialog v-model="dialogVisible" :show-close="false" :before-close="handleClose" :destroy-on-close="true"
		append-to-body>
		<!-- 对话框头部 -->
		<template #header="{ close }">
			<div class="dialog-custom-header">
				<h4>{{ title }}</h4>
				<SvgIcon @click="handleClose" icon-class="close" style="width: 20px; height: 20px;" />
			</div>
		</template>
		<!-- 对话框内容 -->
		<div class="dialog-container">
			<slot></slot>
		</div>
	</el-dialog>
</template>

<script>
export default {
	name: 'CustomDialog',
	props: {
		// 是否显示对话框
		modelValue: Boolean,
		// 对话框标题
		title: String
	},
	computed: {
		// 对话框是否显示
		dialogVisible: {
			get() {
				return this.modelValue
			},
			set(value) {
				this.$emit('update:modelValue', value)
			}
		}
	},
	methods: {
		// 关闭对话框
		handleClose() {
			this.dialogVisible = false
		}
	}
}
</script>

<style lang="scss" scoped>
/* 对话框头部样式 */
.dialog-custom-header {
	display: flex;
	justify-content: space-between;
	align-items: center;

	/* 标题文本样式 */
	h4 {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		color: var(--common-color);
	}

	/* 关闭图标样式 */
	svg {
		cursor: pointer;
		color: var(--common-color);
		opacity: 1;
		transition: opacity 0.2s;

		&:hover {
			opacity: 0.6;
		}
	}
}

/* Element-Plus 对话框全局样式覆盖 */
:global(.el-dialog) {
	border-radius: 15px;
	background: var(--layout-common-layout-bg);
	overflow: hidden;
	position: relative;
	max-width: 600px;
	min-width: 300px;
	margin: 15vh auto !important;
	max-height: 70vh;
	display: flex;
	flex-direction: column;
}

/* 自定义大尺寸弹窗页面的大小 */
:global(.el-dialog.big-page) {
	max-width: 1200px;
}

/* 对话框毛玻璃效果 */
:global(.el-dialog::after) {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	width: 110%;
	height: 110%;
	z-index: 1;
	backdrop-filter: blur(30px);
	-webkit-backdrop-filter: blur(30px);
	pointer-events: none;
}

/* 确保对话框内容在毛玻璃效果之上 */
:global(.el-dialog__header),
:global(.el-dialog__body) {
	position: relative;
	z-index: 2;
}

/* 对话框内容区域滚动设置 */
:global(.el-dialog__body) {
	flex: 1;
	overflow-y: auto;
	scrollbar-width: none;
}

/* 移动端响应式布局 */
@media screen and (max-width: 768px) {
	:global(.el-dialog) {
		width: 95% !important;
	}
}

/* 介于768px和1200px之间的响应式布局 */
@media screen and (min-width: 768px) and (max-width: 1200px) {
	:global(.el-dialog) {
		width: 70% !important;
	}
}

/* 大屏幕响应式布局 */
@media screen and (min-width: 1200px) {
	:global(.el-dialog) {
		width: 60% !important;
	}
}
</style>