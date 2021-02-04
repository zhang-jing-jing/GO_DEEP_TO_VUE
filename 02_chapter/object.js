// 2.4 依赖收集在Dep类中
export default class Dep{
    constructor(){
        this.subs = []
    }
    addSub(sub){
        this.subs.push(sub)
    }
    removeSub(sub){
        remove(this.subs, sub)
    }
    depend(){
        if(window.target){
            this.addSub(window.target)
        }
    }
    notify(){
        const subs = this.subs.slice()
        for(let i=0,l=subs.length ; i<l; i++){
            subs[i].update()
        }
    }
}

function remove(arr, item) {
    if(arr.length){
        const index = arr.indexOf(item)
        if(index > -1){
            return arr.splice(index, 1)
        }
    }
}

// 2.7 递归侦测所有key
/**Observer类会附加到每个被侦测的Object上
 * 一旦被附加上，observer会将booject的所有属性转换为getter/setter 的形式
 * 类收集属性的依赖，并且当属性发生变化时会通知这些依赖
 * **/
export class Observer {
  constructor(value) {
    this.value = value;

    if (!Array.isArray(value)) {
      this.walk(value);
  }
}
  /**
   * walk会将每个属性都转换成getter/setter的形式来侦测变化
   * 这个方法只有在数据类型为object时被调用
   */
  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]]);
    }
  }
}


function defineReactive(data, key, val) {
  // 递归子属性
  if (typeof val === "object") {
    new Observer(val);
  }
  let dep = new Dep()
  Object.defineProperty(data,key,{
      enumerable:true,
      configurable:true,
      get:function () {
        dep.depend()
        return val
      },
      set:function (newVal) {
          if(val === newVal){
              return
          }
          val = newVal
          dep.notify()
      }
  })
}   
