// vm.$watch

// vm.$watch其实是对watcher的一种封装

Vue.prototype.$watch = function (expOrFn, cb, options){
    const vm = this
    options = options || {}
    const watcher = new Watcher(vm, expOrFn, options)
    if (options.immediate){
        cb.call(vm, watcher.value)
    }
    return function unwatchFn(){
        watcher.teardown() // 取消监听
    }

}

export default class Watcher{
    constructor(vm, expOrFn, cb){
        this.vm = vm
        // deep 参数实现原理 新增
        if(options){
            this.deep = !!options.deep
        }else{
            this.deep = false
        }        
        // deep 参数实现原理 新增

        this.deps = []
        this.depIds = new Set()
        // exporFn
        if(typeof expOrFn === "function"){
            this.getter = expOrFn
        }else {
            this.getter = parsePath(expOrFn)
        }
        this.cb = cb
        this.value = value
    }
    get(){
         window.target = this
         let value = this.getter.call(vm, vm)
         // deep 参数实现原理 新增
         if(this.deep){
            traverse(value)
         }
         // deep 参数实现原理 新增
         window.target = undefined
         return value
    }
    addDep(dep){
        const id = dep.id
        if(!this.depIds.has(id)){
            this.depIds.add(id)
            this.deps.push(dep)
            dep.addSub(this) // 将自己订阅到dep中
        }
    }
    teardown(){
        let i = this.deps.length
        while (i--) {
            this.deps[i].removeSub(this)
        }
    }
}

let uid = 0

export default class Dep {
    constructor() {
      this.id = uid++ // 新增
        this.subs = [];
    }
    addSub(sub) {
      this.subs.push(sub);
    }
    removeSub(sub) {
      remove(this.subs, sub);
    }
    depend() {
      if (window.target) {
        // this.addSub(window.target); // 废弃
        window.target.addDep(this)
      }
    }
    notify() {
      const subs = this.subs.slice();
      for (let i = 0, l = subs.length; i < l; i++) {
        subs[i].update();
      }
    }
    removeSub(sub){
        const index = this.subs.indexOf(sub)
        if(index > -1){
            return this.subs.splice(index, 1)
        }
    }
  }

  const seenObjects = new Set()

  export function traverse(val){
      _traverse(val, seenObjects)
      seenObjects.clear()
  }

  function _traverse(val, seen){
      let i,keys
      const isA = Array.isArray
      if((!isA && !isObject(val) || Object.isFrozen(val))){
          return
      }
      if(val.__ob__){
          const depId = val.__ob__.dep.id
          if(seen.has(depId)){ // 确保不会重复收集依赖
              return
          }  
          seen.add(depId)
      }
      if(isA){
          i = val.length
          while (i--){
              _traverse(val[i], seen)
          }
      } else {
        keys = Object.keys(val)
        i = keys.length
        while (i--){
            _traverse(val[keys[i]], seen)
        }
      }
  }