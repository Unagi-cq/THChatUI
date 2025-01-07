import store from '@/store'

export default {

    /**
     * 添加新的知识库Repo
     * @param {Object} repo 知识库对象
     */
    addRepo(repo) {
        let kb = store.state.app.kb;
        kb.list.push(repo);
        store.dispatch('setKb', kb);
    },

    /**
     * 删除知识库Repo
     * @param {string} repoId 要删除的知识库id
     */
    delRepo(repoId) {
        let kb = store.state.app.kb;
        kb.list = kb.list.filter(repo => repo.repoId !== repoId);
        store.dispatch('setKb', kb);
    },

    /**
     * 更新知识库Repo
     * @param {string} repoId 要更新的知识库id
     * @param {Object} newRepo 新的知识库对象
     */
    updRepo(repoId, newRepo) {
        let kb = store.state.app.kb;
        let index = kb.list.findIndex(repo => repo.id === repoId);
        if (index !== -1) {
            kb.list[index] = newRepo;
            store.dispatch('setKb', kb);
        }
    },

    /**
     * 添加文件到知识库
     * @param {string} repoId 知识库id
     * @param {Object} file 文件对象
     */
    addFile(repoId, file) {
        let kb = store.state.app.kb;
        console.log(kb)
        let repo = kb.findRepository(repoId);
        if (repo) {
            repo.addFile(file);
            store.dispatch('setKb', kb);
        }
    },

    /**
     * 删除知识库中的文件
     * @param {string} repoId 知识库id
     * @param {string} fileId 文件id
     */
    delFile(repoId, fileId) {
        let kb = store.state.app.kb;
        let repo = kb.findRepository(repoId);
        if (repo) {
            repo.removeFile(fileId);
            store.dispatch('setKb', kb);
        }
    }

}
