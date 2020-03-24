class Observe {
  constructor(vm) {
    this.data = vm.data
    this.observe(vm.data)
  }
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
  }
}