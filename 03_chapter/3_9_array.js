// 3.9 向数组依赖发送通知
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
            const result = original.apply(this, args)
            const ob = this.__ob__ // 获取observer实例
            ob.dep.notify // 向依赖发送通知
            return original.apply(this, args)
        },
        enumerable:false,
        writable:true,
        configurable:true
    })
})