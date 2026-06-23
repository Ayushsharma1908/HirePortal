import React, { useState, useEffect } from "react";
import Navbar from "../../components/shared/Navbar";
import TickerStrip from "../../components/shared/TickerStrip";
import JobCard from "../../components/applicant/JobCard";
import { DEPARTMENTS } from "../../utils/constants";
import api from "../../utils/api";
import {
  ArrowRight,
  Briefcase,
  Users,
  CheckCircle,
  FileText,
  Send,
  UserCheck,
  Zap,
  Shield,
  Clock,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

const STEPS = [
  {
    icon: Search,
    title: "Browse roles",
    desc: "Explore open positions across departments that match your skills and interests.",
  },
  {
    icon: FileText,
    title: "Submit application",
    desc: "Complete a guided multi-step form — resume, skills, and details in minutes.",
  },
  {
    icon: UserCheck,
    title: "Get reviewed",
    desc: "Our team evaluates every application and keeps you informed through the process.",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Fast apply",
    desc: "Streamlined form, no account required.",
  },
  {
    icon: Shield,
    title: "Secure uploads",
    desc: "Your documents are stored safely.",
  },
  {
    icon: Clock,
    title: "Quick review",
    desc: "Applications reviewed within days.",
  },
];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [activeDept, setActiveDept] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/jobs")
      .then((r) => {
        console.log("API Response:", r.data);

        setJobs(
          Array.isArray(r.data)
            ? r.data
            : Array.isArray(r.data.jobs)
              ? r.data.jobs
              : [],
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const safeJobs = Array.isArray(jobs) ? jobs : [];

  const filtered =
    activeDept === "All"
      ? safeJobs
      : safeJobs.filter((j) => j.department === activeDept);

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        {/* Minimalist background design */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle grid pattern with animation */}
          <div
            className="absolute inset-0 opacity-[0.03] animate-grid-shift"
            style={{
              backgroundImage: `repeating-linear-gradient(to right, #0f172a 0px, #0f172a 1px, transparent 1px, transparent 48px), repeating-linear-gradient(to bottom, #0f172a 0px, #0f172a 1px, transparent 1px, transparent 48px)`,
            }}
          />
          {/* Animated organic blobs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-teal/5 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-teal-muted/10 blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-ink-100/5 blur-3xl animate-pulse-slow" />
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-[2rem] border border-teal/30 bg-teal/5 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

          {/* Floating dots */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-teal/30 rounded-full animate-float-slow" />
          <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-teal/20 rounded-full animate-float animation-delay-1000" />
          <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-ink-300/20 rounded-full animate-float animation-delay-2000" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="section-label mb-6 animate-fade-in mx-auto w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse-dot" />
            Actively hiring across departments
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold text-ink leading-[1.1] mb-5 animate-slide-up tracking-tight">
            Find work that
            <br />
            <span className="text-teal">matters to you.</span>
          </h1>

          <p className="text-sm md:text-base text-ink-400 max-w-xl mx-auto mb-10 animate-slide-up leading-relaxed">
            Explore open roles across Engineering, Design, Data, and more. Apply
            in minutes with our streamlined, minimal process.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up">
            <Link
              to="/apply"
              className="btn-primary flex items-center gap-2 px-7 py-3.5 w-full sm:w-auto justify-center"
            >
              Start Application <ArrowRight size={15} />
            </Link>
            <a
              href="#openings"
              className="btn-outline px-7 py-3.5 w-full sm:w-auto text-center"
            >
              View Openings
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto mt-14 animate-fade-in">
            {[
              {
                icon: Briefcase,
                val: `${jobs.length || "—"}`,
                label: "Open Roles",
              },
              { icon: Users, val: "200+", label: "Applicants" },
              { icon: CheckCircle, val: "94%", label: "Satisfaction" },
            ].map(({ icon: Icon, val, label }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-ink-100 px-3 py-4 shadow-soft hover:shadow-card transition-shadow"
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Icon size={14} className="text-teal" />
                  <span className="font-semibold text-ink text-sm">{val}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-ink-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TickerStrip />

      {/* How it works */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-label mb-3 mx-auto w-fit">Process</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">
              How it works
            </h2>
            <p className="text-sm text-ink-400 mt-2 max-w-md mx-auto">
              Three simple steps from browsing to submitting your application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="relative bg-white rounded-3xl border border-ink-100 p-6 shadow-soft hover:shadow-card transition-all group"
              >
                <div className="absolute -top-3 left-6 px-2.5 py-0.5 bg-ink-50 border border-ink-100 rounded-full text-[10px] font-medium text-ink-400">
                  Step {i + 1}
                </div>
                <div className="w-12 h-12 rounded-2xl border border-teal/20 bg-teal-muted/50 flex items-center justify-center mb-4 group-hover:border-teal/40 transition-colors">
                  <Icon size={20} className="text-teal" />
                </div>
                <h3 className="font-semibold text-sm text-ink mb-2">{title}</h3>
                <p className="text-xs text-ink-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="py-3 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[2rem] border border-ink-100 p-6 md:p-8 shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl border border-ink-100 bg-ink-50 flex items-center justify-center flex-shrink-0 shadow-soft">
                    <Icon size={18} className="text-ink" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-ink mb-0.5">
                      {title}
                    </h3>
                    <p className="text-xs text-ink-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job listings */}
      <section id="openings" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="section-label mb-3 w-fit">Careers</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">
                Open Positions
              </h2>
              <p className="text-sm text-ink-400 mt-1">
                {loading
                  ? "Loading roles…"
                  : `${filtered.length} roles available`}
              </p>
            </div>
            <Link
              to="/apply"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-teal hover:text-teal-dark transition-colors"
            >
              General application <ArrowRight size={13} />
            </Link>
          </div>

          {/* Dept filters */}
          <div className="flex flex-wrap gap-2 mb-8 p-2 bg-white rounded-2xl border border-ink-100 shadow-soft w-fit max-w-full">
            {["All", ...DEPARTMENTS].map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-4 py-2 text-xs rounded-xl border transition-all ${
                  activeDept === dept
                    ? "bg-ink text-white border-ink shadow-soft"
                    : "border-transparent text-ink-400 hover:text-ink hover:bg-ink-50 hover:border-ink-100"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse h-44">
                  <div className="w-11 h-11 bg-ink-100 rounded-2xl mb-4" />
                  <div className="h-3 bg-ink-100 rounded-lg w-3/4 mb-2" />
                  <div className="h-2.5 bg-ink-50 rounded-lg w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-ink-100 shadow-soft">
              <div className="w-14 h-14 rounded-2xl border border-ink-100 bg-ink-50 flex items-center justify-center mx-auto mb-4">
                <Briefcase size={22} className="text-ink-300" />
              </div>
              <p className="text-sm text-ink-400 mb-4">
                No openings in this department right now.
              </p>
              <button
                onClick={() => setActiveDept("All")}
                className="btn-outline text-xs"
              >
                View all roles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeJobs.length > 0 &&
                filtered.map((job) => <JobCard key={job._id} job={job} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-ink rounded-[2.5rem] border border-ink-800 px-8 py-14 text-center shadow-lift overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-[2rem] border border-teal/30 bg-teal/5 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 mb-5">
                <Send size={12} className="text-teal-light" />
                <span className="text-xs text-ink-200">Open application</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3 tracking-tight">
                Don&apos;t see the right role?
              </h2>
              <p className="text-sm text-ink-200 mb-8 max-w-md mx-auto leading-relaxed">
                Send us your application anyway — we&apos;re always looking for
                great people to join the team.
              </p>
              <Link
                to="/apply"
                className="btn-teal inline-flex items-center gap-2 px-7 py-3.5 text-sm shadow-lift"
              >
                Submit Open Application <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-100 bg-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-ink rounded-xl flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <rect
                  x="2"
                  y="6"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="white"
                  strokeWidth="1.4"
                />
                <path
                  d="M6 6V5a3 3 0 016 0v1"
                  stroke="white"
                  strokeWidth="1.4"
                />
              </svg>
            </div>
            <span className="font-semibold text-ink text-sm">HirePortal</span>
          </div>
          <p className="text-xs text-ink-400">
            © 2026 HirePortal · Built by Ayush
          </p>
        </div>
      </footer>
      <style>{`
        .reveal-on-scroll.revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 14s infinite ease-in-out;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes grid-shift {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(2px, 2px);
          }
        }

        .animate-grid-shift {
          animation: grid-shift 20s infinite linear;
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.05;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.1;
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }

        .animate-delay-100 {
          animation-delay: 100ms;
        }

        .animate-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
