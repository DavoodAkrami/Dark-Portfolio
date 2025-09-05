"use client"
import { useState, useEffect } from "react";
import Modal from "../../../../components/Modal";
import AiDataCard from "../../../../components/AiDataCard";


const aidata = () => {
    const cats = ["resume", "skill", "project", "experience", "bio", "contact", "technologies"];
    const tags = [
        "technologies", "resume", "personalInfo", "bio", "frontend", "backend", 
        "fullstack", "react", "nextjs", "javascript", "typescript", "nodejs", 
        "python", "html", "css", "tailwind", "bootstrap", "git", "github", 
        "portfolio", "projects", "experience", "education", "certifications", 
        "skills", "contact", "about", "services", "testimonials", "achievements", 
        "awards", "publications", "blog", "articles", "tutorials", "code", 
        "development", "programming", "software", "web", "mobile", "api", 
        "database", "sql", "mongodb", "firebase", "aws", "deployment", 
        "ui", "ux", "design", "responsive", "performance", "optimization", 
        "testing", "debugging", "collaboration", "teamwork", "leadership", 
        "problem-solving", "creativity", "innovation", "learning", "growth"
    ]

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    }


    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isModalopen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'delete'
    const [selectedItem, setSelectedItem] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [metadata, setMetadata] = useState({
        title: "",
        text: "",
        cat: "",
        createdAt: new Date().toISOString(),
        tags: [],
    })
    const [upsertForm, setUpsertForm] = useState({
        id: generateId(),
        text: "",
        metadata: metadata
    })
    const [selectedTags, setSelectedTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null); 
    const [upsertLoading, setUpsertLoading] = useState(false);

    const [items, setItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [itemsError, setItemsError] = useState(null);

    const handleUpsert = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!upsertForm.text || !metadata.title || !metadata.cat) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            setUpsertLoading(true);
            const res = await fetch('/api/upsert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: upsertForm.id,
                    text: upsertForm.text,
                    metadata: {
                        ...metadata,
                        text: upsertForm.text,
                        tags: selectedTags,
                        source: 'admin-panel',
                        timestamp: new Date().toISOString()
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                setSuccess("Data upserted successfully!");
                setUpsertForm({
                    id: generateId(),
                    text: "",
                    metadata: { title: "", cat: "", createdAt: new Date().toISOString(), tags: [] }
                });
                setMetadata({ title: "", cat: "", createdAt: new Date().toISOString(), tags: [] });
                setSelectedTags([]);
                fetchItems();
                setIsModalOpen(false);
            } else {
                const errorData = await res.json();
                setError(errorData.error || "Upsert failed");
            }
        } catch (error) {
            setError("Error upserting data: " + error.message);
        } finally {
            setUpsertLoading(false);
        }
    }

    const addTag = (tag) => {
        if (tag && !selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
    }

    const removeTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    }

    const addCustomTag = () => {
        if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
            setSelectedTags([...selectedTags, newTag.trim()]);
            setNewTag("");
        }
    }

    const fetchItems = async () => {
        try {
            setItemsLoading(true);
            const res = await fetch('/api/list', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topK: 100 }) });
            if (!res.ok) {
                let errText = '';
                try {
                    const errJson = await res.json();
                    errText = errJson?.error || `${res.status} ${res.statusText}`;
                } catch (_) {
                    errText = `${res.status} ${res.statusText}`;
                }
                setItems([]);
                setItemsLoading(false);
                setItemsError(errText)
                return;
            }
            const data = await res.json();
            const normalized = (data.results || []).map((m) => ({
                id: m.id,
                title: m.metadata?.title || m.id,
                cat: m.metadata?.cat || 'unknown',
                metadata: m.metadata || {}
            }));
            setItems(normalized);
        } catch (e) {
            setItems([]);
            console.error(e)
        } finally {
            setItemsLoading(false);
        }
    }

    const handleDelete = async (id) => {
        try {
            const res = await fetch('/api/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error('Delete failed:', err.error || res.statusText);
                return;
            }
            await fetchItems();
        } catch (err) {
            console.error('Delete error:', err);
        }
    }

    const handleEdit = async (item) => {
        try {
            const res = await fetch('/api/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: item.id, metadata: item.metadata })
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error('Edit failed:', err.error || res.statusText);
                return;
            }
            await fetchItems();
        } catch (err) {
            console.error('Edit error:', err);
        }
    }

    useEffect(() => {
        fetchItems();
        setIsAuthenticated(localStorage.getItem(process.env.NEXT_PUBLIC_ADMIN_LOCAL_STORAGE_VALUE) === "true" )? true : false
    }, []);


   

    if (!isAuthenticated) return (
        <div
            className="bg-[var(--primary-color)] h-screen flex items-center justify-center text-[red] text-[3rem] font-extrabold ma-md:trext-[1.6rem]"
        >
            Access denied
        </div>
    )

    return (
        <div 
            className="min-h-screen bg-[var(--primary-color)] text-[var(--text-color)]"
        >
            <div
                className="flex justify-end items-center p-12"
            >
                <button
                    className="px-4 py-2 hover:cursor-pointer bg-[var(--accent-color)] text-[var(--text-color)] rounded-md hover:opacity-80 transition-opacity"
                    onClick={() => {
                        setModalMode('create');
                        setSelectedItem(null);
                        setDeleteConfirmText("");
                        setUpsertForm({ id: generateId(), text: "", metadata: { title: "", cat: "", createdAt: new Date().toISOString(), tags: [] } });
                        setMetadata({ title: "", cat: "", createdAt: new Date().toISOString(), tags: [] });
                        setSelectedTags([]);
                        setIsModalOpen(true);
                    }}
                >
                    Add new data
                </button>
            </div>
            <div>
                {itemsError && (
                    <div className="text-red-500 px-12 py-4">{itemsError}</div>
                )}
                {itemsLoading ? (
                    <div className="w-full flex justify-center items-center py-10">
                        <div className="h-8 w-8 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    items.length === 0 ? (
                        <div className="px-12 py-6 opacity-70">No items found</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-12 mx-auto max-w-[80%]">
                            {items.map((item) => (
                                <AiDataCard 
                                    key={item.id}
                                    title={item.title}
                                    cat={item.cat}
                                    onDelete={() => {
                                        setSelectedItem(item);
                                        setDeleteConfirmText("");
                                        setModalMode('delete');
                                        setIsModalOpen(true);
                                    }}
                                    onEdit={() => {
                                        setSelectedItem(item);
                                        setModalMode('edit');
                                        setUpsertForm({ id: item.id, text: item?.metadata?.text || "", metadata: item.metadata || {} });
                                        setMetadata({
                                            title: item?.metadata?.title || item.title || "",
                                            cat: item?.metadata?.cat || item.cat || "",
                                            createdAt: item?.metadata?.createdAt || new Date().toISOString(),
                                            tags: item?.metadata?.tags || []
                                        });
                                        setSelectedTags(item?.metadata?.tags || []);
                                        setIsModalOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>
            <Modal
                onClose={() => setIsModalOpen(false)}
                isModalOpen={isModalopen}
                className="p-12 max-md:p-8"
            >
                {modalMode !== 'delete' && (
                    <>
                        <h2
                            className="text-[1.8rem] text-[var(--accent-color)] font-[550] max-md:text-[1.4rem] mb-6"
                        >
                            {modalMode === 'edit' ? 'Edit data' : 'Add new data'}
                        </h2>
                        <form
                            onSubmit={modalMode === 'edit' ? async (e) => {
                                e.preventDefault();
                                setError(null);
                                setSuccess(null);
                                if (!metadata.title || !metadata.cat) {
                                    setError("Please fill in all required fields");
                                    return;
                                }
                                try {
                                    setUpsertLoading(true);
                                    const res = await fetch('/api/edit', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            id: upsertForm.id,
                                            text: upsertForm.text,
                                            metadata: {
                                                ...metadata,
                                                text: upsertForm.text,
                                                tags: selectedTags,
                                                source: 'admin-panel',
                                                timestamp: new Date().toISOString()
                                            }
                                        })
                                    });
                                    if (res.ok) {
                                        setSuccess('Data updated successfully!');
                                        setIsModalOpen(false);
                                        await fetchItems();
                                    } else {
                                        const errorData = await res.json().catch(() => ({}));
                                        setError(errorData.error || 'Edit failed');
                                    }
                                } catch (error) {
                                    setError('Error editing data: ' + error.message);
                                } finally {
                                    setUpsertLoading(false);
                                }
                            } : handleUpsert}
                            className="flex flex-col gap-[1.4rem]"
                        >
                            <input 
                                type="text"
                                value={metadata.title}
                                onChange={(e) => setMetadata({...metadata, title: e.target.value})} 
                                name="title"
                                placeholder="Title *"
                                className="w-[90%] mx-auto px-[0.6rem] py-[0.6rem] rounded-[12px] bg-[var(--primary-color)] autofill:bg-[var(--primary-color)] focusrLight border border-transparent outline-none focus:border-1 focus:border-[var(--accent-color)]"
                                required
                            />

                            <select
                                value={metadata.cat}
                                onChange={(e) => setMetadata({...metadata, cat: e.target.value})}
                                className="w-[90%] mx-auto px-[0.6rem] py-[0.6rem] rounded-[12px] bg-[var(--primary-color)] border border-transparent outline-none focus:border-1 focus:border-[var(--accent-color)]"
                                required
                            >
                                <option value="">Select Category *</option>
                                {cats.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>

                            <textarea 
                                value={upsertForm.text}
                                onChange={(e) => setUpsertForm({...upsertForm, text: e.target.value})} 
                                name="text"
                                placeholder={modalMode === 'edit' ? 'Content (leave empty to keep current vector)' : 'Content to embed *'}
                                rows="4"
                                className="w-[90%] mx-auto px-[0.6rem] py-[0.6rem] rounded-[12px] bg-[var(--primary-color)] autofill:bg-[var(--primary-color)] focusrLight border border-transparent outline-none focus:border-1 focus:border-[var(--accent-color)] resize-none"
                                required={modalMode !== 'edit'}
                            />

                            <div className="w-[90%] mx-auto">
                                <label className="text-[var(--text-color)] text-sm mb-2 block">Tags</label>
                                
                                {selectedTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {selectedTags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-[var(--accent-color)] text-[var(--text-color)] px-2 py-1 rounded-full text-xs flex items-center gap-1"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="hover:text-red-300"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2 mb-2">
                                    <select
                                        onChange={(e) => e.target.value && addTag(e.target.value)}
                                        className="flex-1 px-[0.6rem] py-[0.6rem] rounded-[12px] bg-[var(--primary-color)] border border-transparent outline-none focus:border-1 focus:border-[var(--accent-color)]"
                                    >
                                        <option value="">Select existing tag</option>
                                        {tags.filter(tag => !selectedTags.includes(tag)).map((tag, index) => (
                                            <option key={index} value={tag}>
                                                {tag}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add custom tag"
                                        className="flex-1 px-[0.6rem] py-[0.6rem] rounded-[12px] bg-[var(--primary-color)] border border-transparent outline-none focus:border-1 focus:border-[var(--accent-color)]"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addCustomTag}
                                        className="px-4 py-2 bg-[var(--accent-color)] text-[var(--text-color)] rounded-[12px] hover:opacity-80 transition-opacity"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="w-[90%] mx-auto text-red-500 text-center text-sm">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="w-[90%] mx-auto text-green-500 text-center text-sm">
                                    {success}
                                </div>
                            )}

                            <div className="w-[90%] mx-auto flex gap-[5%] justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-[var(--accent-color)] w-[48%] rounded-lg font-[570] px-[1.7rem] py-[0.7rem] border-2 border-[var(--accent-color)] cursor-pointer hoverLight hover:text-[var(--text-color)] hover:bg-[var(--accent-color)]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={upsertLoading}
                                    className="px-[1.7rem] py-[0.7rem] rounded-lg w-[48%] border-2 border-[var(--accent-color)] text-[var(--text-color)] bg-[var(--accent-color)] font-[580] cursor-pointer hoverLight soft transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {upsertLoading && (
                                        <span className="h-5 w-5 border-2 border-[var(--text-color)] border-t-transparent rounded-full animate-spin"></span>
                                    )}
                                    {modalMode === 'edit' ? (upsertLoading ? 'Saving...' : 'Save Changes') : (upsertLoading ? 'Upserting...' : 'Upsert Data')}
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {modalMode === 'delete' && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-[1.6rem] text-[var(--accent-color)] font-[550]">Confirm delete</h2>
                        <p className="opacity-80">Type <span className="font-semibold">Delete</span> to confirm removing <span className="font-semibold">{selectedItem?.title}</span>.</p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="Type Delete to confirm"
                            className="w-full px-[0.6rem] py-[0.6rem] rounded-[12px] bg-[var(--primary-color)] border border-transparent outline-none focus:border-1 focus:border-[var(--accent-color)]"
                        />
                        <div className="w-full flex gap-[5%] justify-between items-center mt-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-[var(--accent-color)] w-[48%] rounded-lg font-[570] px-[1.7rem] py-[0.7rem] border-2 border-[var(--accent-color)] cursor-pointer hoverLight hover:text-[var(--text-color)] hover:bg-[var(--accent-color)]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleteConfirmText !== 'Delete' || deleteLoading}
                                onClick={async () => {
                                    if (!selectedItem) return;
                                    try {
                                        setDeleteLoading(true);
                                        await handleDelete(selectedItem.id);
                                        setIsModalOpen(false);
                                    } finally {
                                        setDeleteLoading(false);
                                    }
                                }}
                                className="px-[1.7rem] py-[0.7rem] rounded-lg w-[48%] border-2 border-[var(--accent-color)] text-[var(--text-color)] bg-[var(--accent-color)] font-[580] cursor-pointer hoverLight soft transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {deleteLoading && (
                                    <span className="h-5 w-5 border-2 border-[var(--text-color)] border-t-transparent rounded-full animate-spin"></span>
                                )}
                                {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}


export default aidata;