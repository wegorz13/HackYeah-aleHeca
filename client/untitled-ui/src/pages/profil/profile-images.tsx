import React, { useEffect, useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { FileTrigger } from "@/components/base/file-upload-trigger/file-upload-trigger";

const USER_ID = 2;
const SECONDARY_POSITIONS: Array<{ row: number; col: number }> = [
    { row: 1, col: 3 },
    { row: 1, col: 4 },
    { row: 2, col: 3 },
    { row: 2, col: 4 },
    { row: 3, col: 3 },
];

export const ProfileImages: React.FC = () => {
    const [pictureIds, setPictureIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false); // moved here
    const [lastUploadId, setLastUploadId] = useState<number | null>(null); // moved here

    async function handleImageSelect(files: FileList | null) {
        if (!files || files.length === 0) return;
        const file = files[0];
        try {
            setUploading(true);
            const form = new FormData();
            form.append("image", file);
            form.append("userId", String(USER_ID));
            const res = await fetch("http://localhost:3000/picture", { method: "POST", body: form });
            if (!res.ok) {
                console.error("Upload failed");
                return;
            }
            const data = await res.json();
            setLastUploadId(data.pictureId);
            console.log(data.pictureId);
            await reload();
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    }

    async function reload() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:3000/user/${USER_ID}/pictures`);
            if (res.ok) {
                const json = await res.json();
                let list: any[] = [];
                if (Array.isArray(json)) list = json;
                else if (Array.isArray(json.pictureIds)) list = json.pictureIds;
                else if (Array.isArray((json as any).pictures)) list = (json as any).pictures;
                list = list.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                setPictureIds(list.map((d) => d.id).filter((id: any) => typeof id === "number"));
            }
        } catch (e: any) {
            setError(e.message || "Error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        reload();
    }, []);

    const mainId = pictureIds[0];
    const secondaryIds = pictureIds.slice(1);

    return (
        <div className="w-full">
            {loading && <div className="mb-2 text-sm text-gray-500">Loading images...</div>}
            {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
            <div
                className="grid gap-3"
                style={{
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gridTemplateRows: "repeat(3, 1fr)",
                    aspectRatio: "4 / 3",
                    width: "100%",
                }}
            >
                <div
                    className="relative col-span-2 row-span-3 flex items-center justify-center overflow-hidden rounded-3xl bg-gray-100"
                    style={{ gridColumnStart: 1, gridRowStart: 1 }}
                >
                    {mainId ? (
                        <img src={`http://localhost:3000/picture/${mainId}`} alt="Main" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        <span className="text-xs text-gray-400">No image</span>
                    )}
                </div>

                {SECONDARY_POSITIONS.map((pos, i) => {
                    const id = secondaryIds[i];
                    return (
                        <div
                            key={pos.row + "-" + pos.col}
                            className={`relative flex items-center justify-center overflow-hidden rounded-3xl ${id ? "border border-gray-200 bg-white" : "bg-gray-200"}`}
                            style={{ gridColumnStart: pos.col, gridRowStart: pos.row }}
                        >
                            {id && (
                                <img src={`http://localhost:3000/picture/${id}`} alt={`Picture ${id}`} className="h-full w-full object-cover" loading="lazy" />
                            )}
                        </div>
                    );
                })}

                <div className="relative flex items-center justify-center rounded-3xl bg-white" style={{ gridColumnStart: 4, gridRowStart: 3 }}>
                    <FileTrigger acceptedFileTypes={["image/*"]} onSelect={handleImageSelect}>
                        <Button
                            color="tertiary"
                            size="lg"
                            isLoading={uploading}
                            className="flex h-full w-full items-center justify-center gap-1 rounded-3xl !p-0 text-base leading-none font-medium"
                        >
                            Add
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </FileTrigger>
                </div>
            </div>
        </div>
    );
};

export default ProfileImages;
