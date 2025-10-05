import { useEffect, useState } from 'react';

interface ProfileItem { description?: string }

const USER_ID = 2;

export const ProfileDescription = () => {
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:3000/user/${USER_ID}/profile`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        if (!active) return;
        let list: any[] = [];
        if (Array.isArray(data)) list = data; else if (Array.isArray(data?.profiles)) list = data.profiles; else if (data) list = [data];
        const first: ProfileItem | undefined = list.find(i => typeof i?.description === 'string' && i.description.trim().length > 0);
        if (first?.description) setDescription(first.description);
      } catch (e: any) {
        if (active) setError(e.message || 'Error');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="w-full flex flex-col gap-1 mt-2">
      {loading && <div className="text-xs text-gray-400">Loading description...</div>}
      {error && !loading && <div className="text-xs text-red-500">{error}</div>}
      <textarea
        readOnly
        aria-readonly="true"
        value={description || ''}
        placeholder={loading ? '' : 'No description available'}
        className="w-full h-28 rounded-3xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm resize-none leading-snug"
      />
    </div>
  );
};

export default ProfileDescription;
