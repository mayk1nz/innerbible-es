'use client'

import { Fragment } from 'react'

// The AI's answers (Consejero, Guía de Estudio): a light markdown — paragraphs, line
// breaks, numbered and bulleted steps, **bold** — rendered as real elements.

/** "a **b** c" → a <strong>b</strong> c. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, j) => (
        <Fragment key={j}>{j % 2 ? <strong className="font-semibold">{part}</strong> : part}</Fragment>
      ))}
    </>
  )
}

type Block = { kind: 'p'; lines: string[] } | { kind: 'ol' | 'ul'; items: string[] }

const OL_ITEM = /^\s*\d+[.)]\s+/
const UL_ITEM = /^\s*[-•*]\s+/

/** The answer's light markdown: paragraphs, line breaks, numbered and bulleted steps, bold. */
function toBlocks(text: string): Block[] {
  const blocks: Block[] = []
  let gap = false
  for (const raw of text.split('\n')) {
    // A stray heading ("### Paso 1") reads as a bold line.
    const line = raw.replace(/^\s*#{1,6}\s+(.*)$/, '**$1**')
    const last = blocks[blocks.length - 1]
    if (!line.trim()) {
      gap = true
      continue
    }
    const kind = OL_ITEM.test(line) ? 'ol' : UL_ITEM.test(line) ? 'ul' : 'p'
    if (kind === 'p') {
      // A blank line starts a new paragraph; a single line break stays inside it.
      if (last?.kind === 'p' && !gap) last.lines.push(line)
      else blocks.push({ kind: 'p', lines: [line] })
    } else {
      // Steps separated by blank lines are still one list (numbering continues).
      const item = line.replace(kind === 'ol' ? OL_ITEM : UL_ITEM, '')
      if (last?.kind === kind) last.items.push(item)
      else blocks.push({ kind, items: [item] })
    }
    gap = false
  }
  return blocks
}

export function Answer({ text }: { text: string }) {
  return (
    <div className="space-y-2.5">
      {toBlocks(text).map((b, i) =>
        b.kind === 'p' ? (
          <p key={i}>
            {b.lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                <Inline text={l} />
              </Fragment>
            ))}
          </p>
        ) : b.kind === 'ol' ? (
          <ol key={i} className="space-y-2">
            {b.items.map((item, j) => (
              <li key={j} className="flex gap-2.5">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold-soft font-sans text-[13px] font-bold text-ink">{j + 1}</span>
                <span className="min-w-0">
                  <Inline text={item} />
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <ul key={i} className="space-y-1.5">
            {b.items.map((item, j) => (
              <li key={j} className="flex gap-2.5">
                <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                <span className="min-w-0">
                  <Inline text={item} />
                </span>
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  )
}

