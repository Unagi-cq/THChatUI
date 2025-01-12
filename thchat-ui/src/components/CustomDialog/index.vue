<template>
	<el-dialog v-model="dialogVisible" :show-close="false" :before-close="handleClose" :destroy-on-close="true"
		append-to-body>
		<!-- 对话框头部 -->
		<template #header="{ close }">
			<div class="dialog-custom-header">
				<h4>{{ title }}</h4>
				<svg class="el-icon--left" @click="handleClose" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
					width="20" height="20" fill="none">
					<path
						d="M10.2471 6.7402C11.0734 7.56657 11.4866 7.97975 12.0001 7.97975C12.5136 7.97975 12.9268 7.56658 13.7531 6.74022L13.7532 6.7402L15.5067 4.98669L15.5067 4.98668C15.9143 4.5791 16.1182 4.37524 16.3302 4.25283C17.3966 3.63716 18.2748 4.24821 19.0133 4.98669C19.7518 5.72518 20.3628 6.60345 19.7472 7.66981C19.6248 7.88183 19.421 8.08563 19.0134 8.49321L17.26 10.2466C16.4336 11.073 16.0202 11.4864 16.0202 11.9999C16.0202 12.5134 16.4334 12.9266 17.2598 13.7529L19.0133 15.5065C19.4209 15.9141 19.6248 16.1179 19.7472 16.3299C20.3628 17.3963 19.7518 18.2746 19.0133 19.013C18.2749 19.7516 17.3965 20.3626 16.3302 19.7469C16.1182 19.6246 15.9143 19.4208 15.5067 19.013L13.7534 17.2598L13.7533 17.2597C12.9272 16.4336 12.5136 16.02 12.0001 16.02C11.4867 16.02 11.073 16.4336 10.2469 17.2598L10.2469 17.2598L8.49353 19.013C8.0859 19.4208 7.88208 19.6246 7.67005 19.7469C6.60377 20.3626 5.72534 19.7516 4.98693 19.013C4.2484 18.2746 3.63744 17.3963 4.25307 16.3299C4.37549 16.1179 4.5793 15.9141 4.98693 15.5065L6.74044 13.7529C7.56681 12.9266 7.98 12.5134 7.98 11.9999C7.98 11.4864 7.5666 11.073 6.74022 10.2466L4.98685 8.49321C4.57928 8.08563 4.37548 7.88183 4.25307 7.66981C3.63741 6.60345 4.24845 5.72518 4.98693 4.98669C5.72542 4.24821 6.60369 3.63716 7.67005 4.25283C7.88207 4.37524 8.08593 4.5791 8.49352 4.98668L8.49353 4.98669L10.2471 6.7402Z"
						stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
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

/* 大屏幕响应式布局 */
@media screen and (min-width: 1200px) {
	:global(.el-dialog) {
		width: 60% !important;
	}
}
</style>