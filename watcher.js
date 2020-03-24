class Watcher {
  constructor(exp, vm, cb) {
    this.cb = cb
    this.oldValue = this.getValue(exp, vm)
  }
  getValue(exp, vm) {
    Dep.target = this
    let oldValue = CompileUtil.getValue(exp, vm)
    Dep.target = null
    return oldValue
  }
  upData(newValue) {
    this.cb(newValue)
  }
}
class Dep {
  constructor(key) {
    this.key = key
    this.subs = []
  }
  addSub(w) {
    this.subs.push(w)
  }
  notify(newValue) {
    this.subs.forEach(w => w.upData(newValue))
  }
}