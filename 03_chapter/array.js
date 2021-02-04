// Object的追踪是通过setter来实现的，
// 但是Array通过原型上的方法来改变数据，之前的getter/setter方法就行不通了
// 可以用一个拦截器来覆盖Array.prototype

// 依赖收集类
export default class Dep {
  constructor() {
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
      this.addSub(window.target);
    }
  }
  notify() {
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}

function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

function defineReactive(data, key, val) {
  // 递归子属性
  if (typeof val === "object") {
    new Observer(val);
  }
  let dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      dep.depend();
      return val;
    },
    set: function (newVal) {
      if (val === newVal) {
        return;
      }
      val = newVal;
      dep.notify();
    },
  });
}   

// 3.2 拦截器
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

;[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
.forEach(function (method) {
    // 缓存原始方法 arrayMethods封装了改变数据自身内容的方法（push,pop,shift,unshift,splice,sort,reverse）
    const original = arrayProto[method]
    Object.defineProperty(arrayMethods, method, {value: function mutator(...args) {
        // 这里可以做些其他的事情
        return original.apply(this, args)
    },
    enumerable:false,
    writable:true,
    configurable:true
    })
})

// 3.3 使用拦截器覆盖Array原型
export class Observer{
    constructor (value){
        this.value = value
    
        if(Array.isArray(value)){
            value.__proto__ = arrayMethods // 新增   巧妙的（用拦截器）覆盖value的原型功能
        }else{
            this.walk(value)
        }
    }
    /**
     * walk会将每个属性都转换成getter/setter的形式来侦测变化
     * 这个方法只有在数据类型为object时被调用
    */
   walk(obj){
        const keys = Object.keys(obj)
        for(let i=0;i<keys.length;i++){
            defineReactive(obj, keys[i], obj[keys[i]])
        }
   }
}

