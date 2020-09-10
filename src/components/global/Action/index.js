const getComponent = modules => () => import(`./${modules}`)

export const actioninput = getComponent('input')
export const actionselect = getComponent('select')
export const actiondate = getComponent('date')
export const actionradio = getComponent('radio')
export const actioneditor = getComponent('editor')
