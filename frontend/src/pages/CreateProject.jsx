import { useState } from 'react'
import { createProject } from '../services/project.services.js'
import { useNavigate } from 'react-router-dom'

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"

const CreateProject = () => {
    const [projectData, setProjectData] = useState({ title: '', description: '', requiredSkills: '', domain: '' })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => setProjectData({ ...projectData, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const requiredSkills = projectData.requiredSkills.split(',').map(s => s.trim())
            const response = await createProject({ ...projectData, requiredSkills })
            if (response) navigate('/')
        } catch (error) {
            console.log('An error occurred: ', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Post a Project</h2>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-400">*</span></label>
                    <input type="text" name="title" placeholder="e.g. E-commerce App with React" value={projectData.title} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                    <input type="text" name="domain" placeholder="e.g. Web Development, ML, Mobile" value={projectData.domain} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" placeholder="What are you building? What's the goal?" value={projectData.description} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills <span className="text-red-400">*</span></label>
                    <input type="text" name="requiredSkills" placeholder="React, Node.js, MongoDB" value={projectData.requiredSkills} onChange={handleChange} required className={inputClass} />
                    <p className="text-xs text-gray-400 mt-1">Comma separated</p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => navigate('/')} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition">
                        {loading ? 'Posting...' : 'Post Project'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateProject;