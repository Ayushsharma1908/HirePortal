import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, FileText, Clock, CheckCircle, XCircle, RefreshCw, Plus,
  LogOut, Briefcase, ChevronDown, Download, ExternalLink, X, Star,
  BarChart2, UserCog,
  User, Mail, Phone, MapPin, Calendar, Github, Linkedin, Globe,
  Zap, Award, GraduationCap, MessageSquare, CheckCircle2,
  ThumbsUp, ThumbsDown, Loader2, BookOpen, Search, AlertCircle,
} from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { DepartmentChart, TimelineChart } from "../../components/admin/Charts";
import {
  DEPARTMENTS,
  STATUS_OPTIONS,
  STATUS_COLORS,
} from "../../utils/constants";
import CreateJobModal from "../../components/admin/CreateJobModal";

// ─── Initials Avatar ───────────────────────────────────────────────────────────
function Avatar({ name, size = "md" }) {
  const ini =
    name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  const sz = size === "lg" ? "w-12 h-12 text-sm" : "w-8 h-8 text-xs";
  return (
    <div
      className={`${sz} bg-ink text-white font-medium flex items-center justify-center flex-shrink-0 rounded-2xl`}
    >
      {ini}
    </div>
  );
}

// ─── Status Pill ───────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS["New"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border border-ink-100 ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse-dot`} />
      {status}
    </span>
  );
}
const TERMINAL_STATUSES = ["Hired", "Rejected"];

function confirmStatusChange(from, to) {
  if (from === to) return true;
  if (TERMINAL_STATUSES.includes(from) && TERMINAL_STATUSES.includes(to)) {
    return window.confirm(
      `Change status from "${from}" to "${to}"? This updates the final decision for this applicant.`,
    );
  }
  if (TERMINAL_STATUSES.includes(from) && !TERMINAL_STATUSES.includes(to)) {
    return window.confirm(`Revert status from "${from}" back to "${to}"?`);
  }
  return true;
}

function QuickStatusSelect({ app, onStatusChange }) {
  const [value, setValue] = useState(app.status);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(app.status);
  }, [app._id, app.status]);

  const handleChange = async (e) => {
    const next = e.target.value;
    if (next === app.status) return;
    if (!confirmStatusChange(app.status, next)) return;

    setSaving(true);
    setValue(next);
    try {
      const res = await api.patch(`/applications/${app._id}/status`, {
        status: next,
        notes: app.adminNotes || "",
      });
      onStatusChange(res.data);
      toast.success(`Status updated to ${next}`);
    } catch {
      toast.error("Failed to update status");
      setValue(app.status);
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={saving}
      onClick={(e) => e.stopPropagation()}
      className="text-xs border border-ink-200 rounded-xl bg-white px-2.5 py-1.5 shadow-soft hover:border-ink focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all disabled:opacity-50 cursor-pointer"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, accent, live, sub }) {
  const accentMap = {
    ink: {
      wrap: "border-ink-100",
      icon: "bg-ink-50 text-ink border-ink-100",
      val: "text-ink",
    },
    teal: {
      wrap: "border-teal/20",
      icon: "bg-teal-muted text-teal border-teal/20",
      val: "text-teal",
    },
    amber: {
      wrap: "border-amber/20",
      icon: "bg-amber-muted text-amber-700 border-amber/20",
      val: "text-amber-700",
    },
    green: {
      wrap: "border-green-100",
      icon: "bg-green-50 text-green-700 border-green-100",
      val: "text-green-700",
    },
    red: {
      wrap: "border-red-100",
      icon: "bg-red-50 text-red-500 border-red-100",
      val: "text-red-500",
    },
    purple: {
      wrap: "border-purple-100",
      icon: "bg-purple-50 text-purple-600 border-purple-100",
      val: "text-purple-600",
    },
  };
  const a = accentMap[accent] || accentMap.ink;
  return (
    <div
      className={`bg-white border ${a.wrap} p-4 flex items-center gap-4 animate-fade-in rounded-2xl shadow-soft`}
    >
      <div
        className={`w-10 h-10 flex items-center justify-center border rounded-xl ${a.icon}`}
      >
        <Icon size={17} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-semibold ${a.val}`}>{value}</span>
          {live && (
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse-dot" />
          )}
        </div>
        <p className="text-xs text-ink-400 mt-0.5 truncate">{label}</p>
        {sub && <p className="text-xs text-ink-300 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Applicant Detail Panel ────────────────────────────────────────────────────
function ApplicantPanel({ app, onClose, onStatusChange }) {
  const [status, setStatus] = useState(app.status);
  const [notes, setNotes] = useState(app.adminNotes || "");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    setStatus(app.status);
    setNotes(app.adminNotes || "");
  }, [app._id, app.status, app.adminNotes]);

  const statusChanged = status !== app.status;
  const isTerminalChange =
    TERMINAL_STATUSES.includes(app.status) &&
    TERMINAL_STATUSES.includes(status) &&
    statusChanged;

  const save = async () => {
    if (!confirmStatusChange(app.status, status)) return;
    setSaving(true);
    try {
      const res = await api.patch(`/applications/${app._id}/status`, {
        status,
        notes,
      });
      onStatusChange(res.data);
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const selectStatus = (next) => setStatus(next);

  const statusColors = {
    New: "border-ink-200 text-ink-600 hover:border-ink hover:text-ink",
    "In Review":
      "border-amber/50 text-amber-700 hover:border-amber hover:bg-amber-muted",
    Shortlisted:
      "border-teal/50 text-teal hover:border-teal hover:bg-teal-muted",
    Hired:
      "border-green-300 text-green-700 hover:border-green-400 hover:bg-green-50",
    Rejected:
      "border-red-200 text-red-500 hover:border-red-400 hover:bg-red-50",
  };
  const selectedColors = {
    New: "bg-ink text-white border-ink",
    "In Review": "bg-amber text-white border-amber",
    Shortlisted: "bg-teal text-white border-teal",
    Hired: "bg-green-600 text-white border-green-600",
    Rejected: "bg-red-500 text-white border-red-500",
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-ink/30 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-50 shadow-lift flex flex-col animate-slide-in-right rounded-l-3xl border-l border-ink-100">
        {/* Header */}
        <div className="border-b border-ink-100 px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <Avatar name={`${app.firstName} ${app.lastName}`} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm text-ink truncate">
                {app.firstName} {app.lastName}
              </h2>
              <StatusPill status={app.status} />
            </div>
            <p className="text-xs text-ink-400 mt-0.5">
              {app.jobRole} · {app.department}
            </p>
            <p className="text-xs text-ink-300">{app.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-ink-50 flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ink-100 flex-shrink-0">
          {[
            ["profile", "Profile"],
            ["status", "Evaluate"],
            ["skills", "Skills"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-5 py-2.5 text-xs border-b-2 transition-colors ${tab === id ? "border-ink text-ink font-medium" : "border-transparent text-ink-400 hover:text-ink"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "profile" && (
            <div className="space-y-5 animate-fade-in">
              <InfoBlock title="Personal">
                <InfoRow
                  label="Full Name"
                  value={`${app.firstName} ${app.lastName}`}
                />
                <InfoRow label="Email" value={app.email} />
                <InfoRow label="Phone" value={app.phone} />
                <InfoRow
                  label="Location"
                  value={[app.city, app.state].filter(Boolean).join(", ")}
                />
                <InfoRow label="Gender" value={app.gender} />
                <InfoRow label="Date of Birth" value={app.dob} />
              </InfoBlock>

              <InfoBlock title="Application">
                <InfoRow label="Role" value={app.jobRole} />
                <InfoRow label="Department" value={app.department} />
                <InfoRow label="Experience" value={app.experienceLevel} />
                <InfoRow
                  label="Applied On"
                  value={new Date(
                    app.appliedAt || app.createdAt,
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                />
              </InfoBlock>

              {app.education?.[0] && (
                <InfoBlock title="Education">
                  <InfoRow
                    label="Institution"
                    value={app.education[0].institution}
                  />
                  <InfoRow
                    label="Degree"
                    value={`${app.education[0].degree}${app.education[0].fieldOfStudy ? ` — ${app.education[0].fieldOfStudy}` : ""}`}
                  />
                  <InfoRow
                    label="Grade / CGPA"
                    value={app.education[0].grade}
                  />
                  <InfoRow
                    label="Years"
                    value={`${app.education[0].startYear || ""} – ${app.education[0].endYear || ""}`}
                  />
                </InfoBlock>
              )}

              {(app.githubUrl || app.linkedinUrl || app.portfolioUrl) && (
                <InfoBlock title="Links">
                  {app.githubUrl && (
                    <LinkRow label="GitHub" url={app.githubUrl} />
                  )}
                  {app.linkedinUrl && (
                    <LinkRow label="LinkedIn" url={app.linkedinUrl} />
                  )}
                  {app.portfolioUrl && (
                    <LinkRow label="Portfolio" url={app.portfolioUrl} />
                  )}
                </InfoBlock>
              )}

              {app.coverLetter && (
                <InfoBlock title="Cover Letter">
                  <p className="text-xs text-ink-600 leading-relaxed whitespace-pre-line">
                    {app.coverLetter}
                  </p>
                </InfoBlock>
              )}

              {app.resumePath && (
                <a
                  href={`/uploads/${app.resumePath}`}
                  download={app.resumeOriginalName || "resume.pdf"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-ink text-white text-xs px-4 py-3 w-full hover:bg-ink-800 transition-colors"
                >
                  <Download size={13} /> Download Resume
                </a>
              )}
            </div>
          )}

          {tab === "status" && (
            <div className="space-y-5 animate-fade-in">
              <div className="rounded-2xl border border-ink-100 bg-ink-50/80 p-4 shadow-soft">
                <p className="text-xs text-ink-400 mb-2">Current status</p>
                <StatusPill status={app.status} />
                {statusChanged && (
                  <div className="mt-3 pt-3 border-t border-ink-100 flex items-center gap-2 text-xs">
                    <span className="text-ink-400">Changing to</span>
                    <StatusPill status={status} />
                  </div>
                )}
                {isTerminalChange && (
                  <p className="mt-3 text-xs text-amber-700 bg-amber-muted border border-amber/20 rounded-xl px-3 py-2">
                    You are updating a final decision. Save to confirm this
                    change.
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide font-medium text-ink-400 mb-3">
                  Set Application Status
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => selectStatus(s)}
                      className={`px-4 py-2.5 text-xs border rounded-2xl text-left flex items-center gap-2 transition-all shadow-soft ${status === s ? selectedColors[s] : `bg-white ${statusColors[s]}`}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${status === s ? "bg-white" : STATUS_COLORS[s]?.dot}`}
                      />
                      {s}
                      {status === s && (
                        <span className="ml-auto text-xs opacity-70">
                          Selected
                        </span>
                      )}
                      {app.status === s && status !== s && (
                        <span className="ml-auto text-[10px] opacity-60">
                          Current
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide font-medium text-ink-400 mb-2">
                  Admin Notes
                </p>
                <textarea
                  className="input resize-none text-xs"
                  rows={4}
                  placeholder="Add evaluation notes, feedback, or reasons for decision..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {app.adminNotes && notes !== app.adminNotes && (
                <div className="border border-ink-100 p-3 bg-ink-50">
                  <p className="text-xs text-ink-400 mb-1">Previous notes:</p>
                  <p className="text-xs text-ink-600 italic">
                    {app.adminNotes}
                  </p>
                </div>
              )}

              <button
                onClick={save}
                disabled={
                  saving || (!statusChanged && notes === (app.adminNotes || ""))
                }
                className="w-full bg-ink text-white text-xs py-3 rounded-2xl hover:bg-ink-800 shadow-soft hover:shadow-card transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Saving...
                  </>
                ) : statusChanged ? (
                  `Save as ${status}`
                ) : (
                  "Save Evaluation"
                )}
              </button>
            </div>
          )}

          {tab === "skills" && (
            <div className="space-y-5 animate-fade-in">
              {/* Skills Overview Header */}
              <div className="bg-gradient-to-br from-ink-50 to-white border border-ink-100 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-ink">Skills Overview</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-400">
                      {[
                        ...(app.technicalSkills || []),
                        ...(app.softSkills || []),
                        ...(app.certifications || []),
                      ].length}{" "}
                      total
                    </span>
                  </div>
                </div>

                {/* Skill Distribution Bar */}
                <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden flex">
                  {app.technicalSkills?.length > 0 && (
                    <div
                      className="h-full bg-ink"
                      style={{
                        width: `${(app.technicalSkills.length /
                          ((app.technicalSkills?.length || 0) +
                            (app.softSkills?.length || 0) +
                            (app.certifications?.length || 0))) * 100}%`
                      }}
                    />
                  )}
                  {app.softSkills?.length > 0 && (
                    <div
                      className="h-full bg-teal"
                      style={{
                        width: `${(app.softSkills.length /
                          ((app.technicalSkills?.length || 0) +
                            (app.softSkills?.length || 0) +
                            (app.certifications?.length || 0))) * 100}%`
                      }}
                    />
                  )}
                  {app.certifications?.length > 0 && (
                    <div
                      className="h-full bg-amber"
                      style={{
                        width: `${(app.certifications.length /
                          ((app.technicalSkills?.length || 0) +
                            (app.softSkills?.length || 0) +
                            (app.certifications?.length || 0))) * 100}%`
                      }}
                    />
                  )}
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-ink" />
                    <span className="text-[10px] text-ink-400">Technical</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal" />
                    <span className="text-[10px] text-ink-400">Soft</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber" />
                    <span className="text-[10px] text-ink-400">Certifications</span>
                  </div>
                </div>
              </div>

              {/* Technical Skills Section */}
              {app.technicalSkills?.length > 0 && (
                <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden shadow-soft">
                  <div className="px-4 py-3 border-b border-ink-50 bg-ink-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center">
                        <Zap size={12} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-ink">Technical Skills</h4>
                        <p className="text-[10px] text-ink-400">
                          {app.technicalSkills.length} skill{app.technicalSkills.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {app.technicalSkills.map((skill, index) => (
                        <div
                          key={skill}
                          className="group relative"
                        >
                          <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-ink text-white text-xs font-medium rounded-xl hover:bg-ink-800 transition-all cursor-default shadow-sm hover:shadow-md">
                            <span className="w-1 h-1 bg-white/50 rounded-full" />
                            {skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Soft Skills Section */}
              {app.softSkills?.length > 0 && (
                <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden shadow-soft">
                  <div className="px-4 py-3 border-b border-ink-50 bg-teal-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-teal rounded-lg flex items-center justify-center">
                        <Users size={12} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-teal-dark">Soft Skills</h4>
                        <p className="text-[10px] text-teal-600">
                          {app.softSkills.length} skill{app.softSkills.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {app.softSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium rounded-xl hover:bg-teal-100 hover:border-teal-300 transition-all cursor-default shadow-sm"
                        >
                          <span className="w-1 h-1 bg-teal rounded-full" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Certifications Section */}
              {app.certifications?.length > 0 && (
                <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden shadow-soft">
                  <div className="px-4 py-3 border-b border-ink-50 bg-amber-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-amber rounded-lg flex items-center justify-center">
                        <Award size={12} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-amber-900">Certifications</h4>
                        <p className="text-[10px] text-amber-700">
                          {app.certifications.length} certification{app.certifications.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {app.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium rounded-xl hover:bg-amber-100 hover:border-amber-300 transition-all cursor-default shadow-sm"
                        >
                          <Award size={10} className="text-amber-500" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Languages Section (if available) */}
              {app.languages?.length > 0 && (
                <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden shadow-soft">
                  <div className="px-4 py-3 border-b border-ink-50 bg-purple-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center">
                        <MessageSquare size={12} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-purple-900">Languages</h4>
                        <p className="text-[10px] text-purple-700">
                          {app.languages.length} language{app.languages.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {app.languages.map((lang, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-3 py-2 bg-purple-50 border border-purple-100 rounded-xl"
                        >
                          <span className="text-xs font-medium text-purple-900">
                            {typeof lang === 'string' ? lang : lang.name}
                          </span>
                          {typeof lang === 'object' && lang.proficiency && (
                            <span className="text-[10px] text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                              {lang.proficiency}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Tags (if available) */}
              {app.experiences?.length > 0 && (
                <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden shadow-soft">
                  <div className="px-4 py-3 border-b border-ink-50 bg-blue-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Briefcase size={12} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-blue-900">Experience Highlights</h4>
                        <p className="text-[10px] text-blue-700">
                          {app.experiences.length} role{app.experiences.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {app.experiences.map((exp, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-50/50 border border-blue-100 rounded-xl p-3"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-xs font-semibold text-blue-900">
                              {exp.jobTitle}
                            </p>
                            <p className="text-[11px] text-blue-700">{exp.company}</p>
                          </div>
                          <span className="text-[10px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                            {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        {exp.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {exp.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 bg-white border border-blue-200 text-blue-700 text-[10px] rounded-lg"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!app.technicalSkills?.length &&
                !app.softSkills?.length &&
                !app.certifications?.length &&
                !app.languages?.length && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-ink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Zap size={24} className="text-ink-300" />
                    </div>
                    <p className="text-sm font-medium text-ink-400 mb-1">No Skills Recorded</p>
                    <p className="text-xs text-ink-300 max-w-xs mx-auto">
                      This applicant hasn't added any skills, certifications, or languages yet.
                    </p>
                  </div>
                )}

              {/* Skill Match Score (Optional Feature) */}
              {app.technicalSkills?.length > 0 && (
                <div className="bg-gradient-to-r from-ink to-ink-800 text-white p-5 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-white/90">Skill Match Potential</h4>
                    <span className="text-[10px] text-white/60">Based on profile</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[10px] text-white/70 mb-1">
                        <span>Technical Depth</span>
                        <span>{Math.min((app.technicalSkills.length / 10) * 100, 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min((app.technicalSkills.length / 10) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-white/70 mb-1">
                        <span>Profile Completeness</span>
                        <span>{[
                          app.technicalSkills?.length > 0,
                          app.softSkills?.length > 0,
                          app.certifications?.length > 0,
                          app.experiences?.length > 0,
                          app.education?.length > 0,
                        ].filter(Boolean).length * 20}%</span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal rounded-full transition-all duration-700"
                          style={{
                            width: `${[
                              app.technicalSkills?.length > 0,
                              app.softSkills?.length > 0,
                              app.certifications?.length > 0,
                              app.experiences?.length > 0,
                              app.education?.length > 0,
                            ].filter(Boolean).length * 20}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Helper sub-components
function InfoBlock({ title, children }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide font-medium text-ink-400 mb-2">
        {title}
      </p>
      <div className="border border-ink-100 divide-y divide-ink-50 rounded-2xl overflow-hidden shadow-soft">
        {children}
      </div>
    </div>
  );
}
function InfoRow({ label, value }) {
  if (!value || value === " – " || value === ", ") return null;
  return (
    <div className="flex px-3 py-2.5 gap-3">
      <span className="text-xs text-ink-400 w-28 flex-shrink-0">{label}</span>
      <span className="text-xs text-ink font-medium flex-1">{value}</span>
    </div>
  );
}
function LinkRow({ label, url }) {
  return (
    <div className="flex px-3 py-2.5 gap-3 items-center">
      <span className="text-xs text-ink-400 w-28 flex-shrink-0">{label}</span>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-teal hover:underline flex items-center gap-1 flex-1 truncate"
      >
        {url.replace(/^https?:\/\//, "").slice(0, 38)}
        <ExternalLink size={10} className="flex-shrink-0" />
      </a>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDept, setFilterDept] = useState("All");
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const fetchAll = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const [appsRes, statsRes, jobsRes] = await Promise.all([
          api.get("/applications", {
            params: {
              status: filterStatus !== "All" ? filterStatus : undefined,
              department: filterDept !== "All" ? filterDept : undefined,
              search: search || undefined,
              limit: 200,
            },
          }),
          api.get("/applications/stats/summary"),
          api.get("/jobs"),
        ]);
        setApplications(appsRes.data.applications || []);
        setStats(statsRes.data);
        setJobs(jobsRes.data || []);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filterStatus, filterDept, search],
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const stat = (key) => stats?.byStatus?.find((s) => s._id === key)?.count || 0;

  const handleStatusChange = (updated) => {
    setApplications((prev) =>
      prev.map((a) => (a._id === updated._id ? updated : a)),
    );
    setSelected(updated);
    // also refresh stats
    api
      .get("/applications/stats/summary")
      .then((r) => setStats(r.data))
      .catch(() => { });
  };

  const filteredApps = applications;

  const TABS = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "jobs", label: "Job Openings", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      {/* ── Top Bar ── */}
      <header className="bg-white/90 backdrop-blur-md border-b border-ink-100 px-6 h-14 flex items-center justify-between sticky top-0 z-20 flex-shrink-0 shadow-soft">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 min-w-8 min-h-8 flex-shrink-0 bg-ink rounded-2xl flex items-center justify-center shadow-soft">
            {" "}
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <rect
                x="2"
                y="6"
                width="14"
                height="10"
                rx="1"
                stroke="white"
                strokeWidth="1.4"
              />
              <path d="M6 6V5a3 3 0 016 0v1" stroke="white" strokeWidth="1.4" />
            </svg>
          </div>
          <span className="font-semibold text-ink text-sm hidden sm:inline">HirePortal</span>
          <span className="text-ink-200 text-sm mx-0.5">/</span>
          <span className="text-xs text-ink-400 font-medium hidden lg:inline">
            Admin Dashboard
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="border border-ink-200 text-ink-600 hover:border-ink hover:text-ink px-2 md:px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all rounded-xl bg-white shadow-soft"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden md:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowJobModal(true)}
            className="hidden md:flex bg-ink text-white px-3 py-1.5 text-xs items-center gap-1.5 hover:bg-ink-800 transition-all rounded-xl shadow-soft"
          >
            <Plus size={11} /> Post Job
          </button>
          <div className="relative pl-3 border-l border-ink-100">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-ink text-white text-xs font-medium flex items-center justify-center rounded-xl">
                <UserCog size={14} />
              </div>

              <span className="hidden md:inline text-xs text-ink-600">
                {adminUser.name}
              </span>

              <ChevronDown size={12} className="hidden md:block text-ink-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 bg-white border border-ink-100 rounded-2xl shadow-card min-w-[150px] z-50">
                <button
                  onClick={logout}
                  className="w-full px-4 py-3 text-xs flex items-center gap-2 hover:bg-red-50 text-left text-red-500"
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Nav Tabs ── */}
      <div className="bg-white border-b border-ink-100 px-6 flex-shrink-0">
        <div className="flex gap-1 py-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs rounded-xl transition-all ${activeTab === t.id
                ? "bg-ink text-white shadow-soft"
                : "text-ink-400 hover:text-ink hover:bg-ink-50"
                }`}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        {/* ═══════════════ OVERVIEW TAB ═══════════════ */}
        {activeTab === "overview" && (
          <div className="animate-fade-in space-y-6">
            {/* Stat cards — full status breakdown */}
            <div>
              <p className="text-xs text-ink-400 font-medium uppercase tracking-wide mb-3">
                Application Summary
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                <StatCard
                  label="Total"
                  value={stats?.total || 0}
                  icon={Users}
                  accent="ink"
                  live
                />
                <StatCard
                  label="New"
                  value={stat("New")}
                  icon={FileText}
                  accent="teal"
                  live
                />
                <StatCard
                  label="In Review"
                  value={stat("In Review")}
                  icon={Clock}
                  accent="amber"
                />
                <StatCard
                  label="Shortlisted"
                  value={stat("Shortlisted")}
                  icon={Star}
                  accent="purple"
                />
                <StatCard
                  label="Hired"
                  value={stat("Hired")}
                  icon={CheckCircle}
                  accent="green"
                />
                <StatCard
                  label="Rejected"
                  value={stat("Rejected")}
                  icon={XCircle}
                  accent="red"
                />
              </div>
            </div>

            {/* Status progress bars */}
            {stats?.total > 0 && (
              <div className="bg-white border border-ink-100 p-5 rounded-3xl shadow-soft">
                <p className="text-xs text-ink-400 font-medium uppercase tracking-wide mb-4">
                  Status Distribution
                </p>
                <div className="space-y-3">
                  {STATUS_OPTIONS.map((s) => {
                    const count = stat(s);
                    const pct = stats?.total
                      ? Math.round((count / stats.total) * 100)
                      : 0;
                    return (
                      <div key={s}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-ink-600">{s}</span>
                          <span className="text-xs text-ink-400">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-ink-100 w-full rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-700 rounded-full"
                            style={{
                              width: `${pct}%`,
                              background:
                                s === "New"
                                  ? "#1C1D21"
                                  : s === "In Review"
                                    ? "#f59e0b"
                                    : s === "Shortlisted"
                                      ? "#0d9488"
                                      : s === "Hired"
                                        ? "#16a34a"
                                        : "#ef4444",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Charts */}
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DepartmentChart data={stats.byDepartment || []} />
                <TimelineChart data={stats.timeline || []} />
              </div>
            )}

            {/* Recent applications preview */}
            <div className="bg-white border border-ink-100 rounded-3xl overflow-hidden shadow-soft">
              <div className="flex items-center justify-between px-5 py-3 border-b border-ink-100 bg-ink-50/50">
                <p className="text-xs font-medium text-ink">
                  Recent Applications
                </p>
                <button
                  onClick={() => setActiveTab("applications")}
                  className="text-xs text-teal hover:underline"
                >
                  View all →
                </button>
              </div>
              <div className="divide-y divide-ink-50">
                {applications.slice(0, 5).map((app) => (
                  <div
                    key={app._id}
                    onClick={() => setSelected(app)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-ink-50 cursor-pointer transition-colors"
                  >
                    <Avatar name={`${app.firstName} ${app.lastName}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ink truncate">
                        {app.firstName} {app.lastName}
                      </p>
                      <p className="text-xs text-ink-400 truncate">
                        {app.jobRole} · {app.department}
                      </p>
                    </div>
                    <StatusPill status={app.status} />
                    <p className="text-xs text-ink-300 hidden sm:block flex-shrink-0">
                      {new Date(
                        app.appliedAt || app.createdAt,
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                ))}
                {applications.length === 0 && !loading && (
                  <p className="text-xs text-ink-400 py-8 text-center">
                    No applications yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ APPLICATIONS TAB ═══════════════ */}
        {activeTab === "applications" && (
          <div className="animate-fade-in">
            {/* Quick status filter pills */}
            <div className="flex flex-wrap gap-2 mb-4 p-2 bg-white rounded-2xl border border-ink-100 shadow-soft w-fit max-w-full">
              {["All", ...STATUS_OPTIONS].map((s) => {
                const count = s === "All" ? stats?.total || 0 : stat(s);
                const active = filterStatus === s;
                return (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 text-xs rounded-xl border transition-all flex items-center gap-1.5 ${active
                      ? "bg-ink text-white border-ink shadow-soft"
                      : "border-transparent text-ink-400 hover:text-ink hover:bg-ink-50"
                      }`}
                  >
                    {s}
                    <span
                      className={`text-xs ${active ? "text-ink-200" : "text-ink-300"}`}
                    >
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search + dept filter */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300"
                />
                <input
                  className="input pl-8 w-56 text-xs py-2"
                  placeholder="Search name, email, role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="input w-44 text-xs py-2"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              {(search || filterStatus !== "All" || filterDept !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilterStatus("All");
                    setFilterDept("All");
                  }}
                  className="text-xs text-ink-400 hover:text-ink transition-colors border border-ink-200 px-3 py-2 rounded-xl bg-white shadow-soft"
                >
                  × Clear
                </button>
              )}
              <span className="text-xs text-ink-400 self-center ml-auto">
                {filteredApps.length} applicant
                {filteredApps.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Table */}
            <div className="bg-white border border-ink-100 rounded-3xl overflow-hidden shadow-soft">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs text-ink-400">
                    Loading applications...
                  </p>
                </div>
              ) : filteredApps.length === 0 ? (
                <div className="py-20 text-center">
                  <AlertCircle
                    size={28}
                    className="mx-auto mb-3 text-ink-200"
                  />
                  <p className="text-sm text-ink-400">No applications found</p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilterStatus("All");
                      setFilterDept("All");
                    }}
                    className="text-xs text-teal mt-2 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-ink-100 bg-ink-50/80">
                        <th className="text-left py-3 px-4 text-xs font-medium text-ink-400 uppercase tracking-wide">
                          Applicant
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-ink-400 uppercase tracking-wide">
                          Role
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-ink-400 uppercase tracking-wide hidden md:table-cell">
                          Department
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-ink-400 uppercase tracking-wide">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-ink-400 uppercase tracking-wide hidden lg:table-cell">
                          Applied
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-ink-400 uppercase tracking-wide">
                          Resume
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-50">
                      {filteredApps.map((app) => (
                        <tr
                          key={app._id}
                          className="hover:bg-ink-50 transition-colors group"
                        >
                          <td className="py-3 px-4">
                            <div
                              className="flex items-center gap-3 cursor-pointer"
                              onClick={() => setSelected(app)}
                            >
                              <Avatar
                                name={`${app.firstName} ${app.lastName}`}
                              />
                              <div>
                                <p className="text-xs font-medium text-ink group-hover:text-teal transition-colors">
                                  {app.firstName} {app.lastName}
                                </p>
                                <p className="text-xs text-ink-400">
                                  {app.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td
                            className="py-3 px-4 text-xs text-ink-600 cursor-pointer"
                            onClick={() => setSelected(app)}
                          >
                            {app.jobRole}
                          </td>
                          <td
                            className="py-3 px-4 text-xs text-ink-400 hidden md:table-cell cursor-pointer"
                            onClick={() => setSelected(app)}
                          >
                            {app.department}
                          </td>
                          <td className="py-3 px-4">
                            <QuickStatusSelect
                              app={app}
                              onStatusChange={handleStatusChange}
                            />
                          </td>
                          <td
                            className="py-3 px-4 text-xs text-ink-400 hidden lg:table-cell cursor-pointer"
                            onClick={() => setSelected(app)}
                          >
                            {new Date(
                              app.appliedAt || app.createdAt,
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3 px-4">
                            {app.resumePath ? (
                              <a
                                href={`/uploads/${app.resumePath}`}
                                download={app.resumeOriginalName || "resume"}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-teal hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Download size={11} /> Download
                              </a>
                            ) : (
                              <span className="text-xs text-ink-300">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════ JOBS TAB ═══════════════ */}
        {activeTab === "jobs" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-ink">
                  {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
                </p>
                <p className="text-xs text-ink-400">
                  {jobs.filter((j) => j.isActive).length} active ·{" "}
                  {jobs.filter((j) => !j.isActive).length} closed
                </p>
              </div>
              <button
                onClick={() => setShowJobModal(true)}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <Plus size={12} /> Post New Job
              </button>
            </div>
            {jobs.length === 0 ? (
              <div className="bg-white border border-ink-100 py-24 text-center rounded-3xl shadow-soft">
                <Briefcase size={32} className="mx-auto mb-3 text-ink-200" />
                <p className="text-sm text-ink-400 mb-4">No jobs posted yet</p>
                <button
                  onClick={() => setShowJobModal(true)}
                  className="btn-primary text-xs"
                >
                  Post First Job
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white border border-ink-100 p-5 flex flex-col gap-3 rounded-3xl shadow-soft hover:shadow-card hover:border-ink-200 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-medium text-ink">
                          {job.title}
                        </h3>
                        <p className="text-xs text-ink-400 mt-0.5">
                          {job.department}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 flex-shrink-0 rounded-full border ${job.isActive
                          ? "bg-teal-muted text-teal-dark border-teal/20"
                          : "bg-ink-100 text-ink-400 border-ink-100"
                          }`}
                      >
                        {job.isActive ? "Active" : "Closed"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-400">
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{job.type}</span>
                      <span>·</span>
                      <span>{job.experienceLevel}</span>
                    </div>
                    {job.salary && (
                      <p className="text-xs font-medium text-teal">
                        {job.salary}
                      </p>
                    )}
                    {job.requirements?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {job.requirements.slice(0, 3).map((r) => (
                          <span
                            key={r}
                            className="text-xs px-2.5 py-1 bg-ink-50 border border-ink-100 text-ink-600 rounded-full"
                          >
                            {r}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="text-xs text-ink-300">
                            +{job.requirements.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2 pt-1 border-t border-ink-100">
                      <button
                        onClick={() =>
                          api
                            .patch(`/jobs/${job._id}`, {
                              isActive: !job.isActive,
                            })
                            .then(() => fetchAll(true))
                        }
                        className="flex-1 border border-ink-200 text-ink-600 text-xs py-2 rounded-xl hover:border-ink hover:text-ink transition-all"
                      >
                        {job.isActive ? "Close Role" : "Reopen"}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Delete this job?"))
                            api
                              .delete(`/jobs/${job._id}`)
                              .then(() => fetchAll(true));
                        }}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors px-3 border border-transparent hover:border-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Applicant detail panel */}
      {selected && (
        <ApplicantPanel
          app={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Create job modal */}
      {showJobModal && (
        <CreateJobModal
          onClose={() => setShowJobModal(false)}
          onCreated={() => fetchAll(true)}
        />
      )}
    </div>
  );
}
