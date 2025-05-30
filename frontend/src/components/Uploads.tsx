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
import { ImageIcon } from "lucide-react"
import { reorderUploadsApi } from '@/services/uploadService'

class CustomPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: 'onPointerDown' as const,
            handler: ({ nativeEvent: event }: { nativeEvent: PointerEvent }) => {
                // Ignore elements with data-no-dnd="true"
                if ((event.target as HTMLElement).closest('[data-no-dnd="true"]')) {
                    return false;
                }
                return true;
            },
        },
    ];
}

type Props = {
    uploads: upload[]
    onEditUploadSuccess: (updatedUpload: upload) => void
    onDeleteUploadSuccess: (id: string) => void
}
const Uploads: React.FC<Props> = ({ uploads, onEditUploadSuccess, onDeleteUploadSuccess }) => {

    const [orderedUploads, setOrderedUploads] = useState(uploads)

    const sensors = useSensors(useSensor(CustomPointerSensor))

    useEffect(() => {
        setOrderedUploads(uploads)
    }, [uploads])



    const handleDragEnd = async (event: any) => {
        const { active, over } = event

        if (!over || active.id === over.id) return;

        const oldIndex = orderedUploads.findIndex(item => item._id === active.id);
        const newIndex = orderedUploads.findIndex(item => item._id === over.id);

        const newOrder = arrayMove(orderedUploads, oldIndex, newIndex);
        setOrderedUploads(newOrder);

        // Auto-save immediately after reordering
        const updatedUploads = newOrder
            .map((upload, index) => ({
                ...upload,
                newPosition: (newOrder.length - 1 - index)
            }))
            .filter((upload) => upload.position !== upload.newPosition);

        if (!updatedUploads.length) return;

        const data = updatedUploads.map(upload => ({
            _id: upload._id,
            position: upload.newPosition
        }));

        try {
            await reorderUploadsApi(data);
        } catch (error) {
            console.error('Error reordering uploads', error);
        } finally {
        }

    }

    // const handleSaveOrder = async () => {

    //     setIsSaving(true)

    //     const updatedUploads = orderedUploads
    //         .map((upload, index) => ({
    //             ...upload,
    //             newPosition: (orderedUploads.length - 1 - index)
    //         }))
    //         .filter((upload) => upload.position !== upload.newPosition)

    //     console.log("updated uplodas ", updatedUploads)

    //     const data = updatedUploads.map(upload => ({
    //         _id: upload._id,
    //         position: upload.newPosition
    //     }))

    //     try {
    //         if (!data.length) return
    //         await reorderUploadsApi(data)
    //     } catch (error) {
    //         console.error('error reordering uplods ', error)
    //     } finally {
    //         setIsSaving(false)
    //     }

    // }

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
                    {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveOrder}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Order'}
                    </Button> */}
                </div>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={orderedUploads.map(u => u._id)} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {orderedUploads.map((upload) => (
                            <UploadCard
                                key={upload._id}
                                upload={upload}
                                onEditUploadSuccess={onEditUploadSuccess}
                                onDeleteUploadSuccess={onDeleteUploadSuccess}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default Uploads