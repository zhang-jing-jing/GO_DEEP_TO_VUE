## 第二章 Object的变化侦测
#### &nbsp;&nbsp;变化侦测就是侦测数据的变化，当数据发生变化时，要能侦测到并发出通知。
#### &nbsp;&nbsp;Object可以通过Object.defineProperty将属性转换成getter/setter的形式来追踪变化。读取数据时会触发getter，修改数据时会触发setter。
#### &nbsp;&nbsp;我们需要在getter中收集有哪些依赖使用了数据。当setter被触发时，去通知getter中收集的依赖数据发生了变化。
#### &nbsp;&nbsp;收集依赖需要为依赖找一个存储依赖的地方，为此我们创建了Dep，它用来收集依赖，删除依赖和向依赖发送消息等。
#### &nbsp;&nbsp;所谓的依赖就是watcher。只有watcher触发的getter才会收集依赖，哪个watcher触发了getter，就把哪个watcher收集到Dep中。当数据发生变化时，会循环依赖列表，把所有watcher都通知一遍。
#### &nbsp;&nbsp;Watcher的原理是先把自己设置到全局唯一的指定位置。（例如：window.target）,然后读取数据。因为读取了数据，所以会触发这个数据的getter。接着，在getter中就会从全局唯一的那个位置读取当前正在读取数据的watcher，并把这个watcher收集到Dep中去。通过这样的方式，watcher可以主动去订阅任意一个数据的变化。
#### &nbsp;&nbsp;此外，我们创建了Obersver类，它的作用是把一个object中的所有数据（包括子数据）都转换成响应式的，也就是它会侦测object中所有的数据（包括子数据）的变化。
#### 由于在ES6之前js并没有提供元编程的能力，所以在对象上新增属性和删除属性无法被追踪到。
 
#### &nbsp;&nbsp;Data通过Observer转换成了getter/setter的形式来追踪变化。
#### &nbsp;&nbsp;当外界通过watcher读取数据时，会触发getter从而将watcher添加到依赖中。
#### &nbsp;&nbsp;当数据发生了变化，会触发setter，从而向Dep中的依赖（watcher）发送通知。
#### &nbsp;&nbsp;Watcher收到通知后，会向外界发送通知，变化通知到外界后可能会触发视图更新，也有可能触发用户的某个回调函数。
