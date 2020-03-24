class MyVue {
  constructor(options) {
    this.$options = options
    let data = this.$data = options.data
    this.$el = this.isElementNode(options.el) ? options.el : document.getElementById(options.el)
    this.proxyData(data)
    new Observe(options)
    new Compiler(this)
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