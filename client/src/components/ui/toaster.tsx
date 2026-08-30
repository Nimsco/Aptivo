import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import * as React from "react"

export function Toaster() {
  const { toasts } = useToast()
  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[420px]">
      {toasts.map((toast) => (
        <div key={toast.id} className="mb-2 rounded-lg border bg-background p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {toast.title && <div className="font-medium">{toast.title}</div>}
              {toast.description && <div className="text-sm text-muted-foreground">{toast.description}</div>}
            </div>
            <button onClick={() => toast.onDismiss?.()} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
