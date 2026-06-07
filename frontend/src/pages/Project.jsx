import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { getProjectById } from '../services/project.services.js'
import { applyToProject } from '../services/application.services.js'
import { Briefcase, Tag, CheckCircle } from 'lucide-react'

const Project = () => {
    const [project, setProject] = useState({ title: '', description: '', requiredSkills: [], status: '' })
    const { projectId } = useParams()
    const [showApplyForm, setShowApplyForm] = useState(false)
    const [message, setMessage] = useState('')
    const [applyError, setApplyError] = useState('')
    const [applying, setApplying] = useState(false)
    const [applied, setApplied] = useState(false)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await getProjectById(projectId)
                setProject(response)
            } catch (error) {
                console.error('Error fetching project:', error)
            }
        }
        fetchProject()
    }, [projectId])

    const handleApply = async () => {
        setApplying(true)
        try {
            await applyToProject(projectId, { message })
            setApplied(true)
            setShowApplyForm(false)
        } catch (error) {
            setApplyError(error.response?.status === 400 ? 'You have already applied.' : 'Something went wrong.')
        } finally {
            setApplying(false)
        }
    }

    return (
        <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-4">
                    <h1 className="text-xl font-semibold text-gray-900">{project.title}</h1>
                    <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${project.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {project.status}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{project.domain}</span>
                </div>
                <p className="text-gray-600 text-sm mt-4 leading-relaxed">{project.description}</p>
                <div className="mt-4">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                        {project.requiredSkills?.map(skill => (
                            <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 text-xs rounded-full border border-violet-100">
                                <Tag className="w-3 h-3" />{skill}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                    {applied ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                            <CheckCircle className="w-4 h-4" /> Application submitted!
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setShowApplyForm(!showApplyForm)
                                setApplyError('')
                            }}
                            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                        >
                            {showApplyForm ? 'Cancel' : 'Apply Now'}
                        </button>
                    )}
                </div>
            </div>

            {showApplyForm && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-3">Your Application</h3>
                    <textarea
                        placeholder="Why do you want to join? What can you contribute?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    />
                    <div className="mt-3 flex flex-col gap-2">
                        {applyError && (
                            <p className="text-red-500 text-xs text-right">{applyError}</p>
                        )}
                        <div className="flex justify-end">
                            <button onClick={handleApply} disabled={applying}
                                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
                                {applying ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Project;