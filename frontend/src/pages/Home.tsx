import { Button } from "@/components/ui/button"
import UploadDialog from "@/components/UploadDialog"
import Uploads from "@/components/Uploads"
import Navbar from "@/layout/Navbar"
import { fetchUploadsApi } from "@/services/uploadService"
import type { upload } from "@/Types/upload"

import { ImagePlus } from 'lucide-react'
import { useEffect, useState } from "react"

const Home = () => {

  const [uploads, setUploads] = useState<upload[]>([])
  const [isCreateUpload, setIsCreateUpload] = useState(false)

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const result = await fetchUploadsApi()
        setUploads(result.uploads)
      } catch (error) {
        console.error('error fetcing uploads ', error)
      }
    }

    fetchUploads()
  }, [])

  const handleUploadSuccess = async (newUploads: upload []) => {
    setIsCreateUpload(false)
    setUploads(prev => [...newUploads, ...prev])
  }

  const handleDeleteUpload = async (id: string) => {
    setUploads(prev => prev.filter(upload => upload._id !== id))
  }

  const handleEditUpload = (updatedUpload: upload) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload._id === updatedUpload._id ? updatedUpload : upload
      )
    );
  };

  return (
    <div className="">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Images</h1>
          <Button
            onClick={() => setIsCreateUpload(true)}
            className="group transition-all duration-300 ease-in-out"
          >
            <ImagePlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            Upload Image
          </Button>
        </div>

        <Uploads
          uploads={uploads}
          onEditUploadSuccess={handleEditUpload}
          onDeleteUploadSuccess={handleDeleteUpload}
        />
      </main>

      <UploadDialog
        open={isCreateUpload}
        onOpenChange={setIsCreateUpload}
        onUploadSuccess={handleUploadSuccess}/>
    </div>
  )
}

export default Home