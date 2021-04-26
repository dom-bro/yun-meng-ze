export function getType (val) {
  return val
    ? Object(val).constructor.name
    : Object.prototype.toString.call(val).match(/\[object (.*)]/)[1]
}

/**
 * @作用 将插件需要的样式写到 <style> 里并 append 到 <head> 里
 */
export function addStyle (rules) {
  let stylesheet = document.getElementById('es6-dessert-stylesheet')
  if (!stylesheet) {
    stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'es6-dessert-stylesheet')
    document.head.appendChild(stylesheet)
  }
  stylesheet.innerHTML += rules
}

export function deepClone (obj) {
  return obj ? JSON.parse(JSON.stringify(obj)) : obj
}
