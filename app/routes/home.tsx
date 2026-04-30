import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { useState, useEffect } from "react";
import { usePuterStore } from "~/lib/puter";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ResumeAlign" },
    { name: "description", content: "Smart feedback to your dream job" },
  ];
}

export default function Home() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const { kv, fs } = usePuterStore();
  const [files, setFiles] = useState<FSItem[]>([]);

  const handleDeleteAll = async () => {
    // Delete all files in the file system
    files.forEach(async (file) => {
      await fs.delete(file.path);
    })
    await kv.flush();
    loadFiles();
    loadResumes();
  }
  const loadFiles = async () => {
    const files = await fs.readDir("./") as FSItem[];
    setFiles(files);
  }
  const loadResumes = async () => {
    setLoadingResumes(true);

    const resumes = (await kv.list('resume:*', true)) as KVItem[];

    const parsedResumes = resumes.map(resume => (
      JSON.parse(resume.value) as Resume
    ))
    setResumes(parsedResumes);
    setLoadingResumes(false);
  }
  const handleDeleteResume = async (id: string) => {
    await kv.delete(`resume:${id}`);
    loadResumes();
  }

  useEffect(() => {
    loadResumes();
    loadFiles();
  }, [])


  return (
    <>
      <main className="bg-[url('/images/bg-main.svg')]">
        <Navbar />
        <section className="main-section">
          <div className="page-heading py-16">
            <h1>Track Your Applications & Resume Ratings</h1>
            {!loadingResumes && resumes?.length === 0 ?
              (<h2>No resumes found. Upload your first resume to get feedback.</h2>) :
              (<h2>Review your submissions and check AI-powered feedback.</h2>)}
          </div>
          {loadingResumes && (
            <div className="flex flex-col items-center justify-center">
              <img src="/images/resume-scan-2.gif" className="w-50" />
            </div>
          )}

          {!loadingResumes && resumes?.length > 0 && (
            <div className="resumes-section">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} handleDelete={handleDeleteResume} />
              ))}
            </div>
          )}

          {!loadingResumes && resumes?.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10 gap-4">
              <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                Upload Resume
              </Link>
            </div>
          )}
          {!loadingResumes && resumes?.length > 0 && (
            <div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                onClick={handleDeleteAll}>
                Clear all resumes and files
              </button>
            </div>
          )}

        </section>
      </main>;
    </>
  )


}
