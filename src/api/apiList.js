import request from '@/api/index'
export function test() {
  return request.get('/test', { a: 1 })
}

export function test2() {
  return request.post('/test2', { a: 1 })
}

export function getDic() {
  return request.get('/dic')
}

export function getOssPolicy() {
  return request.get('/ossPolicy')
}

export default {
  getRegion() {
    return request.get('/region')
  }
}
