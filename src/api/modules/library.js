import request from '@/api/index'

export function getLabel() {
  return request.get('/label')
}

export function getPublicResource(params) {
  return request.get('/publicResource', params)
}

export function getPublicLive(params) {
  return request.get('/publicLive', params)
}
