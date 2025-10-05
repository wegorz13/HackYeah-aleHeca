import React, { useEffect, useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { FileTrigger } from "@/components/base/file-upload-trigger/file-upload-trigger";

// USER_ID constant to identify the user
const USER_ID = 2;
// Removed incorrect top-level hooks (useState) that caused invalid hook call

// Layout positions (excluding the main big image, and excluding the reserved + Add cell)
// row, col (1-indexed) for a 4-column grid. Last cell (row3,col4) is reserved for the "+ Add" button.
const SECONDARY_POSITIONS: Array<{ row: number; col: number }> = [
  { row: 1, col: 3 },
  { row: 1, col: 4 },
  { row: 2, col: 3 },
  { row: 2, col: 4 },
  { row: 3, col: 3 }, // only 5 image slots
];

export const ProfileImages: React.FC = () => {
  const [pictureIds, setPictureIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false); // moved here
  const [setLastUploadId] = useState<number | null>(null); // moved here

  async function handleImageSelect(files: FileList | null){
    if(!files || files.length === 0) return;
    const file = files[0];
    try {
      setUploading(true);
      const form = new FormData();
      form.append('image', file);
      form.append('userId', String(USER_ID));
      const res = await fetch('http://localhost:3000/picture', { method: 'POST', body: form });
      if(!res.ok){
        console.error('Upload failed');
        return;
      }
      const data = await res.json();
      setLastUploadId(data.pictureId);
      // refresh images
      await reload();
    } catch(err){
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  async function reload(){
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/user/${USER_ID}/pictures`);
      if (!res.ok) throw new Error('Failed fetching picture list');
      const json = await res.json();
      let list: any[] = [];
      if (Array.isArray(json)) list = json; else if (Array.isArray(json.pictureIds)) list = json.pictureIds; else if (Array.isArray((json as any).pictures)) list = (json as any).pictures;
      list = list.slice().sort((a,b)=> (a.order ?? 0) - (b.order ?? 0));
      setPictureIds(list.map(d=>d.id).filter((id:any)=> typeof id === 'number'));
    } catch(e:any){
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  const mainId = pictureIds[0];
  const secondaryIds = pictureIds.slice(1);

  return (
    <div className="w-full">
      {loading && <div className="text-sm text-gray-500 mb-2">Loading images...</div>}
      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          aspectRatio: '4 / 3',
          width: '100%',
        }}
      >
        {/* Main image spanning first 2 columns and all 3 rows (2x3) */}
        <div
          className="relative col-span-2 row-span-3 rounded-3xl overflow-hidden flex items-center justify-center bg-gray-100"
          style={{ gridColumnStart: 1, gridRowStart: 1 }}
        >
          {mainId ? (
            <img src={`http://localhost:3000/picture/${mainId}`} alt="Main" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
        </div>

        {/* Secondary images (5 max) */}
        {SECONDARY_POSITIONS.map((pos,i)=>{
          const id = secondaryIds[i];
          return (
            <div key={pos.row+'-'+pos.col} className={`relative rounded-3xl overflow-hidden flex items-center justify-center ${id ? 'bg-white border border-gray-200' : 'bg-gray-200'}`} style={{ gridColumnStart: pos.col, gridRowStart: pos.row }}>
              {id && <img src={`http://localhost:3000/picture/${id}`} alt={`Picture ${id}`} className="h-full w-full object-cover" loading="lazy" />}
            </div>
          );
        })}

        {/* + Add button at last cell (row3,col4) */}
        <div className="relative rounded-3xl flex items-center justify-center bg-white" style={{ gridColumnStart: 4, gridRowStart: 3 }}>
          <FileTrigger acceptedFileTypes={["image/*"]} onSelect={handleImageSelect}>
            <Button color="tertiary" size="lg" isLoading={uploading} className="w-full h-full rounded-3xl flex items-center justify-center !p-0 gap-1 text-base leading-none font-medium">
              Add
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Button>
          </FileTrigger>
        </div>
      </div>
    </div>
  );
};

export default ProfileImages;
