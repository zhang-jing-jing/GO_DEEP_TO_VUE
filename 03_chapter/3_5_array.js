import Dep from "./array";
import {Observer} from "./3_4_array"
/**
 * 3.5 如何收集数组依赖
 * Array在getter中收集依赖，在拦截器中触发依赖
 * 
 * **/

export function defineReactive(data, key, val) {
    if(typeof val === 'object') new Observer(val)
    let dep = new Dep()
    Object.defineProperty(data, key,{
        enumerable:true,
        configurable:true,
        get:function () {
            dep.depend()
            // 这里是Array的依赖
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





                    