import Dep, { Observer } from "./array"
// 3.7 收集依赖
/**
 * 把Dep实例保存在
 * **/
function defineReactive(data, key, val) {
    let childOb = observe(val) //修改
    let dep = new Dep()
    Object.defineProperty(data, key, {
        enumerable:true,
        configurable:true,
        get:function (){
            dep.depend()

            if(childOb){
                childOb.dep.depend()
            }
            return val
        },
        set:function (newVal) {
            if(val === newVal){
                return
            }
            dep.notify()
            val = newVal
        }
    })
}

/**
 * 尝试为value创建一个observer实例。
 * 如果创建成功，直接返回新创建的observer实例
 * 如果value已经存在一个observer实例，则直接返回它**/
export function observe(value, asRootData) {
    if(!isObject(value)){
        return
    }
    let ob
    if (hasOwn(value,'__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    }else{
        ob = new Observer(value)
    }
    return ob    
}