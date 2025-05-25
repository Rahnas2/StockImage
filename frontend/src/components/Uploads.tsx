import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import React, { useEffect, useState } from "react"
import UploadCard from "./UploadCard"
import type { upload } from "@/Types/upload"
import { Button } from "./ui/button"
import { ImageIcon } from "lucide-react"
import { reorderUploadsApi } from '@/services/uploadService'

type Props = {
    uploads: upload[]
    onEditUploadSuccess: (updatedUpload: upload) => void
    onDeleteUploadSuccess: (id: string) => void
}
const Uploads: React.FC<Props> = ({ uploads, onEditUploadSuccess, onDeleteUploadSuccess }) => {

    const [orderedUploads, setOrderedUploads] = useState(uploads)

    const [isSaving, setIsSaving] = useState(false)

    const sensors = useSensors(useSensor(PointerSensor))

    useEffect(() => {
        setOrderedUploads(uploads)
    }, [uploads])



    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            const oldIndex = orderedUploads.findIndex(item => item._id === active.id)
            const newIndex = orderedUploads.findIndex(item => item._id === over.id)
            setOrderedUploads(arrayMove(orderedUploads, oldIndex, newIndex))
        }
    }

    const handleSaveOrder = async () => {

        setIsSaving(true)

        const updatedUploads = orderedUploads
            .map((upload, index) => ({
                ...upload,
                newPosition: (orderedUploads.length - 1 - index)
            }))
            .filter((upload) => upload.position !== upload.newPosition)

        console.log("updated uplodas ", updatedUploads)

        const data = updatedUploads.map(upload => ({
            _id: upload._id,
            position: upload.newPosition
        }))

        if(!data.length) return 
        try {
            await reorderUploadsApi(data)
        } catch (error) {
            console.error('error reordering uplods ', error)
        } finally {
            setIsSaving(false)
        }

    }

    if (uploads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-medium text-foreground mb-2">No images yet</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                    Upload your first image to get started. You can add titles and organize your images in your personal gallery.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orderedUploads.length > 1 && (
                <div className="flex items-center justify-between pb-2 border-b">
                    <p className="text-sm text-muted-foreground">
                        Drag and drop images to reorder them
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveOrder}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Order'}
                    </Button>
                </div>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={orderedUploads.map(u => u._id)} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {orderedUploads.map((upload) => (
                            <UploadCard
                                key={upload._id}
                                upload={upload}
                                // index={index}
                                onEditUploadSuccess={onEditUploadSuccess}
                                onDeleteUploadSuccess={onDeleteUploadSuccess}
                            // moveCard={moveCard}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default Uploads