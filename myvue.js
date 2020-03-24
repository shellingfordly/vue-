class MyVue {
  constructor(options) {
    this.$options = options
    let data = this.$data = options.data
    this.$el = this.isElementNode(options.el) ? options.el : document.getElementById(options.el)
    this.proxyData(data)
    new Observe(options)
    console.time('1')
    new Compiler(this)
    console.timeEnd('1')
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
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
}