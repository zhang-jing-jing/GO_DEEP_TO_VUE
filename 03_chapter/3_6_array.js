import Dep from "./array";
import { arrayMethods } from "./array";
import { defineReactive } from "./3_5_array"

// 3.6 依赖列表存在哪里？ 存在observer中
/**
 * 数组在getter中收集依赖，在拦截器中触发依赖，所以这个依赖保存的位置就很关键，他必须在getter和拦截器中都可以访问到
 * 我们之所以将依赖保存在observer实例上，是因为getter中可以访问到observer实例，同时在array拦截器中也可以访问到observer实例
 * **/
// __proto__ 是否可用
const hasProto = "__proto__" in {};
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export class Observer {
  constructor(value) {
    this.value = value;

    this.dep = new Dep(); // 新增dep

    if (Array.isArray(value)) {
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
  target.__proto__ = src;
}

function copyAugment(target, src, keys) {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    def(target, key, src[key]);
  }
}
