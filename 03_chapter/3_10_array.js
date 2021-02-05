// 3.10 侦测数组中元素的变化

import { observe } from "./3_7_array"

export class Observer{
    constructor(value){
        this.value = value
        this.dep = new Dep()
        def(value, '__ob__', this) // 新增

        if(Array.isArray(value)){
            this.observerArray(value)
        } else {
            this.walk(value)
        }
    }
    /**
     * 侦测Array中的每一项
     * **/
    observerArray(items){
        for(let i=0,l=items.length; i<l;i++){
            observe(items[i])
        }
    }
    ...
}

