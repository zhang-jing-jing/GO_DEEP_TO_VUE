// 手写promise
const PENDING = "pending" // 初始状态
const FULFILLED = "fulfilled" // 成功状态
const REJECTED = "rejected" // 失败状态

class NewPromise {
  constructor(handle) {
    this.resolveCallCack = []; // 存储成功时的回调函数
    this.rejectCallCack = []; // 存储失败时的回调函数
    this.value = undefined;
    this.err = undefined;
    this.status = PENDING; // promise的状态

    //  只允许 Promise 实例状态从 pending 变为 fulfilled 或者从 pending 变为 rejected

    let resolve = (data) => {
      // resolve pedding状态时转为fulfilled状态
      if (this.status !== PENDING) return;
      this.status = FULFILLED;
      this.value = data;
      this.resolveCallCack.forEach((fn) => {
        fn(this.value);
      });
    };

    let reject = (error) => {
      // reject pedding状态时转为rejected状态
      if (this.status !== PENDING) return;
      this.status = REJECTED;
      this.err = error;
      this.rejectCallCack.forEach((fn) => {
        fn(this.err);
      });
    };

    try {
      handle(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // then方法不放在构造函数中，因为每个promise实例的then方法逻辑都是一致的
  then(resolveNext, rejectNext){
    resolveNext = typeof resolveNext === "function" ? resolveNext : (data) => data;
    rejectNext = typeof rejectNext === "function" ? rejectNext: (error) => { throw error; };

    switch (this.status) {
        case PENDING:// 等待状态时，先记录成功和失败的数组,等待 status变为其他状态时调用
            this.resolveCallCack.push(resolveNext);
            this.rejectCallCack.push(rejectNext);
            break;
        case FULFILLED: // 成功状态时，执行
            resolveNext(this.value);
            break;
        case REJECTED:
            rejectNext(this.err);
            break;
    }
  }
}

var a = new NewPromise((resolve,reject)=>{
    resolve('data');
}).then(data => {
    console.log(data);
});

console.log(1)