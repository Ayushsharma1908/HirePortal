import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Briefcase,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function JobCard({ job }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="card-hover cursor-pointer animate-slide-up group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 bg-ink-50 border border-ink-100 rounded-2xl flex items-center justify-center shadow-soft group-hover:border-teal/30 group-hover:bg-teal-muted/30 transition-colors">
            <Briefcase
              size={18}
              className="text-ink-400 group-hover:text-teal transition-colors"
            />
          </div>
          <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-ink-400 rounded-full border border-ink-100 bg-white">
            {job.type}
          </span>
        </div>
        <h3 className="font-semibold text-sm text-ink mb-1 group-hover:text-teal-dark transition-colors">
          {job.title}
        </h3>
        <p className="text-xs text-ink-400 mb-4">{job.department}</p>
        <div className="flex items-center gap-3 text-xs text-ink-400">
          <span className="flex items-center gap-1">
            <span className="text-xs">📍</span>
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-teal/70" />
            {job.experienceLevel}
          </span>
        </div>
        {job.salary && (
          <div className="mt-4 pt-4 border-t border-ink-50">
            <p className="text-xs font-semibold text-teal">{job.salary}</p>
          </div>
        )}
      </div>

      {open && (
        <>
          <div className="drawer-overlay" onClick={() => setOpen(false)} />
          <div className="drawer-panel w-full max-w-md animate-slide-in-right">
            <div className="p-6 border-b border-ink-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10 rounded-tl-3xl">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-teal font-medium mb-1">
                  Role Details
                </p>
                <h2 className="font-semibold text-base text-ink">
                  {job.title}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-ink-50 rounded-xl border border-transparent hover:border-ink-100 transition-all"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  job.department,
                  job.location,
                  job.type,
                  job.experienceLevel,
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-ink-50 text-xs text-ink-600 rounded-full border border-ink-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {job.salary && (
                <div className="mb-5 p-4 bg-teal-muted/60 border border-teal/20 rounded-2xl shadow-soft">
                  <p className="text-xs text-ink-400 mb-0.5">Salary Range</p>
                  <p className="text-sm font-semibold text-teal-dark">
                    {job.salary}
                  </p>
                </div>
              )}

              {job.description && (
                <div className="mb-5 p-4 rounded-2xl border border-ink-100 bg-ink-50/50">
                  <p className="text-xs uppercase tracking-wide font-medium text-ink-400 mb-2">
                    About the Role
                  </p>
                  <p className="text-sm text-ink-600 leading-relaxed">
                    {job.description}
                  </p>
                </div>
              )}

              {job.requirements?.length > 0 && (
                <div className="mb-8 p-4 rounded-2xl border border-ink-100">
                  <p className="text-xs uppercase tracking-wide font-medium text-ink-400 mb-3">
                    Requirements
                  </p>
                  <ul className="space-y-2">
                    {job.requirements.map((req, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-ink-600"
                      >
                        <span className="w-5 h-5 rounded-lg border border-teal/30 bg-teal-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles size={10} className="text-teal" />
                        </span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => {
                  navigate(
                    `/apply?role=${encodeURIComponent(job.title)}&dept=${encodeURIComponent(job.department)}`,
                  );
                }}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
              >
                Apply for this role <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
