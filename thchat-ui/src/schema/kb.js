/**
 * 知识块类
 */
class Chunk {
    constructor(chunkId, content, words = []) {
        this.chunkId = chunkId;
        this.content = content;
        this.contentLength = content.length;
        this.words = words;
    }
}

/**
 * 文件类
 */
class File {
    constructor(fileId, name, createTime, fileType, url, size = 0, list = []) {
        this.fileId = fileId;
        this.name = name;
        this.createTime = createTime;
        this.fileType = fileType;
        this.url = url;
        this.size = size;
        this.showChunks = false;
        this.list = list.map(chunk => chunk instanceof Chunk ? chunk : new Chunk(
            chunk.chunkId,
            chunk.content,
            chunk.words
        ));
    }

    /**
     * 添加知识块
     */
    addChunk(chunk) {
        this.list.push(chunk instanceof Chunk ? chunk : new Chunk(
            chunk.chunkId,
            chunk.content,
            chunk.words
        ));
    }

    /**
     * 查找知识块
     */
    findChunk(chunkId) {
        return this.list.find(chunk => chunk.chunkId === chunkId);
    }
}

/**
 * 知识库类
 */
class Repository {
    constructor(repoId, name, createTime, description, list = []) {
        this.repoId = repoId;
        this.name = name;
        this.createTime = createTime;
        this.description = description;
        this.list = list.map(file => file instanceof File ? file : new File(
            file.fileId,
            file.name,
            file.createTime,
            file.fileType,
            file.url,
            file.size,
            file.list
        ));
    }

    /**
     * 添加文件
     */
    addFile(file) {
        this.list.push(file instanceof File ? file : new File(
            file.fileId,
            file.name,
            file.createTime,
            file.fileType,
            file.url,
            file.size,
            file.list
        ));
    }

    /**
     * 查找文件
     */
    findFile(fileId) {
        return this.list.find(file => file.fileId === fileId);
    }

    /**
     * 删除文件
     */
    removeFile(fileId) {
        this.list = this.list.filter(file => file.fileId !== fileId);
    }
}

/**
 * 知识库管理类
 */
class Kb {
    constructor(data = {}) {
        this.statistics = {
            totalRepositories: 0,
            totalFiles: 0,
            totalChunks: 0
        };

        let list = [];
        if (data.list && Array.isArray(data.list)) {
            list = data.list;
        }

        this.list = list.map(repo => {
            this.statistics.totalRepositories++;
            this.statistics.totalFiles += repo.list?.length || 0;
            repo.list?.forEach(file => {
                this.statistics.totalChunks += file.list?.length || 0;
            });

            return repo instanceof Repository ? repo : new Repository(
                repo.repoId,
                repo.name,
                repo.createTime,
                repo.description,
                repo.list
            );
        });
    }

    /**
     * 添加知识库
     */
    addRepository(repository) {
        this.list.push(repository);
    }

    /**
     * 查找知识库
     */
    findRepository(repoId) {
        return this.list.find(repo => repo.repoId === repoId);
    }

    /**
     * 删除知识库
     */
    removeRepository(repoId) {
        this.list = this.list.filter(repo => repo.repoId !== repoId);
    }

    /**
     * 更新统计信息
     */
    updateStatistics() {
        this.statistics = {
            totalRepositories: this.list.length,
            totalFiles: this.list.reduce((sum, repo) => sum + repo.list.length, 0),
            totalChunks: this.list.reduce((sum, repo) =>
                sum + repo.list.reduce((fileSum, file) =>
                    fileSum + file.list.length, 0), 0)
        };
    }
}

export { Kb, Repository, File, Chunk }; 