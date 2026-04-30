import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ScoreCircle from './ScoreCircle'
import { usePuterStore } from '~/lib/puter';


const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath }, handleDelete }: { resume: Resume, handleDelete: (id: string) => void }) => {
    const [resumeUrl, setResumeUrl] = useState<string>('');
    const { fs } = usePuterStore();

    useEffect(() => {
        const loadResume = async () => {
            const imageBlob = await fs.read(imagePath);
            if (!imageBlob) return;

            const imageUrl = URL.createObjectURL(imageBlob);
            setResumeUrl(imageUrl);
        }
        loadResume();

    }, [imagePath])

    return (
        <>
            <Link to={`/resume/${id}`} className='resume-card animate-in fade-in duration-1000 group relative z-10'>
            <div className='cursor-pointer absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-50' onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(id); }}>
                <img src='/icons/cross.svg' alt='remove' className='h-4 w-4' />
            </div>
                <div className='resume-card-header'>
                    <div className='flex flex-col gap-2'>
                        {companyName && <h2 className="text-black! font-bold wrap-break-words">{companyName}</h2>}
                        {jobTitle && <h3 className="text-lg wrap-break-words text-gray-500">{jobTitle}</h3>}
                        {!companyName && !jobTitle && <h2 className="text-black! font-bold">Resume</h2>}
                    </div>
                    <div className='shrink-0'>
                        <ScoreCircle score={feedback.overallScore} />
                    </div>
                </div>
                {resumeUrl && (
                    <div className="gradient-border animate-in fade-in duration-1000">
                        <div className="w-full h-full">
                            <img
                                src={resumeUrl}
                                alt="resume"
                                className="w-full h-87.5 max-sm:h-50 object-cover object-top"
                            />
                        </div>
                    </div>
                )}

            </Link>
        </>

    )
}

export default ResumeCard