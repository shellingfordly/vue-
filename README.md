## vue-mini-library
实现vue的基础数据双向数据绑定功能

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
2. 劫持data数据，为data内的数据添加get和set，并为每个数据创建一个订阅器对象dep
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
3. 编译


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
* 鼠标移入移出等1


### 参考项目
[DMQ/mvvm](https://github.com/DMQ/mvvm)
