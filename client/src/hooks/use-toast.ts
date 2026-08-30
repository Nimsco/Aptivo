import * as React from "react"

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Toast = {
  id: string
  title?: string
  description?: string
  onDismiss?: () => void
}

const listeners: ((state: { toasts: Toast[] }) => void)[] = []
let memory: { toasts: Toast[] } = { toasts: [] }

export function useToast() {
  const [state, setState] = React.useState(memory)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    ...state,
    toast: (data: Omit<Toast, 'id'>) => {
      const toast = { ...data, id: genId() }
      memory.toasts = [...memory.toasts, toast]
      listeners.forEach((listener) => listener(memory))
      setTimeout(() => {
        memory.toasts = memory.toasts.filter((t) => t.id !== toast.id)
        listeners.forEach((listener) => listener(memory))
      }, 5000)
    },
    dismiss: (id?: string) => {
      if (id) {
        memory.toasts = memory.toasts.filter((t) => t.id !== id)
      } else {
        memory.toasts = []
      }
      listeners.forEach((listener) => listener(memory))
    },
  }
}

export function toast(data: Omit<Toast, 'id'>) {
  const toast = { ...data, id: genId() }
  memory.toasts = [...memory.toasts, toast]
  listeners.forEach((listener) => listener(memory))
  setTimeout(() => {
    memory.toasts = memory.toasts.filter((t) => t.id !== toast.id)
    listeners.forEach((listener) => listener(memory))
  }, 5000)
}
