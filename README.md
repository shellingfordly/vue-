## vue-mini-library
vue微型库仿写，实现vue的小部分基础功能


### 参考项目
[DMQ/mvvm](https://github.com/DMQ/mvvm)

### 过程

#### 初始化
1. 实例化MyVue对象，传入数据对象，对data下的属性进行数据代理，使实例化对象this可以直接获取data下的数据
```js
proxyData(data) {
  Object.keys(data).forEach(key => {
    Object.defineProperty(this, key, {
      get() {
        return data[key]
      },
      set(value) {
        data[key] = value
      }
    })
  })
}
```
2. 劫持data数据，为data内的数据添加get和set，并为每个数据创建一个订阅器对象dep，用来存储监听器watcher
```js
observe(data) {
  if (typeof data === "object")
    Object.keys(data).forEach(key => {
      this.proxyData(data, key, data[key])
    })
}
proxyData(data, key, value) {
  this.observe(value)
  let dep = new Dep(key)
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) dep.addSub(Dep.target)
      return value
    },
    set(newValue) {
      if (value !== newValue) {
        value = newValue
        dep.notify(newValue)
      }
    }
  })
```
3. 编译模板，基于实例化对象的数据初始化界面，并为数据添加监听器对象watcher，在实例化过程中触发get添加到数据对应的dep订阅器中
```js
// 非事件指令处理函数
disEventDirective(node, dir, exp, vm) {
  let value = this.getValue(exp, vm)
  UpdataUtil[dir](node, value)
  // 实例化监听器对象，传入对应的数据，以及更新数据的回调函数
  new Watcher(exp, vm, (newValue) => {
    UpdataUtil[dir](node, newValue)
  })
},
// 事件指令处理函数
eventDirective(node, dir, exp, vm) {
  const methods = vm.$options.methods
  node.addEventListener(dir, methods[exp].bind(vm))
},
```

#### 数据更新
修改MyVue实例化对象下的data数据时，触发set函数，数据对应的订阅器对象dep触发其下的notify通知函数，通知监听器对象watcher触发upData函数，执行回调，更改数据
```js
// 订阅器对象dep下的通知函数
 notify(newValue) {
  this.subs.forEach(w => w.upData(newValue))
}
// 监听器对象watche下的更新函数
upData(newValue) {
  this.cb(newValue)
}
```


### 功能

#### 部分vue指令
* v-model
* v-class动态类名
* v-html
* v-text
* v-href

#### 双向数据绑定
* 插值符{{}}
* v-model

#### 基础事件

* 点击/双击事件
* 鼠标移入移出等等


