import React from 'react'
import StatusBadge from '../shared/StatusBadge'

function Initials({ name }) {
  const parts = name.split(' ')
  const ini = parts.map(p => p[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-8 h-8 bg-ink text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
      {ini}
    </div>
  )
}

export default function ApplicationTable({ applications, onRowClick }) {
  if (!applications.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-ink-400">No applications found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-100">
            <th className="text-left py-3 px-4 text-xs font-medium text-ink-400 uppercase tracking-wide">Applicant</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-ink-400 uppercase tracking-wide">Role</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-ink-400 uppercase tracking-wide">Department</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-ink-400 uppercase tracking-wide">Status</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-ink-400 uppercase tracking-wide">Applied</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app._id}
              onClick={() => onRowClick(app)}
              className="border-b border-ink-50 hover:bg-ink-50 cursor-pointer transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Initials name={`${app.firstName} ${app.lastName}`} />
                  <div>
                    <p className="font-medium text-ink text-xs">{app.firstName} {app.lastName}</p>
                    <p className="text-ink-400 text-xs">{app.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-xs text-ink-600">{app.jobRole}</td>
              <td className="py-3 px-4 text-xs text-ink-400">{app.department}</td>
              <td className="py-3 px-4"><StatusBadge status={app.status} /></td>
              <td className="py-3 px-4 text-xs text-ink-400">
                {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
