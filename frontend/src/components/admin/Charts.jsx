import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const TEAL = '#0d9488'
const INK = '#1C1D21'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-ink-100 px-3 py-2 text-xs shadow-card rounded-xl">
      <p className="font-medium text-ink">{label}</p>
      <p className="text-teal">{payload[0].value} applications</p>
    </div>
  )
}

export function DepartmentChart({ data }) {
  const chartData = data.map(d => ({ name: d._id || 'Unknown', count: d.count }))
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-wide font-medium text-ink-400 mb-4">Applications by Department</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} barSize={22}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#7a7b84' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#7a7b84' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f7', radius: 8 }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? INK : TEAL} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TimelineChart({ data }) {
  const chartData = data.map(d => ({
    name: new Date(d._id).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    count: d.count,
  }))
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-wide font-medium text-ink-400 mb-4">7-Day Submissions</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} barSize={22}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#7a7b84' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#7a7b84' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f7', radius: 8 }} />
          <Bar dataKey="count" fill={TEAL} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
