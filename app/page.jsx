'use client'

import { useState } from 'react'

const NUM_MAP = {
  '1. HOOK MECHANICS': '01', '2. NARRATIVE ARC': '02',
  '3. PACING AND RHYTHM': '03', '4. PSYCHOLOGICAL JOURNEY': '04', '5. STEAL VS ADAPT': '05'
}
const TITLE_MAP = {
  '1. HOOK MECHANICS': 'Hook mechanics', '2. NARRATIVE ARC': 'Narrative arc',
  '3. PACING AND RHYTHM': 'Pacing and rhythm', '4. PSYCHOLOGICAL JOURNEY': 'Psychological journey',
  '5. STEAL VS ADAPT': 'Steal vs adapt'
}

function parseSections(text) {
  return text.split(/##\s+/).filter(s => s.trim()).map(part => {
    const lines = part.split('\n')
    const raw = lines[0].trim()
    return { raw, num: NUM_MAP[raw] || '--', title: TITLE_MAP[raw] || raw, body: lines.slice(1).join('\n').trim() }
  })
}

function parseBody(body) {
  const points = []
  const blocks = body.split(/\n(?=\*\*[^*]+\*\*)/)
  blocks.forEach(block => {
    block = block.trim()
    if (!block) return
    const m = block.match(/^\*\*(.+?)\*\*[:\s]*(.*)$/s)
    if (m) points.push({ label: m[1].trim(), text: m[2].trim() })
    else block.split('\n\n').forEach(p => { if (p.trim()) points.push({ label: null, text: p.trim() }) })
  })
  if (!points.length) body.split('\n\n').forEach(p => { if (p.trim()) points.push({ label: null, text: p.trim() }) })
  return points
}

function SectionCard({ sec, idx }) {
  const [open, setOpen] = useState(true)
  const isSteal = sec.raw === '5. STEAL VS ADAPT'
  const lines = sec.body.split('\n').filter(l => l.trim())
  const extract = prefix => {
    const line = lines.find(l => l.toLowerCase().startsWith(prefix.toLowerCase())) || ''
    return line.replace(new RegExp('^' + prefix + '\\s*', 'i'), '').trim()
  }
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(13,13,13,.13)', borderRadius: 6, marginBottom: 12, overflow: 'hidden', animation: `fadeUp .3s ${idx * 0.07}s ease both` }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', cursor: 'pointer', background: open ? '#efeae3' : '#fff', borderBottom: open ? '1px solid rgba(13,13,13,.13)' : 'none', userSelect: 'none' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '.1em', color: '#e8420a' }}>{sec.num}</span>
        <span style={{ fontFamily: 'sans-serif', fontSize: 15, fontWeight: 800, flex: 1 }}>{sec.title}</span>
        <span style={{ fontSize: 11, color: '#8a857e', transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform .2s' }}>▾</span>
      </div>
      {open && (
        isSteal ? (
          <div style={{ padding: '22px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ background: '#edf5e8', borderRadius: 4, padding: '14px 16px' }}>
                <span style={{ display: 'block', fontFamily: 'monospace', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: '#3a7a2a', marginBottom: 6 }}>Steal directly</span>
                <p style={{ fontSize: 13, lineHeight: 1.65 }}>{extract('What to steal directly:')}</p>
              </div>
              <div style={{ background: '#fdf8ec', borderRadius: 4, padding: '14px 16px' }}>
                <span style={{
