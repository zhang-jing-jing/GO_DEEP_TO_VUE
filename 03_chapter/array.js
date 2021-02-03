// Object的追踪是通过setter来实现的，
// 但是Array通过原型上的方法来改变数据，之前的getter/setter方法就行不通了
// 可以用一个拦截器来覆盖Array.prototype