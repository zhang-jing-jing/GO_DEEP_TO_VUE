import { Dep, arrayMethods } from "./array";

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

// 3.4 将拦截器挂载方法挂载到数组的属性上
/**
 * vue做法粗暴如果不能使用__proto__就直接将arrayMethods身上的这些方法设置到被侦测的数组上
 * **/

// __proto__ 是否可用
const hasProto = "__proto__" in {};
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export class Observer {
  constructor(value) {
    this.value = value;

    if (Array.isArray(value)) {
      // 修改
      const augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
    } else {
      this.walk(value);
    }
  }

  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]]);
    }
  }
}

function protoAugment(target, src, keys) {
    target.__proto__ = src
}

function copyAugment(target, src, keys) {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        def(target, key, src[key])   
    }
}