import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Types remain the same for drop-in compatibility
export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let toastId = 0
const TOAST_DURATION = 4000 // ms

// Color mapping using Bootstrap CSS variables for consistency with the app theme
const typeColor: Record<ToastType, string> = {
  success: "var(--bs-success)",
  error: "var(--bs-danger)",
  info: "var(--bs-info)",
  warning: "var(--bs-warning)",
}

// KeenIcons mapping (already loaded in main.tsx)
const typeIcon: Record<ToastType, string> = {
  success: "ki-duotone ki-check-circle",
  error: "ki-duotone ki-cross-circle",
  info: "ki-duotone ki-information-2",
  warning: "ki-duotone ki-shield-warning",
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const addToast = (message: string, type: ToastType = "info") => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => removeToast(id), TOAST_DURATION)
  }

  // Prevent body scroll jump when many toasts stack (optional, minimal)
  useEffect(() => {
    // no-op for now, reserved for future UX tweaks
  }, [toasts.length])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Styles scoped to provider to mimic Sonner look & feel */}
      <style>{`
        .sonner-container {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 2000;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none; /* allow clicks to pass except on toast */
        }
        .sonner-toast {
          pointer-events: auto;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-width: 320px;
          max-width: 420px;
          background: var(--bs-body-bg, #fff);
          color: var(--bs-body-color, #1f2937);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06);
          padding: 12px 14px 14px 12px;
          overflow: hidden;
          transform: translateX(16px);
          opacity: 0;
          animation: sonner-enter 180ms ease forwards;
        }
        .sonner-accent {
          width: 4px;
          flex: 0 0 4px;
          border-radius: 4px;
          align-self: stretch;
          margin-right: 4px;
        }
        .sonner-icon {
          line-height: 1;
          margin-top: 2px;
          color: var(--sonner-color);
        }
        .sonner-icon .path1, .sonner-icon .path2 { opacity: 1; }
        .sonner-content {
          flex: 1 1 auto;
          font-size: 0.95rem;
          line-height: 1.35;
          white-space: pre-line;
        }
        .sonner-close {
          background: transparent;
          border: 0;
          color: var(--bs-gray-700, #6b7280);
          padding: 4px;
          margin-left: 8px;
          border-radius: 6px;
        }
        .sonner-close:hover { background: rgba(0,0,0,0.04); }
        .sonner-progress {
          position: relative;
          height: 2px;
          width: 100%;
          background: rgba(0,0,0,0.06);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 8px;
        }
        .sonner-progress > span {
          display: block;
          height: 100%;
          width: 100%;
          background: var(--sonner-color);
          animation: sonner-progress linear ${TOAST_DURATION}ms forwards;
        }
        .sonner-toast:hover .sonner-progress > span { animation-play-state: paused; }

        @keyframes sonner-enter {
          from { transform: translateX(16px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes sonner-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      {/* Toast Container */}
      <div className="sonner-container">
        {toasts.map((toast) => {
          const color = typeColor[toast.type]
          const iconClass = typeIcon[toast.type]
          return (
            <div
              key={toast.id}
              className="sonner-toast"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              style={{ ['--sonner-color' as any]: color }}
            >
              <div className="sonner-accent" style={{ background: color }} />

              <i className={`sonner-icon ${iconClass} fs-2`}> 
                <span className="path1"></span>
                <span className="path2"></span>
              </i>

              <div className="sonner-content">{toast.message}</div>

              <button
                type="button"
                className="sonner-close"
                aria-label="Close"
                onClick={() => removeToast(toast.id)}
                title="Close"
              >
                <i className="ki-duotone ki-cross fs-3">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
              </button>

              {/* Progress bar */}
              <div className="sonner-progress" style={{ position: "absolute", left: 12, right: 12, bottom: 8 }}>
                <span />
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider")
  }
  return context
}