// Add at top
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Maximize2, Wand2 } from "lucide-react"

export default function SelectionPopup({ editor }: { editor: any }) {
  const popupRef = useRef<HTMLDivElement | null>(null)
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)
  const [selectedText, setSelectedText] = useState("")

  useEffect(() => {
    if (!editor) return

    const update = () => {
      const { from, to } = editor.state.selection
      if (from === to) {
        setCoords(null)
        setSelectedText("")
        return
      }

      const domSelection = window.getSelection()
      if (!domSelection || domSelection.rangeCount === 0) return

      const range = domSelection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setCoords({
        top: rect.top + window.scrollY - 40, // position above
        left: rect.left + rect.width / 2,
      })

      setSelectedText(editor.state.doc.textBetween(from, to, " "))
    }

    editor.on("selectionUpdate", update)
    return () => editor.off("selectionUpdate", update)
  }, [editor])

  const enhanceText = async () => {
    if (!selectedText) return
    try {
      // 🔥 Call Groq or any LLM API here
      const response = await fetch("http://localhost:3000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText }),
      })
      const data = await response.json()

      // Replace text in editor
      editor.chain().focus().insertContentAt(editor.state.selection, data.enhanced).run()
      setCoords(null)
    } catch (err) {
      console.error("Enhancement failed", err)
    }
  }

  const increaseText = async () => {
    if (!selectedText) return
    try {
      // 🔥 Call Groq or any LLM API here
      const response = await fetch("http://localhost:3000/api/ai/increase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText }),
      })
      const data = await response.json()

      // Replace text in editor
      editor.chain().focus().insertContentAt(editor.state.selection, data.enhanced).run()
      setCoords(null)
    } catch (err) {
      console.error("Increasing failed", err)
    }
  }

  if (!coords) return null

  return createPortal(
    <div
      ref={popupRef}
      className="absolute z-50 bg-white border shadow-md rounded-md px-2 py-1 flex items-center gap-1"
      style={{
        top: coords.top,
        left: coords.left,
        transform: "translateX(-50%)",
      }}
    >
      <button
        onClick={enhanceText}
        className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-gray-100 rounded"
      >
        <Wand2 className="w-4 h-4" /> Enhance
      </button>
      <button
        onClick={increaseText}
        className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-gray-100 rounded"
      >
        <Maximize2 className="w-4 h-4" /> Increase
      </button>
    </div>,
    document.body
  )
}
