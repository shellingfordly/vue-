class Compiler {
  constructor(vm) {
    this.vm = vm
    this.data = vm.$data
    let fragment = this.fragment = document.createDocumentFragment()
    fragment.appendChild(vm.$el)
    this.compiler(fragment.firstChild)
    document.body.appendChild(fragment)
  }
  compiler(node) {
    let childs = node.childNodes
    let reg = /\{\{(.+?)\}\}/g
    childs.forEach(child => {
      if (this.isElementNode(child)) { // 处理元素节点
        this.handleElementNode(child, this.vm)
      } else if (this.isTextNode(child) && reg.test(child.nodeValue)) { // 文本节点，且带有插值符
        this.handleTextNode(child, this.vm)
      }
      this.compiler(child)
    });
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
  handleTextNode(node, vm) {
    let {
      nodeValue
    } = node
    let reg = /\{\{(.+?)\}\}/g
    node.nodeValue = nodeValue.replace(reg, ($, exp) => {
      new Watcher(exp, vm, (newValue) => {
        node.nodeValue = nodeValue.replace(reg, newValue)
      })
      return CompileUtil.getValue(exp, vm)
    })
  }
  handleElementNode(node, vm) {
    let attrs = [...node.attributes]
    attrs.forEach(attr => {
      let {
        nodeName,
        nodeValue
      } = attr
      let dir = ""
      if (nodeName.startsWith('v-on') || nodeName.startsWith('@')) {
        if (nodeName.includes(':'))
          dir = nodeName.split(':')[1]
        else if (nodeName.includes('@'))
          dir = nodeName.split('@')[1]
        CompileUtil.eventDirective(node, dir, nodeValue, vm)
      } else if (nodeName.startsWith("v-")) {
        dir = nodeName.split('-')[1]
        CompileUtil.disEventDirective(node, dir, nodeValue, vm)
      }
    })
  }
}
CompileUtil = {
  disEventDirective(node, dir, exp, vm) {
    let value = this.getValue(exp, vm)
    UpdataUtil[dir](node, value, exp, vm)
    new Watcher(exp, vm, (newValue) => {
      UpdataUtil[dir](node, newValue, exp, vm)
    })
  },
  eventDirective(node, dir, exp, vm) {
    const methods = vm.$options.methods
    node.addEventListener(dir, methods[exp].bind(vm))
  },
  getValue(exp, vm) {
    return exp.split('.').reduce((data, next) => data[next], vm.$data)
  }
}
UpdataUtil = {
  text(node, value) {
    node.innerText = value
  },
  html(node, value) {
    node.innerHTML = value
  },
  class(node, value) {
    if (!node.classList.contains(value))
      node.classList.add(value)
  },
  model(node, value, exp, vm) {
    node.value = value
    node.addEventListener('input', () => {
      vm[exp] = node.value
    })
  },
  href(node, value) {
    node.href = value
  }
}