import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ImageIcon, UploadIcon } from 'lucide-react';
import { createUploadApi } from '@/services/uploadService';
import type { upload } from '@/Types/upload';
import toast from 'react-hot-toast';

type Props = {
    open: boolean
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
    onUploadSuccess: (upload: upload) => void
}

const UploadDialog: React.FC<Props> = ({ open, onOpenChange, onUploadSuccess }) => {

    const [isUploading, setIsUploading] = useState(false)

    const [title, setTitle] = useState('')
    const [image, setImage] = useState<File | null>(null)

    const [dragActive, setDragActive] = useState(false)

    const resetForm = () => {
        setTitle('');
        setImage(null);
        setIsUploading(false);
        setDragActive(false);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', title.trim())
        formData.append('image', image as File)
        try {
            setIsUploading(true)
            const result = await createUploadApi(formData)
            resetForm()
            onUploadSuccess(result.upload)
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

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                setImage(file);
            } else {
                alert('Please select an image file');
            }
        }
    }
    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            if (!newOpen) resetForm();
            onOpenChange(newOpen);
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Image</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Image Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a title for your image"
                        disabled={isUploading}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Image</Label>
                    <div
                        className={`border-2 border-dashed rounded-md p-6 transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border'
                            }`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                    >
                        {image ? (
                            <div className="space-y-2">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    className="max-h-48 max-w-full mx-auto object-contain rounded-md"
                                />
                                <div className="flex justify-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setImage(null);
                                        }}
                                        disabled={isUploading}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4">
                                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground text-center mb-2">
                                    Drag and drop your image here, or click to browse
                                </p>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setImage(e.target.files[0]);
                                        }
                                    }}
                                    disabled={isUploading}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById('image')?.click()}
                                    disabled={isUploading}
                                >
                                    Select Image
                                </Button>
                            </div>
                        )}
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
                        disabled={isUploading || !title.trim() || !image}
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
            </DialogContent>
        </Dialog>
    )
}

export default UploadDialog