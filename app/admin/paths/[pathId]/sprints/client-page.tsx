"use client";

import { useState } from "react";
import Link from "next/link";
import { createSprint, updateSprint, deleteSprint, bulkCreateSprints } from "./actions";
import { Trash2, Edit, Plus, X, ArrowLeft, GripVertical, Code, BookOpen, Sparkles, Users, Eye, ChevronDown, ChevronUp, Database } from "lucide-react";

export default function SprintsClientPage({ targetPath, initialSprints }: { targetPath: any, initialSprints: any[] }) {
    const [sprints, setSprints] = useState(initialSprints);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [storySectionExpanded, setStorySectionExpanded] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [showSeedModal, setShowSeedModal] = useState(false);
    const [seedJson, setSeedJson] = useState("");
    const [codeSectionExpanded, setCodeSectionExpanded] = useState(false);


    // Initial empty state for a new sprint
    const [formData, setFormData] = useState<any>({
        _id: "",
        title: "",
        slug: "",
        lessonContent: "",
        codeSnippet: "",
        codeLanguage: "bash",
        xpReward: 10,
        order: sprints.length + 1,
        showCodePreview: false,
        questions: [],
        storyContext: "",
        completionStory: "",
        characters: [],
        codeChallenge: {
            initialHtml: "",
            initialCss: "",
            initialJs: "",
            solutionHtml: "",
            solutionCss: "",
            solutionJs: "",
            hint: "",
            instructions: ""
        }
    });

    const handleOpenCreate = () => {
        setFormData({
            _id: "",
            title: "",
            slug: "",
            lessonContent: "",
            codeSnippet: "",
            codeLanguage: "bash",
            xpReward: 10,
            order: sprints.length + 1,
            showCodePreview: false,
            questions: [],
            storyContext: "",
            completionStory: "",
            characters: [],
            codeChallenge: {
                initialHtml: "",
                initialCss: "",
                initialJs: "",
                solutionHtml: "",
                solutionCss: "",
                solutionJs: "",
                hint: "",
                instructions: ""
            }
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (sprint: any) => {
        const hasExisting = Boolean(sprint.storyContext || sprint.completionStory || (sprint.characters?.length > 0));
        setFormData({
            ...sprint,
            questions: sprint.questions || [],
            showCodePreview: sprint.showCodePreview || false,
            codeSnippet: sprint.codeSnippet || "",
            codeLanguage: sprint.codeLanguage || "bash",
            storyContext: sprint.storyContext || "",
            completionStory: sprint.completionStory || "",
            characters: sprint.characters || [],
            codeChallenge: sprint.codeChallenge || {
                initialHtml: "",
                initialCss: "",
                initialJs: "",
                solutionHtml: "",
                solutionCss: "",
                solutionJs: "",
                hint: "",
            }
        });
        setStorySectionExpanded(!!hasExisting);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this sprint?")) return;
        setLoading(true);
        try {
            await deleteSprint(id);
            setSprints(sprints.filter(s => s._id !== id));
        } catch (error) {
            console.error("Failed to delete sprint", error);
            alert("Failed to delete sprint");
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Clean up empty questions before submitting
            const cleanedData = {
                ...formData,
                questions: formData.questions.filter((q: any) => q.question.trim() !== "")
            };

            if (formData._id) {
                await updateSprint(formData._id, cleanedData);
                setSprints(sprints.map(s => (s._id === formData._id ? cleanedData : s)));
            } else {
                const { _id, ...dataToPost } = cleanedData;
                const newId = await createSprint(targetPath._id, dataToPost);
                setSprints([...sprints, { ...cleanedData, _id: newId }]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save sprint", error);
            alert("Failed to save sprint. Check your inputs.");
        }
        setLoading(false);
    };

    const handleSeedSubmit = async () => {
        if (!seedJson.trim()) return;
        setLoading(true);
        try {
            const parsed = JSON.parse(seedJson);
            const sprintsArray = Array.isArray(parsed) ? parsed : [parsed];

            await bulkCreateSprints(targetPath._id, sprintsArray);

            // Refresh local state or just reload
            window.location.reload();
        } catch (error: any) {
            console.error("Failed to seed sprints", error);
            alert("Failed to seed. Invalid JSON structure: " + error.message);
        }
        setLoading(false);
    };

    // --- Dynamic Questions Management ---

    const addQuestion = (type: "mcq" | "fill_in_blanks" | "ordering" | "replica") => {
        const newQuestion: any = { type, question: "" };

        if (type === "mcq") {
            newQuestion.options = ["", ""];
            newQuestion.correctAnswerIndex = 0;
        } else if (type === "fill_in_blanks") {
            newQuestion.blanks = [];
            newQuestion.draggables = [];
        } else if (type === "ordering") {
            newQuestion.itemsToOrder = [""];
        } else if (type === "replica") {
            newQuestion.replicaHtml = "";
            newQuestion.replicaCss = "";
            newQuestion.initialHtml = "";
            newQuestion.hint = "";
        }

        setFormData({ ...formData, questions: [...formData.questions, newQuestion] });
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const newQuestions = [...formData.questions];
        newQuestions[index][field] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const removeQuestion = (index: number) => {
        const newQuestions = formData.questions.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, questions: newQuestions });
    };

    // --- Array field helpers for MCQ options, Draggables, etc ---
    const updateArrayField = (qIndex: number, fieldName: string, itemIndex: number, value: string) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex][fieldName][itemIndex] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const addArrayItem = (qIndex: number, fieldName: string) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex][fieldName].push("");
        setFormData({ ...formData, questions: newQuestions });
    }

    const removeArrayItem = (qIndex: number, fieldName: string, itemIndex: number) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex][fieldName] = newQuestions[qIndex][fieldName].filter((_: any, i: number) => i !== itemIndex);
        setFormData({ ...formData, questions: newQuestions });
    };

    // Characters array helpers for optional story fields
    const addCharacter = () => {
        setFormData({ ...formData, characters: [...(formData.characters || []), ""] });
    };
    const updateCharacter = (index: number, value: string) => {
        const chars = [...(formData.characters || [])];
        chars[index] = value;
        setFormData({ ...formData, characters: chars });
    };
    const removeCharacter = (index: number) => {
        setFormData({ ...formData, characters: (formData.characters || []).filter((_: string, i: number) => i !== index) });
    };

    // Code Challenge helpers
    const updateCodeChallenge = (field: string, value: any) => {
        setFormData({
            ...formData,
            codeChallenge: {
                ...formData.codeChallenge,
                [field]: value
            }
        });
    };



    const hasStoryFields = Boolean(
        (formData.storyContext || "").trim() ||
        (formData.completionStory || "").trim() ||
        ((formData.characters || []).length > 0 && (formData.characters || []).some((c: string) => c.trim()))
    );

    const hasCodeChallenge = Boolean(
        (formData.codeChallenge?.initialHtml || "").trim() ||
        (formData.codeChallenge?.initialCss || "").trim() ||
        (formData.codeChallenge?.initialJs || "").trim()
    );

    return (
        <div>
            {/* Header Area */}
            <div className="mb-4">
                <Link href="/admin/paths" className="inline-flex items-center gap-2 text-sm text-[hsl(215,15%,45%)] hover:text-[hsl(217,91%,60%)] transition-colors mb-4 font-bold">
                    <ArrowLeft size={16} /> Back to paths
                </Link>
            </div>

            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[hsl(215,25%,15%)] mb-2 inline-flex items-center gap-3">
                        <span className="text-4xl">{targetPath.icon}</span>
                        {targetPath.name} Sprints
                    </h1>
                    <p className="text-[hsl(215,15%,45%)] font-medium">Manage learning modules and questions for this path.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowSeedModal(true)}
                        className="bg-white text-[hsl(215,25%,15%)] border border-[hsl(210,20%,88%)] px-5 py-2.5 rounded-xl font-bold hover:bg-[hsl(210,25%,96%)] transition-colors inline-flex items-center gap-2 shadow-sm"
                    >
                        <Database size={18} className="text-[hsl(217,91%,60%)]" /> Seed from JSON
                    </button>
                    <button
                        onClick={handleOpenCreate}
                        className="bg-[hsl(217,91%,60%)] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[hsl(217,91%,55%)] transition-colors inline-flex items-center gap-2 shadow-[0_0_20px_hsl(217,91%,60%,0.2)]"
                    >
                        <Plus size={18} /> New Sprint
                    </button>
                </div>
            </div>

            {/* Sprints Table */}
            <div className="bg-white border border-[hsl(210,20%,88%)] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[hsl(210,25%,96%)] border-b border-[hsl(210,20%,88%)]">
                                <th className="p-4 font-bold text-[hsl(215,25%,15%)] w-16 text-center">Order</th>
                                <th className="p-4 font-bold text-[hsl(215,25%,15%)]">Sprint Title</th>
                                <th className="p-4 font-bold text-[hsl(215,25%,15%)]">Questions</th>
                                <th className="p-4 font-bold text-[hsl(215,25%,15%)]">XP Reward</th>
                                <th className="p-4 font-bold text-[hsl(215,25%,15%)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[hsl(210,20%,88%)]">
                            {sprints.map((s) => (
                                <tr key={s._id} className="hover:bg-[hsl(210,25%,98%)] transition-colors">
                                    <td className="p-4 text-center font-bold text-[hsl(215,15%,45%)]">{s.order}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-[hsl(215,25%,15%)]">{s.title}</div>
                                        <div className="text-xs text-[hsl(215,15%,45%)] font-mono truncate max-w-[200px]">{s.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block bg-[hsl(210,20%,90%)] text-[hsl(215,15%,45%)] px-3 py-1 rounded-full text-xs font-bold">
                                            {s.questions?.length || 0} items
                                        </span>
                                        {s.codeSnippet && <span title="Contains Code Snippet"><Code size={14} className="inline-block ml-2 text-[hsl(215,15%,45%)]" /></span>}
                                    </td>
                                    <td className="p-4 font-bold text-[hsl(217,91%,60%)]">
                                        +{s.xpReward} XP
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(s)}
                                                className="p-2 text-[hsl(215,15%,45%)] hover:bg-[hsl(210,20%,90%)] rounded-lg transition-colors"
                                                title="Edit Sprint"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s._id)}
                                                disabled={loading}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete Sprint"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sprints.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-[hsl(215,15%,45%)]">
                                        No sprints found in this path.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-[hsl(210,25%,98%)] border border-[hsl(210,20%,88%)] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

                        <div className="flex items-center justify-between p-6 border-b border-[hsl(210,20%,88%)] bg-white">
                            <h2 className="text-xl font-bold text-[hsl(215,25%,15%)]">
                                {formData._id ? "Edit Sprint" : "Create New Sprint"}
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${previewMode ? "bg-[hsl(217,91%,60%)] text-white" : "bg-[hsl(210,20%,94%)] text-[hsl(215,15%,45%)] hover:bg-[hsl(210,20%,90%)]"}`}
                                >
                                    <Eye size={18} /> Preview
                                </button>
                                <button onClick={() => setIsModalOpen(false)} className="text-[hsl(215,15%,45%)] hover:text-black hover:bg-[hsl(210,20%,94%)] p-2 rounded-lg transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex gap-6">
                            {previewMode && (
                                <div className="w-[340px] shrink-0 rounded-2xl border-2 border-[hsl(217,91%,60%,0.3)] bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden shadow-xl">
                                    <div className="p-4 border-b border-white/10 bg-black/20">
                                        <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Learner Preview</p>
                                        <p className="text-sm text-white/80">How this sprint appears to learners</p>
                                    </div>
                                    <div className="p-4 space-y-4 text-sm max-h-[400px] overflow-y-auto">
                                        {formData.storyContext && (
                                            <div className="rounded-xl bg-amber-500/15 border border-amber-400/30 p-3">
                                                <p className="text-xs font-bold text-amber-400 mb-1">Story</p>
                                                <p className="text-white/90 leading-relaxed">{formData.storyContext}</p>
                                                {formData.characters?.filter(Boolean).length > 0 && (
                                                    <p className="text-xs text-amber-300/80 mt-2">Characters: {formData.characters.filter(Boolean).join(", ")}</p>
                                                )}
                                            </div>
                                        )}
                                        <div className="rounded-xl bg-slate-700/50 p-3">
                                            <p className="text-xs font-bold text-violet-400 mb-1">Lesson</p>
                                            <p className="text-white/90 leading-relaxed whitespace-pre-line line-clamp-4">{formData.lessonContent || "Lesson content..."}</p>
                                        </div>
                                        {formData.codeSnippet && (
                                            <div className="space-y-2">
                                                <div className="rounded-lg bg-[#1e1e1e] p-2 font-mono text-xs overflow-x-auto">
                                                    <code>{formData.codeSnippet.slice(0, 80)}{formData.codeSnippet.length > 80 ? "..." : ""}</code>
                                                </div>
                                                {formData.showCodePreview && (
                                                    <div className="space-y-2 mt-3">
                                                        <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 w-fit">
                                                            <Eye size={10} /> Live HTML Preview
                                                        </div>
                                                        <div className="rounded-xl border border-white/10 bg-white overflow-hidden h-[150px]">
                                                            <iframe
                                                                srcDoc={`<!DOCTYPE html><html><body style="margin:0;padding:10px;font-family:sans-serif;">${formData.codeSnippet}</body></html>`}
                                                                className="w-full h-full border-none"
                                                                title="Admin Preview"
                                                                key={formData.codeSnippet}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-amber-400">
                                            <Sparkles size={14} /> +{formData.xpReward || 0} XP
                                        </div>
                                        {formData.completionStory && (
                                            <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/30 p-3">
                                                <p className="text-xs font-bold text-emerald-400 mb-1">Completion</p>
                                                <p className="text-white/90 leading-relaxed text-xs">{formData.completionStory}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <form id="sprint-form" onSubmit={handleSubmit} className={`space-y-8 ${previewMode ? "flex-1 min-w-0" : "flex-1"}`}>

                                {/* Core Info Section */}
                                <div className="bg-white p-6 rounded-2xl border border-[hsl(210,20%,88%)] shadow-sm space-y-4">
                                    <h3 className="font-bold text-[hsl(215,25%,15%)] text-lg mb-4 flex items-center gap-2">Core Details</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-[hsl(215,15%,45%)] mb-1">Title</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[hsl(210,25%,98%)] focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] font-medium"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[hsl(215,15%,45%)] mb-1">Slug (URL)</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[hsl(210,25%,98%)] focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] font-mono text-sm"
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-[hsl(215,15%,45%)] mb-1">XP Reward</label>
                                            <input
                                                type="number"
                                                min="0"
                                                required
                                                className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[hsl(210,25%,98%)] focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] font-medium"
                                                value={formData.xpReward}
                                                onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[hsl(215,15%,45%)] mb-1">Order</label>
                                            <input
                                                type="number"
                                                min="1"
                                                required
                                                className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[hsl(210,25%,98%)] focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] font-medium"
                                                value={formData.order}
                                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-[hsl(215,15%,45%)] mb-1">Lesson Content (Markdown)</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[hsl(210,25%,98%)] focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] resize-none font-medium"
                                            value={formData.lessonContent}
                                            onChange={(e) => setFormData({ ...formData, lessonContent: e.target.value })}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <label className="block text-sm font-bold text-[hsl(215,15%,45%)] mb-1 flex items-center gap-2">
                                            <Code size={16} /> Optional Code Snippet (Terminal UI)
                                        </label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                placeholder="Language (e.g. bash, javascript)"
                                                className="w-1/3 border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[hsl(210,25%,98%)] focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] font-mono text-xs"
                                                value={formData.codeLanguage || ""}
                                                onChange={(e) => setFormData({ ...formData, codeLanguage: e.target.value })}
                                            />
                                        </div>
                                        <textarea
                                            rows={4}
                                            placeholder="Code content here..."
                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] font-mono text-sm resize-none"
                                            value={formData.codeSnippet || ""}
                                            onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                                        />

                                        <div className="flex items-center gap-3 mt-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, showCodePreview: !formData.showCodePreview })}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all border-2 ${formData.showCodePreview
                                                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                                    }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 transition-all ${formData.showCodePreview ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300"
                                                    }`}></div>
                                                Show Live HTML/CSS Preview
                                            </button>
                                            <p className="text-xs text-slate-400">If enabled, the code snippet will render as live HTML beside the code.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Optional Story Fields */}
                                <div className="bg-gradient-to-br from-amber-50/80 to-violet-50/60 p-6 rounded-2xl border-2 border-amber-200/60 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setStorySectionExpanded(!storySectionExpanded)}
                                        className="w-full flex items-center justify-between text-left"
                                    >
                                        <h3 className="font-bold text-[hsl(215,25%,15%)] text-lg flex items-center gap-2">
                                            <Sparkles size={20} className="text-amber-500" /> Optional Story Fields
                                            {hasStoryFields && (
                                                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-800">Active</span>
                                            )}
                                        </h3>
                                        {storySectionExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    <p className="text-sm text-[hsl(215,15%,45%)] mt-1">Enrich sprints with narrative context. Optional — sprints work without these.</p>
                                    {storySectionExpanded && (
                                        <div className="mt-6 space-y-5">
                                            <div>
                                                <label className="block text-sm font-bold text-[hsl(215,15%,45%)] mb-1">Story Context (Intro)</label>
                                                <textarea
                                                    rows={3}
                                                    className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[hsl(210,25%,98%)] focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm resize-none"
                                                    placeholder="Set the scene..."
                                                    value={formData.storyContext}
                                                    onChange={(e) => setFormData({ ...formData, storyContext: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[hsl(215,15%,45%)] mb-1">Completion Story (Outro)</label>
                                                <textarea
                                                    rows={3}
                                                    className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[hsl(210,25%,98%)] focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm resize-none"
                                                    placeholder="The reward message..."
                                                    value={formData.completionStory}
                                                    onChange={(e) => setFormData({ ...formData, completionStory: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[hsl(215,15%,45%)] mb-1">Characters (Comma Separated)</label>
                                                <input
                                                    type="text"
                                                    className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[hsl(210,25%,98%)] focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                                                    placeholder="Dev, Codey..."
                                                    value={formData.characters?.join(", ")}
                                                    onChange={(e) => setFormData({ ...formData, characters: e.target.value.split(",").map(c => c.trim()).filter(Boolean) })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Code Challenge Section */}
                                <div className="bg-white p-6 rounded-2xl border border-[hsl(210,20%,88%)] shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setCodeSectionExpanded(!codeSectionExpanded)}
                                        className="w-full flex items-center justify-between text-left"
                                    >
                                        <h3 className="font-bold text-[hsl(215,25%,15%)] text-lg flex items-center gap-2">
                                            <Code size={20} className="text-[hsl(217,91%,60%)]" /> Code Challenge (Optional)
                                            {hasCodeChallenge && (
                                                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Active</span>
                                            )}
                                        </h3>
                                        {codeSectionExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    <p className="text-sm text-[hsl(215,15%,45%)] mt-1">Tasks that require users to write code. Optional — users can skip to the quiz if empty.</p>

                                    {codeSectionExpanded && (
                                        <div className="mt-6 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <h4 className="font-bold text-sm text-[hsl(215,15%,45%)]">Initial Code (User Starts With)</h4>
                                                    <div>
                                                        <label className="block text-xs font-bold text-[hsl(215,15%,45%)] mb-1">HTML</label>
                                                        <textarea
                                                            rows={3}
                                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none font-mono text-xs resize-none"
                                                            value={formData.codeChallenge?.initialHtml}
                                                            onChange={(e) => updateCodeChallenge("initialHtml", e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-[hsl(215,15%,45%)] mb-1">CSS</label>
                                                        <textarea
                                                            rows={3}
                                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none font-mono text-xs resize-none"
                                                            value={formData.codeChallenge?.initialCss}
                                                            onChange={(e) => updateCodeChallenge("initialCss", e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-[hsl(215,15%,45%)] mb-1">JS</label>
                                                        <textarea
                                                            rows={3}
                                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none font-mono text-xs resize-none"
                                                            value={formData.codeChallenge?.initialJs}
                                                            onChange={(e) => updateCodeChallenge("initialJs", e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <h4 className="font-bold text-sm text-[hsl(215,15%,45%)]">Solution Code (Show Answer)</h4>
                                                    <div>
                                                        <label className="block text-xs font-bold text-[hsl(215,15%,45%)] mb-1">HTML</label>
                                                        <textarea
                                                            rows={3}
                                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none font-mono text-xs resize-none"
                                                            value={formData.codeChallenge?.solutionHtml}
                                                            onChange={(e) => updateCodeChallenge("solutionHtml", e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-[hsl(215,15%,45%)] mb-1">CSS</label>
                                                        <textarea
                                                            rows={3}
                                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none font-mono text-xs resize-none"
                                                            value={formData.codeChallenge?.solutionCss}
                                                            onChange={(e) => updateCodeChallenge("solutionCss", e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-[hsl(215,15%,45%)] mb-1">JS</label>
                                                        <textarea
                                                            rows={3}
                                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none font-mono text-xs resize-none"
                                                            value={formData.codeChallenge?.solutionJs}
                                                            onChange={(e) => updateCodeChallenge("solutionJs", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-[hsl(215,15%,45%)] mb-1">Instructions (Markdown)</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Step-by-step instructions for the user..."
                                                    className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[hsl(210,25%,98%)] focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] text-sm resize-none"
                                                    value={formData.codeChallenge?.instructions || ""}
                                                    onChange={(e) => updateCodeChallenge("instructions", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[hsl(215,15%,45%)] mb-1">Hint</label>
                                                <textarea
                                                    rows={2}
                                                    className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[hsl(210,25%,98%)] focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] text-sm resize-none"
                                                    value={formData.codeChallenge?.hint}
                                                    onChange={(e) => updateCodeChallenge("hint", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Questions Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-[hsl(215,25%,15%)] text-xl">Questions</h3>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => addQuestion("mcq")} className="text-xs bg-white border border-[hsl(210,20%,88%)] px-3 py-1.5 rounded-lg hover:bg-[hsl(210,20%,94%)] font-bold transition-colors">
                                                + MCQ
                                            </button>
                                            <button type="button" onClick={() => addQuestion("fill_in_blanks")} className="text-xs bg-white border border-[hsl(210,20%,88%)] px-3 py-1.5 rounded-lg hover:bg-[hsl(210,20%,94%)] font-bold transition-colors">
                                                + Blanks
                                            </button>
                                            <button type="button" onClick={() => addQuestion("ordering")} className="text-xs bg-white border border-[hsl(210,20%,88%)] px-3 py-1.5 rounded-lg hover:bg-[hsl(210,20%,94%)] font-bold transition-colors">
                                                + Ordering
                                            </button>
                                            <button type="button" onClick={() => addQuestion("replica")} className="text-xs bg-white border border-[hsl(210,20%,88%)] px-3 py-1.5 rounded-lg hover:bg-[hsl(210,20%,94%)] font-bold transition-colors">
                                                + Replica
                                            </button>
                                        </div>
                                    </div>

                                    {formData.questions.map((q: any, qIndex: number) => (
                                        <div key={qIndex} className="bg-white p-5 rounded-2xl border-2 border-[hsl(210,20%,88%)] shadow-sm relative">

                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(qIndex)}
                                                className="absolute top-4 right-4 text-[hsl(215,15%,45%)] hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                                            >
                                                <X size={16} />
                                            </button>

                                            <div className="mb-4 pr-8">
                                                <span className="inline-block px-2.5 py-1 bg-[hsl(210,25%,96%)] text-[hsl(215,25%,15%)] rounded-md text-xs font-bold uppercase tracking-wider mb-2 border border-[hsl(210,20%,88%)]">
                                                    {q.type.replace(/_/g, " ")}
                                                </span>
                                                <label className="block text-sm font-bold text-[hsl(215,15%,45%)] mb-1">Question Prompt</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Enter question text..."
                                                    className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[hsl(210,25%,98%)] focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] font-medium"
                                                    value={q.question}
                                                    onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                                                />
                                            </div>

                                            {/* MCQ Specific Fields */}
                                            {q.type === "mcq" && (
                                                <div className="space-y-3 bg-[hsl(210,25%,98%)] p-4 rounded-xl border border-[hsl(210,20%,92%)]">
                                                    <label className="block text-sm font-bold text-[hsl(215,15%,45%)]">Options</label>
                                                    {q.options?.map((opt: string, optIndex: number) => (
                                                        <div key={optIndex} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <input
                                                                    type="radio"
                                                                    name={`correct-answer-${qIndex}`}
                                                                    checked={q.correctAnswerIndex === optIndex}
                                                                    onChange={() => updateQuestion(qIndex, "correctAnswerIndex", optIndex)}
                                                                    className="w-4 h-4 text-[hsl(217,91%,60%)]"
                                                                />
                                                                <span className="text-xs text-[hsl(215,15%,45%)] font-bold">Answer {optIndex + 1}</span>
                                                            </div>
                                                            <div className="flex-1 flex w-full">
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    className="w-full border border-[hsl(210,20%,88%)] rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] text-sm"
                                                                    value={opt}
                                                                    onChange={(e) => updateArrayField(qIndex, "options", optIndex, e.target.value)}
                                                                />
                                                                <button type="button" onClick={() => removeArrayItem(qIndex, "options", optIndex)} className="px-3 border border-l-0 border-[hsl(210,20%,88%)] rounded-r-lg bg-white text-red-500 hover:bg-red-50">
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => addArrayItem(qIndex, "options")} className="text-sm text-[hsl(217,91%,60%)] font-bold hover:underline">
                                                        + Add Option
                                                    </button>
                                                </div>
                                            )}

                                            {/* Fill in Blanks Specific Fields */}
                                            {q.type === "fill_in_blanks" && (
                                                <div className="space-y-4 bg-[hsl(210,25%,98%)] p-4 rounded-xl border border-[hsl(210,20%,92%)]">
                                                    <p className="text-xs text-[hsl(215,15%,45%)] bg-[hsl(210,20%,94%)] p-2 rounded max-w-lg mb-2">
                                                        Note: Use <strong className="text-[hsl(215,25%,15%)]">{"{{blank}}"}</strong> in the Question Prompt above to indicate drop zones.
                                                    </p>

                                                    {/* Blanks array (Correct answers in order) */}
                                                    <div>
                                                        <label className="block text-sm font-bold text-[hsl(215,25%,15%)] mb-1">Correct Answers (in order of blanks)</label>
                                                        <div className="space-y-2">
                                                            {q.blanks?.map((blank: string, bIndex: number) => (
                                                                <div key={bIndex} className="flex w-full sm:w-2/3">
                                                                    <span className="bg-green-100 text-green-700 font-bold px-3 py-2 rounded-l-lg border border-r-0 border-green-200 text-sm">#{bIndex + 1}</span>
                                                                    <input type="text" value={blank} onChange={(e) => updateArrayField(qIndex, "blanks", bIndex, e.target.value)} required className="flex-1 border border-[hsl(210,20%,88%)] p-2 focus:outline-none text-sm" />
                                                                    <button type="button" onClick={() => removeArrayItem(qIndex, "blanks", bIndex)} className="px-3 border border-l-0 border-[hsl(210,20%,88%)] rounded-r-lg bg-white text-red-500 hover:bg-red-50">
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button type="button" onClick={() => addArrayItem(qIndex, "blanks")} className="text-sm text-green-600 mt-2 font-bold hover:underline">+ Add Correct Answer Link</button>
                                                    </div>

                                                    {/* Draggables pool (Correct answers + distractors) */}
                                                    <div>
                                                        <label className="block text-sm font-bold text-[hsl(215,25%,15%)] mb-1">Word Pool (Draggable buttons)</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {q.draggables?.map((drag: string, dIndex: number) => (
                                                                <div key={dIndex} className="flex relative">
                                                                    <input type="text" value={drag} onChange={(e) => updateArrayField(qIndex, "draggables", dIndex, e.target.value)} required placeholder="word" className="border border-[hsl(210,20%,88%)] rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:border-[hsl(217,91%,60%)] w-28 text-sm font-mono" />
                                                                    <button type="button" onClick={() => removeArrayItem(qIndex, "draggables", dIndex)} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 p-0.5 hover:bg-red-50 rounded">
                                                                        <X size={12} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button type="button" onClick={() => addArrayItem(qIndex, "draggables")} className="text-sm text-[hsl(217,91%,60%)] mt-2 font-bold hover:underline">+ Add Word to Pool</button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Ordering Specific Fields */}
                                            {q.type === "ordering" && (
                                                <div className="space-y-3 bg-[hsl(210,25%,98%)] p-4 rounded-xl border border-[hsl(210,20%,92%)]">
                                                    <label className="block text-sm font-bold text-[hsl(215,15%,45%)]">Items to Order (Add them in the CORRECT order)</label>
                                                    {q.itemsToOrder?.map((item: string, iIndex: number) => (
                                                        <div key={iIndex} className="flex items-center gap-2">
                                                            <div className="bg-white border border-[hsl(210,20%,88%)] p-2 rounded-lg text-[hsl(215,15%,45%)] shadow-sm">
                                                                <GripVertical size={16} />
                                                            </div>
                                                            <span className="font-mono text-xs text-[hsl(215,15%,45%)] font-bold">{iIndex + 1}.</span>
                                                            <div className="flex-1 flex">
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    className="w-full border border-[hsl(210,20%,88%)] rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] text-sm font-mono"
                                                                    value={item}
                                                                    onChange={(e) => updateArrayField(qIndex, "itemsToOrder", iIndex, e.target.value)}
                                                                />
                                                                <button type="button" onClick={() => removeArrayItem(qIndex, "itemsToOrder", iIndex)} className="px-3 border border-l-0 border-[hsl(210,20%,88%)] rounded-r-lg bg-white text-red-500 hover:bg-red-50">
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => addArrayItem(qIndex, "itemsToOrder")} className="text-sm text-[hsl(217,91%,60%)] font-bold hover:underline">
                                                        + Add Item
                                                    </button>
                                                </div>
                                            )}

                                            {/* Replica Specific Fields */}
                                            {q.type === "replica" && (
                                                <div className="space-y-4 bg-[hsl(210,25%,98%)] p-4 rounded-xl border border-[hsl(210,20%,92%)]">
                                                    <p className="text-xs text-[hsl(215,15%,45%)] bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100 mb-2">
                                                        <strong>Replica Challenge:</strong> Users will see the "Replica" layout and must recreate it in their editor.
                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="block text-xs font-bold text-[hsl(215,15%,45%)] uppercase tracking-wider">Target Replica HTML</label>
                                                            <textarea
                                                                rows={4}
                                                                placeholder="Static HTML for the target design..."
                                                                className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none font-mono text-xs resize-none"
                                                                value={q.replicaHtml || ""}
                                                                onChange={(e) => updateQuestion(qIndex, "replicaHtml", e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="block text-xs font-bold text-[hsl(215,15%,45%)] uppercase tracking-wider">Target Replica CSS</label>
                                                            <textarea
                                                                rows={4}
                                                                placeholder="CSS for the target design..."
                                                                className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none font-mono text-xs resize-none"
                                                                value={q.replicaCss || ""}
                                                                onChange={(e) => updateQuestion(qIndex, "replicaCss", e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-xs font-bold text-[hsl(215,15%,45%)] uppercase tracking-wider">Initial HTML (User Starts With)</label>
                                                        <textarea
                                                            rows={3}
                                                            placeholder="Starter code for the user..."
                                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none font-mono text-xs resize-none"
                                                            value={q.initialHtml || ""}
                                                            onChange={(e) => updateQuestion(qIndex, "initialHtml", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-xs font-bold text-[hsl(215,15%,45%)] uppercase tracking-wider">Hint</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Helpful hint for the user..."
                                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] text-sm"
                                                            value={q.hint || ""}
                                                            onChange={(e) => updateQuestion(qIndex, "hint", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {formData.questions.length === 0 && (
                                        <div className="text-center p-8 border-2 border-dashed border-[hsl(210,20%,88%)] rounded-2xl text-[hsl(215,15%,45%)]">
                                            No questions added yet. Sprints should have at least one question.
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-[hsl(210,20%,88%)] bg-[hsl(210,25%,98%)] flex justify-end gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 rounded-xl text-[hsl(215,25%,15%)] font-bold hover:bg-[hsl(210,20%,94%)] transition-colors border border-[hsl(210,20%,88%)]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="sprint-form"
                                disabled={loading}
                                className="bg-[hsl(217,91%,60%)] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[hsl(217,91%,55%)] transition-all disabled:opacity-50 shadow-[0_0_20px_hsl(217,91%,60%,0.2)]"
                            >
                                {loading ? "Saving..." : "Save Sprint"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
            {/* Seed from JSON Modal */}
            {showSeedModal && (
                <div className="fixed inset-0 bg-[hsl(215,25%,15%,0.6)] backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_32px_80px_rgba(0,0,0,0.3)] border border-[hsl(210,20%,88%)] overflow-hidden">
                        <div className="p-8 border-b border-[hsl(210,20%,88%)] flex items-center justify-between bg-[hsl(210,25%,98%)] shrink-0">
                            <div>
                                <h2 className="text-2xl font-black text-[hsl(215,25%,15%)] flex items-center gap-3">
                                    <Database className="text-[hsl(217,91%,60%)]" /> Seed Sprints from JSON
                                </h2>
                                <p className="text-[hsl(215,15%,45%)] font-medium mt-1">Paste a JSON array of sprint objects to bulk-import.</p>
                            </div>
                            <button
                                onClick={() => setShowSeedModal(false)}
                                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all text-[hsl(215,15%,45%)]"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 bg-white">
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-[hsl(215,25%,15%)] mb-2">JSON Content</label>
                                <textarea
                                    value={seedJson}
                                    onChange={(e) => setSeedJson(e.target.value)}
                                    placeholder='[{ "title": "...", "slug": "...", ... }]'
                                    className="w-full h-[400px] bg-[hsl(210,25%,98%)] border-2 border-[hsl(210,20%,88%)] rounded-2xl p-6 font-mono text-sm focus:border-[hsl(217,91%,60%)] focus:ring-4 focus:ring-[hsl(217,91%,60%,0.1)] outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="mb-6">
                                <div className="bg-amber-50/70 border border-amber-200 rounded-[24px] p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                                                <Sparkles size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-amber-900 text-lg leading-tight">AI Generation Prompt</h3>
                                                <p className="text-amber-800/70 text-sm font-medium">Use this prompt to generate correct sprint JSON</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const prompt = `Act as a curriculum designer for a tech learning platform. Your task is to generate a JSON array of "Sprint" objects for a learning path.

MODEL STRUCTURE:
- title: concise title
- slug: url-safe-slug
- lessonContent: Detailed markdown lesson. 
  FORMATTING: Use **bold** for emphasis, \`inline code\` for variable names. Use [link](url) for resources. Keep it conversational.
- xpReward: 10 to 100
- order: sequence number
- storyContext (opt): Narrative intro (no markdown)
- completionStory (opt): Narrative outro (no markdown)
- characters (opt): Array of strings (character names)
- showCodePreview (opt): boolean (if true, shows live HTML preview of codeSnippet)
- codeSnippet (opt): code string for the terminal/preview
- codeLanguage (opt): string (e.g., "html", "javascript", "bash")
- questions (at least 1):
  * MCQ: { type: "mcq", question: "...", options: ["..."], correctAnswerIndex: 0 }
  * Blanks: { type: "fill_in_blanks", question: "text {{blank}}", blanks: ["correct"], draggables: ["correct", "distractor"] }
  * Ordering: { type: "ordering", question: "...", itemsToOrder: ["step1", "step2"] }
  * Replica: { type: "replica", question: "Rebuild this layout", replicaHtml: "...", replicaCss: "...", initialHtml: "...", hint: "..." }
- codeChallenge (opt): { 
    initialHtml, initialCss, initialJs, 
    solutionHtml, solutionCss, solutionJs, 
    hint, instructions (Markdown content) 
  }

Format as a valid JSON array. Generate 5 sprints for "[PATH_NAME]". Existing IDs will be preserved if provided, otherwise new ones will be generated.`;
                                                navigator.clipboard.writeText(prompt.replace("[PATH_NAME]", targetPath.name));
                                                // Using a simple state-based feedback instead of alert would be better but let's stick to simplicity for now or use a toast if available.
                                                // I'll add a temporary "Copied!" text if I can, but let's just use alert for now to be safe.
                                                alert("Prompt copied! Replace [PATH_NAME] with your actual path name in the AI chat.");
                                            }}
                                            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 text-sm"
                                        >
                                            <Database size={16} /> Copy Full Prompt
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white/60 p-4 rounded-2xl border border-amber-200/50">
                                            <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-3">Interactivity</h4>
                                            <ul className="space-y-2 text-xs text-amber-900/80 font-medium">
                                                <li className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                    MCQ (Multiple Choice)
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                    Fill-in-the-blanks ({"{{blank}}"})
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                    Step Ordering
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="bg-white/60 p-4 rounded-2xl border border-amber-200/50">
                                            <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-3">Extra Features</h4>
                                            <ul className="space-y-2 text-xs text-amber-900/80 font-medium">
                                                <li className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                    Narrative Story Context
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                    Interactive Code Challenges
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                    Custom XP & Sequence
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-[hsl(210,20%,88%)] bg-[hsl(210,25%,98%)] flex justify-end gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowSeedModal(false)}
                                className="px-6 py-2.5 rounded-xl text-[hsl(215,25%,15%)] font-bold hover:bg-[hsl(210,20%,94%)] transition-colors border border-[hsl(210,20%,88%)]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSeedSubmit}
                                disabled={loading || !seedJson.trim()}
                                className="bg-[hsl(217,91%,60%)] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[hsl(217,91%,55%)] transition-all disabled:opacity-50 shadow-[0_0_20px_hsl(217,91%,60%,0.2)]"
                            >
                                {loading ? "Seeding..." : "Import Sprints"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
