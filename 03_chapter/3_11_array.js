// 3.11 侦测新增元素的变化

import { arrayMethods } from "./array"

// 获取新增元素

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
    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args);
        const ob = this.__ob__ // 获取observer实例
        // 
        let inserted
        switch (method) {
          case "push":
          case "unshift":
            inserted = args  
            break
          case 'splice':
            inserted = args.slice()
            break
        }
        if (inserted) {
            ob.observerArray(inserted)
        }
        ob.dep.notify()
        return result
    }) 
})