import fs from 'node:fs'
import yaml from 'yaml'


// 导出落雪API类
export default class LXAPI {
    constructor() {
        // 从配置文件中读取API基础配置
        const config = yaml.parse(fs.readFileSync('./plugins/maimai-plugin/configs/API_Token.yaml', 'utf8'))
        // 从配置文件中读取临时文件路径
        const mainConfig = yaml.parse(fs.readFileSync('./plugins/maimai-plugin/configs/config.yaml', 'utf8'))
        this.tempPath = mainConfig.tempPath || './plugins/maimai-plugin/temp'
        this.baseURL = config.LXapi.baseURL || 'https://maimai.lxns.net'
        this.token = config.LXapi.token || 'O-0yIEngnVsHgid6m5M2wlvQvmoDDLKIwEIfHtt0HEM='
        this.assetsURL = config.LXapi.assetsURL || 'https://assets2.lxns.net'
    }

    //开发者功能列表 需要开发者Token
    //1.创建或修改玩家信息
    // POST /api/v0/maimai/player

    //2.获取玩家信息
    // GET /api/v0/maimai/player/{friend_code}
    async getPlayerInfo(friendCode) {
        try {
            const url = `${this.baseURL}/api/v0/maimai/player/${friendCode}`
            const response = await fetch(url, {
                headers: {
                    'Authorization': `${this.token}`
                }
            })
            if (!response.ok) {
                
                throw new Error(`API请求失败: ${response.status}`)
            }
            const rawData = await response.json()
            const data = {
                success: true,
                code: 200,
                data: {
                    // 基础信息
                    name: rawData.data.name || '', // 玩家名
                    rating: rawData.data.rating || 0, // 玩家rating
                    friend_code: rawData.data.friend_code || 0, // 好友码
                    
                    // 称号信息
                    trophy: {
                        id: rawData.data.trophy?.id || 0, // 称号ID
                        name: rawData.data.trophy?.name || '', // 称号名称
                        color: rawData.data.trophy?.color || 'Normal' // 称号颜色
                    },
                    
                    // 段位信息
                    course_rank: rawData.data.course_rank || 0, // 段位等级
                    class_rank: rawData.data.class_rank || 0, // 阶级等级
                    star: rawData.data.star || 0, // 累计星数
                    
                    // 装扮信息
                    icon: {
                        id: rawData.data.icon?.id || 0, // 头像ID
                        name: rawData.data.icon?.name || '', // 头像名称
                        genre: rawData.data.icon?.genre || '' // 头像分类
                    },
                    name_plate: {
                        id: rawData.data.name_plate?.id || 0, // 姓名框ID
                        name: rawData.data.name_plate?.name || '', // 姓名框名称
                        genre: rawData.data.name_plate?.genre || '' // 姓名框分类
                    },
                    frame: {
                        id: rawData.data.frame?.id || 0, // 背景框ID
                        name: rawData.data.frame?.name || '', // 背景框名称
                        genre: rawData.data.frame?.genre || '' // 背景框分类
                    },
                    
                    // 更新时间
                    upload_time: rawData.data.upload_time || '' // 数据更新时间
                }
            }
            return data
        } catch (error) {
            logger.error(`获取玩家信息失败: ${error}`)
            throw error
        }
    }

    //3.通过qq获取玩家信息
    // GET /api/v0/maimai/player/qq/{qq}
    async getPlayerInfoByQQ(qq) {
        try {
            const url = `${this.baseURL}/api/v0/maimai/player/qq/${qq}`
            const response = await fetch(url, {
                headers: {
                    'Authorization': `${this.token}`
                }
            })
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`)
            }
            const rawData = await response.json()
            const data = {
                success: true,
                code: 200,
                data: {
                    // 基础信息
                    name: rawData.data.name || '', // 玩家名
                    rating: rawData.data.rating || 0, // 玩家rating
                    friend_code: rawData.data.friend_code || 0, // 好友码
                    
                    // 称号信息
                    trophy: {
                        id: rawData.data.trophy?.id || 0, // 称号ID
                        name: rawData.data.trophy?.name || '', // 称号名称
                        color: rawData.data.trophy?.color || 'Normal' // 称号颜色
                    },
                    
                    // 段位信息
                    course_rank: rawData.data.course_rank || 0, // 段位等级
                    class_rank: rawData.data.class_rank || 0, // 阶级等级
                    star: rawData.data.star || 0, // 累计星数
                    
                    // 装扮信息
                    icon: {
                        id: rawData.data.icon?.id || 0, // 头像ID
                        name: rawData.data.icon?.name || '', // 头像名称
                        genre: rawData.data.icon?.genre || '' // 头像分类
                    },
                    name_plate: {
                        id: rawData.data.name_plate?.id || 0, // 姓名框ID
                        name: rawData.data.name_plate?.name || '', // 姓名框名称
                        genre: rawData.data.name_plate?.genre || '' // 姓名框分类
                    },
                    frame: {
                        id: rawData.data.frame?.id || 0, // 背景框ID
                        name: rawData.data.frame?.name || '', // 背景框名称
                        genre: rawData.data.frame?.genre || '' // 背景框分类
                    },
                    
                    // 更新时间
                    upload_time: rawData.data.upload_time || '' // 数据更新时间
                }
            }
            //logger.info('[maimai-plugin] API响应数据:', JSON.stringify(data))
            return data
        } catch (error) {
            logger.error(`通过QQ获取玩家信息失败: ${error}`)
            throw error
        }
    }

    //4.获取玩家缓存谱面的最佳成绩。
    // GET /api/v0/maimai/player/{friend_code}/best
    async getPlayerBest(friendCode, params) {
        try {
            // 检查必要参数
            if (!params.song_id && !params.song_name) {
                throw new Error('必须提供 song_id 或 song_name 参数')
            }
            if (params.song_id && params.song_name) {
                throw new Error('song_id 和 song_name 参数不能同时提供')
            }
            if (params.level_index === undefined || ![0, 1, 2, 3, 4].includes(params.level_index)) {
                throw new Error(`必须提供有效的 level_index 参数 (0-4), 当前值: ${params.level_index}`)
            }
            // 检查谱面类型参数
            if (!params.song_type) {
                throw new Error('必须提供 song_type 参数 (standard/dx/utage)')
            }
            // 验证谱面类型的有效值
            const validSongTypes = ['standard', 'dx', 'utage']
            if (!validSongTypes.includes(params.song_type)) {
                throw new Error('song_type 参数无效,必须为 standard/dx/utage 之一')
            }

            const response = await fetch(`${this.baseURL}/api/v0/maimai/player/${friendCode}/best?song_id=${params.song_id}&song_type=${params.song_type}&level_index=${params.level_index}`, {
                headers: {
                    'Authorization': this.token
                }
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`)
            }

            const rawData = await response.json()
            
            // 如果data为null,返回空数据结构
            if (!rawData.data) {
                return {
                    code: 200,
                    data: {
                        achievements: 0,
                        fc: '',
                        fs: '',
                        dx_score: 0,
                        play_time: '',
                        type: '',
                        level: '',
                        level_index: 0,
                        level_label: '',
                        song_id: 0,
                        title: '',
                        upload_time: ''
                    }
                }
            }

            const data = {
                code: 200,
                data: {
                    achievements: rawData.data.achievements || 0, // 达成率
                    fc: rawData.data.fc || '', // Full Combo 类型
                    fs: rawData.data.fs || '', // Full Sync 类型
                    dx_score: rawData.data.dx_score || 0, // DX分数
                    rate: rawData.data.rate || '', // 评级
                    play_time: rawData.data.play_time || '', // 游玩时间
                    type: rawData.data.type || '', // 游玩类型
                    level: rawData.data.level || '', // 难度等级
                    level_index: rawData.data.level_index || 0, // 难度序号
                    level_label: rawData.data.level_label || '', // 难度标签
                    song_id: rawData.data.song_id || 0, // 歌曲ID
                    title: rawData.data.title || '', // 歌曲标题
                    upload_time: rawData.data.upload_time || '' // 上传时间
                }
            }
            return data
        } catch (error) {
            logger.error(`获取玩家最佳成绩失败: ${error}`)
            throw error
        }
    }

    //5.获取玩家缓存的 Best 50。
    // GET /api/v0/maimai/player/{friend_code}/bests
    async getPlayerBest50(friendCode) {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/player/${friendCode}/bests`, {
                headers: {
                    'Authorization': `${this.token}`
                }
            });
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`)
            }
            const rawData = await response.json()

            const data = {
                code: 200,
                data: {
                    standard_total: rawData.data.standard_total || 0,
                    dx_total: rawData.data.dx_total || 0,
                    standard: (rawData.data.standard || []).map(score => ({
                        id: score.id || 0,
                        song_name: score.song_name || '',
                        level: score.level || '',
                        level_index: score.level_index || 0,
                        achievements: score.achievements || 0,
                        fc: score.fc || '',
                        fs: score.fs || '',
                        dx_score: score.dx_score || 0,
                        dx_rating: score.dx_rating || 0,
                        rate: score.rate || '',
                        type: score.type || '',
                        play_time: score.play_time || '',
                        upload_time: score.upload_time || ''
                    })),
                    dx: (rawData.data.dx || []).map(score => ({
                        id: score.id || 0,
                        song_name: score.song_name || '',
                        level: score.level || '',
                        level_index: score.level_index || 0,
                        achievements: score.achievements || 0,
                        fc: score.fc || '',
                        fs: score.fs || '',
                        dx_score: score.dx_score || 0,
                        dx_rating: score.dx_rating || 0,
                        rate: score.rate || '',
                        type: score.type || '',
                        play_time: score.play_time || '',
                        upload_time: score.upload_time || ''
                    }))
                }
            }
            return data
        } catch (error) {
            logger.error(`获取玩家Best 50失败: ${error}`)
            throw error
        }
    }

    // //6.获取玩家缓存的 All Perfect 50。
    // // GET /api/v0/maimai/player/{friend_code}/bests/ap
    async getPlayerAP50(friendCode) {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/player/${friendCode}/bests/ap`, {
                headers: {
                    'Authorization': `${this.token}`
                }
            });
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`)
            }
            const rawData = await response.json()

            const data = {
                code: 200,
                data: rawData.data.map(score => ({
                    achievements: score.achievements || 0,
                    fc: score.fc || '',
                    fs: score.fs || '',
                    dx_score: score.dx_score || 0,
                    play_time: score.play_time || '',
                    type: score.type || '',
                    level: score.level || '',
                    level_index: score.level_index || 0,
                    level_label: score.level_label || '',
                    song_id: score.song_id || 0,
                    title: score.title || '',
                    upload_time: score.upload_time || ''
                }))
            }
            return data
        } catch (error) {
            logger.error(`获取玩家AP 50失败: ${error}`)
            throw error
        }
    }

    //7.获取玩家缓存单曲所有谱面的成绩
    // GET /api/v0/maimai/player/{friend_code}/bests

    //8.上传玩家成绩。
    // POST /api/v0/maimai/player/{friend_code}/scores  

    //9.获取玩家缓存的 Recent 50（仅增量爬取可用），按照 play_time 排序。
    // GET /api/v0/maimai/player/{friend_code}/recents

    //10.获取玩家缓存的所有最佳成绩（简化后）
    // GET /api/v0/maimai/player/{friend_code}/scores

    //11.获取玩家 DX Rating 趋势。
    // GET /api/v0/maimai/player/{friend_code}/trend

    //12.获取玩家成绩上传历史记录。
    // GET /api/v0/maimai/player/{friend_code}/score/history

    //13.获取玩家姓名框进度。
    // GET /api/v0/maimai/player/{friend_code}/plate/{plate_id}

    //14.通过 NET 的 HTML 源代码上传玩家数据。
    // POST /api/v0/maimai/player/{friend_code}/html

    //个人API需要个人Token
    //1.获取玩家信息。
    // GET /api/v0/user/maimai/player

    //2.获取玩家所有成绩。
    //GET /api/v0/user/maimai/player/scores

    //3.上传玩家成绩。
    //POST /api/v0/user/maimai/player/scores

    //4.获取玩家成绩上传历史记录。
    //GET /api/v0/user/maimai/player/score/history

//公共API无需任何Token  
    //1.获取曲目列表
    //GET /api/v0/maimai/song/list
    async getSongList() {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/song/list`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            logger.error(`获取曲目列表失败: ${error}`)
            throw error
        }
    }

    //2.获取曲目信息。
    //GET /api/v0/maimai/song/{song_id}
    async getSongInfo(songId) {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/song/${songId}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const rawData = await response.json()
            const data = {
                id: rawData.id,
                title: rawData.title,
                artist: rawData.artist,
                genre: rawData.genre,
                bpm: rawData.bpm,
                version: rawData.version,
                difficulties: {
                    standard: rawData.difficulties.standard || [],
                    dx: rawData.difficulties.dx.map(diff => ({
                        type: diff.type,
                        difficulty: diff.difficulty,
                        level: diff.level,
                        level_value: diff.level_value,
                        note_designer: diff.note_designer,
                        version: diff.version,
                        notes: {
                            total: diff.notes.total,
                            tap: diff.notes.tap,
                            hold: diff.notes.hold,
                            slide: diff.notes.slide,
                            touch: diff.notes.touch,
                            break: diff.notes.break
                        }
                    }))
                }
            }
            // 调试输出
            logger.debug(`[maimai-plugin] API返回数据: ${JSON.stringify(data)}`)
            return data
        } catch (error) {
            logger.error(`获取曲目信息失败: ${error}`)
            throw error
        }
    }

    //3.获取曲目别名列表。
    //GET /api/v0/maimai/alias/list
    async getAliasList() {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/alias/list`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            // 调试输出
            logger.debug(`[maimai-plugin] API返回数据: ${JSON.stringify(data)}`)
            return data
        } catch (error) {
            logger.error(`获取曲目别名列表失败: ${error}`)
            throw error
        }
    }

    //4.获取头像列表。
    //GET /api/v0/maimai/icon/list
    async getIconList() {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/icon/list`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            // 调试输出
            logger.debug(`[maimai-plugin] API返回数据: ${JSON.stringify(data)}`)
            return data
        } catch (error) {
            logger.error(`获取头像列表失败: ${error}`)
            throw error
        }
    }

    //5.获取头像信息。
    //GET /api/v0/maimai/icon/{icon_id}
    async getIconInfo(iconId) {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/icon/${iconId}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            // 调试输出
            logger.debug(`[maimai-plugin] API返回数据: ${JSON.stringify(data)}`)
            return data
        } catch (error) {
            logger.error(`获取头像信息失败: ${error}`)
            throw error
        }
    }

    //6.获取姓名框列表。
    //GET /api/v0/maimai/plate/list
    async getPlateList() {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/plate/list`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            // 调试输出
            logger.debug(`[maimai-plugin] API返回数据: ${JSON.stringify(data)}`)
            return data
        } catch (error) {
            logger.error(`获取姓名框列表失败: ${error}`)
            throw error
        }
    }

    //7.获取姓名框信息。
    //GET /api/v0/maimai/plate/{plate_id}
    async getPlateInfo(plateId) {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/plate/${plateId}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            // 调试输出
            logger.debug(`[maimai-plugin] API返回数据: ${JSON.stringify(data)}`)
            return data
        } catch (error) {
            logger.error(`获取姓名框信息失败: ${error}`)
            throw error
        }
    }

    //8.获取背景框列表。
    //GET /api/v0/maimai/frame/list
    async getFrameList() {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/frame/list`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            // 调试输出
            logger.debug(`[maimai-plugin] API返回数据: ${JSON.stringify(data)}`)
            return data
        } catch (error) {
            logger.error(`获取背景框列表失败: ${error}`)
            throw error
        }
    }

    //9.获取背景框信息。
    //GET /api/v0/maimai/frame/{frame_id}
    async getFrameInfo(frameId) {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/frame/${frameId}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            // 调试输出
            logger.debug(`[maimai-plugin] API返回数据: ${JSON.stringify(data)}`)
            return data
        } catch (error) {
            logger.error(`获取背景框信息失败: ${error}`)
            throw error
        }
    }

    //10.获取收藏品分类列表
    //GET /api/v0/maimai/collection-genre/list
    async getCollectionGenreList() {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/collection-genre/list`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            // 调试输出
            logger.debug(`[maimai-plugin] API返回数据: ${JSON.stringify(data)}`)
            return data
        } catch (error) {
            logger.error(`获取收藏品分类列表失败: ${error}`)
            throw error
        }
    }

    //11.获取收藏品分类信息。
    //GET /api/v0/maimai/collection-genre/{collection_genre_id}
    async getCollectionGenreInfo(collectionGenreId) {
        try {
            const response = await fetch(`${this.baseURL}/api/v0/maimai/collection-genre/${collectionGenreId}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            // 调试输出
            logger.debug(`[maimai-plugin] API返回数据: ${JSON.stringify(data)}`)
            return data
        } catch (error) {
            logger.error(`获取收藏品分类信息失败: ${error}`)
            throw error
        }
    }

//游戏资源类基础 URL：https://assets2.lxns.net/maimai
// 路径：

// 头像：/icon/{icon_id}.png
// 姓名框：/plate/{plate_id}.png
// 曲绘：/jacket/{song_id}.png
// 音频：/music/{song_id}.mp3

    // 添加一个通用的资源获取函数
    async fetchAssetWithRetry(url, retries = 3, timeout = 15000) {
        for (let i = 0; i < retries; i++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                
                const response = await fetch(url, {
                    signal: controller.signal,
                    timeout: timeout
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.arrayBuffer();
            } catch (error) {
                logger.warn(`[maimai-plugin] 第${i + 1}次获取资源失败: ${url}`);
                logger.warn(error);
                
                if (i === retries - 1) {
                    throw new Error(`获取资源失败: ${url}, 已重试${retries}次`);
                }
                
                // 等待一段时间后重试
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }

    // 获取头像资源 icon
    async getIconAsset(iconId) {
        const path = `${this.tempPath}/LX_assets/icons/${iconId}.png`
        if (!fs.existsSync(path)) {
            const url = `${this.assetsURL}/maimai/icon/${iconId}.png`
            const response = await fetch(url)
            const buffer = await response.arrayBuffer()
            await fs.promises.mkdir(`${this.tempPath}/LX_assets/icons`, { recursive: true })
            await fs.promises.writeFile(path, Buffer.from(buffer))
        }
        return path
    }

    // 获取姓名框资源 name_plate 
    async getPlateAsset(plateId) {
        const path = `${this.tempPath}/LX_assets/plates/${plateId}.png` 
        if (!fs.existsSync(path)) {
            const url = `${this.assetsURL}/maimai/plate/${plateId}.png`
            const response = await fetch(url)
            const buffer = await response.arrayBuffer()
            await fs.promises.mkdir(`${this.tempPath}/LX_assets/plates`, { recursive: true })
            await fs.promises.writeFile(path, Buffer.from(buffer))
        }
        return path
    }

    // 获取曲绘资源
    async getJacketAsset(songId) {
        const path = `${this.tempPath}/LX_assets/jackets/${songId}.png`
        if (!fs.existsSync(path)) {
            try {
                const url = `${this.assetsURL}/maimai/jacket/${songId}.png`
                const buffer = await this.fetchAssetWithRetry(url);
                await fs.promises.mkdir(`${this.tempPath}/LX_assets/jackets`, { recursive: true })
                await fs.promises.writeFile(path, Buffer.from(buffer))
            } catch (error) {
                logger.error(`[maimai-plugin] 获取曲绘资源失败: ${songId}`);
                // 使用默认图片
                const defaultPath = './plugins/maimai-plugin/resources/assets/default_jacket.png'
                if (fs.existsSync(defaultPath)) {
                    return defaultPath
                }
                throw error;
            }
        }
        return path
    }

    // 获取音频资源
    async getMusicAsset(songId) {
        const path = `${this.tempPath}/LX_assets/music/${songId}.mp3`
        if (!fs.existsSync(path)) {
            const url = `${this.assetsURL}/maimai/music/${songId}.mp3`
            const response = await fetch(url)
            const buffer = await response.arrayBuffer()
            await fs.promises.mkdir(`${this.tempPath}/LX_assets/music`, { recursive: true })
            await fs.promises.writeFile(path, Buffer.from(buffer))
        }
        return path
    }



//图标使用baseURL

    //获取class_rank https://maimai.lxns.net/assets/maimai/class_rank/{id}.webp
    async getClassRankAsset(id) {
        const path = `${this.tempPath}/LX_assets/class_rank/${id}.webp`
        if (!fs.existsSync(path)) {
            const url = `${this.baseURL}/assets/maimai/class_rank/${id}.webp`
            const response = await fetch(url)
            const buffer = await response.arrayBuffer()
            await fs.promises.mkdir(`${this.tempPath}/LX_assets/class_rank`, { recursive: true })
            await fs.promises.writeFile(path, Buffer.from(buffer))
        }
        return path
    }

    //获取course_rank https://maimai.lxns.net/assets/maimai/course_rank/{id}.webp
    async getCourseRankAsset(id) {
        const path = `${this.tempPath}/LX_assets/course_rank/${id}.webp`
        if (!fs.existsSync(path)) {
            const url = `${this.baseURL}/assets/maimai/course_rank/${id}.webp`
            const response = await fetch(url)
            const buffer = await response.arrayBuffer()
            await fs.promises.mkdir(`${this.tempPath}/LX_assets/course_rank`, { recursive: true })
            await fs.promises.writeFile(path, Buffer.from(buffer))
        }
        return path
    }


    //	https://maimai.lxns.net/assets/maimai/music_rank/{等级}.webp
    //获取等级Rate图标资源
    async getMusicRateAsset(rate) {
        const path = `${this.tempPath}/LX_assets/music_rank/${rate}.webp`
        if (!fs.existsSync(path)) {
            const url = `${this.baseURL}/assets/maimai/music_rank/${rate}.webp`
            const response = await fetch(url)
            const buffer = await response.arrayBuffer()
            await fs.promises.mkdir(`${this.tempPath}/LX_assets/music_rank`, { recursive: true })
            await fs.promises.writeFile(path, Buffer.from(buffer))
        }
        return path
    }



    // 获取音乐图标资源Fc/FS
    async getMusicIconAsset(type) {
        const validTypes = ['fcp', 'fc', 'app', 'ap', 'fsdp', 'fsd', 'fsp', 'fs', 'sync']
        if (!validTypes.includes(type)) {
            return null;
        }
        
        const path = `${this.tempPath}/LX_assets/music_icon/${type}.webp`
        if (!fs.existsSync(path)) {
            try {
                const url = `${this.baseURL}/assets/maimai/music_icon/${type}.webp`
                const buffer = await this.fetchAssetWithRetry(url);
                await fs.promises.mkdir(`${this.tempPath}/LX_assets/music_icon`, { recursive: true })
                await fs.promises.writeFile(path, Buffer.from(buffer))
            } catch (error) {
                logger.error(`[maimai-plugin] 获取音乐图标失败: ${type}`);
                return null;
            }
        }
        return path
    }

}

