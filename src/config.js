
let env = ''
if (process.env.NODE_ENV === 'development') {
    env = 'dev' // 本地开发环境
} else if (process.env.NODE_ENV === 'test') {
    env = 'test' // test环境
} else if (process.env.NODE_ENV === 'production') {
    env = 'production' // 正式环境
}

// 接口地址
const baseURLs = {
    dev: 'https://api.test.shunqi.sdbus.com.cn/v1/admin',
    test: 'https://api.test.shunqi.sdbus.com.cn/v2/admin',
    production: 'https://api.shunqi.sdbus.com.cn/v3/admin'
}

// 静态资源路径
// 域名下的所有目录
// 比如 http://demo.wennakj.com/cyh/dist/#/login?redirect=%2F 对应静态资源路径/cyh/dist/
const assetsSrcs = {
    dev: '/',
    test: '',
    production: ''
}

const config = {
    baseURL: baseURLs[env],
    assetsSrc: assetsSrcs[env]
}

module.exports = config
