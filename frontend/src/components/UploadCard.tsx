
import type { upload } from '@/Types/upload'
import type React from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { GripVertical, Maximize, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { deleteUploadApi, editUploadApi } from '@/services/uploadService'
import toast from 'react-hot-toast'
import { Label } from '@radix-ui/react-label'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Props = {
  upload: upload
  onEditUploadSuccess: (editedUpload: upload) => void
  onDeleteUploadSuccess: (id: string) => void
}

const UploadCard: React.FC<Props> = ({ upload, onEditUploadSuccess, onDeleteUploadSuccess }) => {

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)

  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [dragAtive, setDragActive] = useState(false)

  const [title, setTitle] = useState(upload.title)
  const [image, setImage] = useState<File | null>(null)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: upload._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setImage(file);
      } else {
        alert('Please select an image file');
      }
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()

    let changed = false

    const formData = new FormData()
    formData.append('_id', upload._id)

    if (upload.title !== title.trim()) {
      changed = true
      formData.append('title', title.trim())
    }

    if (image) {
      changed = true
      formData.append('image', image)
    }

    if (!changed) {
      return toast('⚠️ no changes')
    }

    try {
      setIsUpdating(true)
      const result = await editUploadApi(formData)
      setIsEditDialogOpen(false)
      onEditUploadSuccess(result.upload)
      toast.success('success')
    } catch (error: any) {
      console.error('error editing uplaod ', error)
      error?.response?.data?.message ? toast.error(error.response.data.message) : toast.error('someting went wrong')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteUploadApi(upload._id)
      setIsDeleteDialogOpen(false)
      onDeleteUploadSuccess(upload._id)
    } catch (error: any) {
      console.error('error deleting uplad ', error)
      error?.response?.data?.message ? toast.error(error.response.data.message) : toast.error('something went wrong')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className={`group overflow-hidden transition-all duration-200 ${false ? 'ring-2 ring-primary' : ''}`}>
          <CardContent className="p-0 relative">
            {/* Drag handle */}
            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-black/50 backdrop-blur-sm p-1.5 rounded-md cursor-move">
                <GripVertical className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="relative aspect-square overflow-hidden">
              {/* Preview overlay */}
              <div
                className="absolute inset-0 z-20 cursor-pointer"
                onClick={() => setIsPreviewDialogOpen(true)}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 z-10" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Image */}
              <img
                src={upload.image}
                alt={upload.title}
                className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              />

              {/* Dropdown is outside clickable preview */}
              <div
                className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-md">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex flex-col items-start p-3">
            <h3 className="font-medium text-base line-clamp-1">{upload.title}</h3>
            <p className="text-xs text-muted-foreground">{upload.updatedAt}</p>
          </CardFooter>
        </Card>
      </div>


      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Image title"
                className="w-full"
              />

              <div className="space-y-2">
                <Label>Image</Label>
                <div
                  className={`border-2 border-dashed rounded-md p-6 transition-colors ${dragAtive ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-2">
                    <img
                      src={image ? URL.createObjectURL(image) : upload.image}
                      alt="Preview"
                      className="max-h-48 max-w-full mx-auto object-contain rounded-md"
                    />
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('edit-image-input')?.click()}
                        disabled={isUpdating}
                      >
                        Change Image
                      </Button>
                    </div>
                  </div>
                  <Input
                    id="edit-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImage(e.target.files[0]);
                      }
                    }}
                    disabled={isUpdating}
                  />
                </div>
              </div>

            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating || !title.trim()}>
                {isUpdating ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog >

      {/* Delete Confirmation Dialog */}
      < Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this image? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog >

      {/* Image Preview Dialog */}
      < Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen} >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{upload.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-2 flex justify-center">
            <img
              src={upload.image}
              alt={upload.title}
              className="max-h-[70vh] max-w-full object-contain rounded-md"
            />
          </div>
        </DialogContent>
      </Dialog >
    </>
  )
}

export default UploadCard  