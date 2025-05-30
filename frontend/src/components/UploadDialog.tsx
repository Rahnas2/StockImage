import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ImageIcon, PlusIcon, UploadIcon, XIcon } from 'lucide-react';
import { createUploadApi } from '@/services/uploadService';
import type { upload } from '@/Types/upload';
import toast from 'react-hot-toast';
import type { imageWithTitle } from '@/Types/imageWithTitle';

type Props = {
    open: boolean
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
    onUploadSuccess: (newUploads: upload []) => void
}

const UploadDialog: React.FC<Props> = ({ open, onOpenChange, onUploadSuccess }) => {

    const [isUploading, setIsUploading] = useState(false)

    const [uploads, setUploads] = useState<imageWithTitle[]>([])

    const [dragActive, setDragActive] = useState(false)

    const resetForm = () => {
        setUploads([])
        setIsUploading(false);
        setDragActive(false);
    };

    const removeUpload = (i: number) => {
        setUploads(prev => prev.filter((_, index) => index !== i))
    }

    const updateUploadTitle = (index: number, title: string) => {
        setUploads(prev => prev.map((img, i) =>
            i === index ? { ...img, title } : img
        ));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const fileArray = Array.from(e.target.files)
            const newImage = fileArray.map(file => ({
                title: '',
                image: file
            }))

            setUploads(prev => [...prev, ...newImage])
        }
    }
    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()

        uploads.forEach((upload) => {
            formData.append(`titles`, upload.title.trim())
            formData.append(`images`, upload.image)
        });

        try {
            setIsUploading(true)
            const result = await createUploadApi(formData)
            resetForm()
            onUploadSuccess(result.uploads)
            toast.success('success')
        } catch (error: any) {
            console.log('error creating uplod ', error)
            error?.response?.data?.message ? toast.error(error.response.data.message) : toast.error('something went wrong please try again')
        } finally {
            setIsUploading(false)
        }
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

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const fileArray = Array.from(e.dataTransfer.files);
            const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

            if (imageFiles.length === 0) {
                toast.error('Please select image files only');
                return;
            }

            const newImages = imageFiles.map(file => ({
                image: file,
                title: ''
            }));

            setUploads(prev => [...prev, ...newImages]);
        }

    }

    const areAllTitlesValid = () => {
        const titles = uploads.map(up => up.title.trim().toLowerCase());

        // Check if all titles are filled
        if (titles.some(title => !title)) {
            return 'Title is required for every image';
        }

        // Check for uniqueness
        const set = new Set(titles);
        if (titles.length !== set.size) {
            return 'All titles should be unique';
        }

        return false;
    };

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            if (!newOpen) resetForm();
            onOpenChange(newOpen);
        }}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Upload Image</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4">


                    <div className="space-y-2">

                        <div className='flex justify-between'>
                            <Label>Images</Label>
                            {uploads.length > 0 && (
                                <span className='text-sm text-gray-500'>{uploads.length} {uploads.length > 1 ? "images" : "image"} Selected</span>
                            )}
                        </div>

                        <div
                            className={`border-2 border-dashed rounded-md p-6 transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border'
                                }`}
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                        >
                            {uploads.length ? (
                                <div className="space-y-2">
                                    <div className='grid grid-cols-1 gap-4'>
                                        {uploads.map((uploads, index) => (
                                            <div className='flex gap-4 p-3 rounded-lg'>
                                                <div className='relative w-24 h-24 flex-shrink-0'>
                                                    <img
                                                        src={URL.createObjectURL(uploads.image)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full mx-auto object-cover rounded-md"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className='absolute -top-2 -right-2 bg-white hover:bg-gray-100 text-gray-600 p-1 rounded-full shadow-md transition-colors'
                                                        onClick={() => {
                                                            removeUpload(index);
                                                        }}
                                                        disabled={isUploading}
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div>
                                                    <Label className='mb-2' htmlFor={`title-${index}`}>Image Title</Label>
                                                    <Input
                                                        id={`title-${index}`}
                                                        value={uploads.title}
                                                        onChange={(e) => updateUploadTitle(index, e.target.value)}
                                                        placeholder='enter a title for this image '
                                                        disabled={isUploading}
                                                    />
                                                </div>
                                            </div>

                                        ))}

                                        {/* More Uploads  */}
                                        <div
                                            className="flex items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-gray-50"
                                            onClick={() => document.getElementById('image-input')?.click()}
                                        >
                                            <div className="flex flex-col items-center text-gray-500">
                                                <PlusIcon className="h-8 w-8 mb-1" />
                                                <span className="text-sm">Add more images</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4">
                                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground text-center mb-2">
                                        Drag and drop your image here, or click to browse
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => document.getElementById('image-input')?.click()}
                                        disabled={isUploading}
                                    >
                                        Select Image
                                    </Button>
                                </div>
                            )}

                            <Input
                                id="image-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                                disabled={isUploading}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={isUploading || !uploads.length || !!areAllTitlesValid()}
                            className="gap-1"
                        >
                            {isUploading ? (
                                <>Uploading...</>
                            ) : (
                                <>
                                    <UploadIcon className="h-4 w-4" />
                                    Upload
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent >
        </Dialog >
    )
}

export default UploadDialog