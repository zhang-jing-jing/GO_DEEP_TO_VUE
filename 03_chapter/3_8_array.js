// 3.8 在拦截器中获取Observer实例

import Dep, { arrayMethods } from "./array"

// 工具函数


function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value:val,
        enumerable:!!enumerable,
        writable:true,
        configurable:true
    })
}

/**__ob__的作用不仅仅是为了在拦截器中访问Observer实例这么简单，
 * 还可以用来标记当前value 是否已经被Observer 转换成了 响应式数据
 * **/
export class Observer{
    constructor(value){
        this.value = value
        this.dep = new Dep()
        def(value, '__ob__', this) // 新增

        if(Array.isArray(value)){
            const augment = hasProto ? protoAugment : copyAugment
            augment(value, arrayMethods, arrayKeys)
        } else {
            this.walk(value)
        }
    }
    ...
}

/**
 * 当value身上被标记了__ob__之后，就可以通过value.__ob__来访问Observer实例。
 * 如果是Array拦截器，因为拦截器是原型方法，所以可以直接通过this.__ob__来访问Observer实例
 * **/
;['push',
'pop',
'shift',
'unshift',
'splice',
'sort',
'reverse']
.forEach(function (method) {
    // 缓存原始方法
    const  original = arrayProto[method]   
    Object.defineProperty(arrayMethods, method, {
        value:function mutator(...args) {
            const ob = this.__ob__ // 新增 获取observer实例
            return original.apply(this, args)
        },
        enumerable:false,
        writable:true,
        configurable:true
    })
})