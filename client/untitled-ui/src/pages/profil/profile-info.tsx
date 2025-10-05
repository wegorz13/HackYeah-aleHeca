import { useEffect, useState } from 'react';

interface User {
  country?: string;
  contact?: {
    phoneNumber?: string;
    instagram?: string;
    email?: string;
  };
}

const USER_ID = 2;

export const ProfileInfo = () => {
  const [country, setCountry] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [instagram, setInstagram] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/user/${USER_ID}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data: User = await res.json();
        if (active) {
          setCountry(data.country || null);
          setEmail(data.contact?.email || null);
          setPhone(data.contact?.phoneNumber || null);
          setInstagram(data.contact?.instagram || null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const badgeCls =
    'inline-flex items-center gap-1 rounded-3xl bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 shadow-sm';

  return (
    <div className="mt-2 flex flex-col gap-3">{/* increased gap from 1 to 2 */}
      {loading && <div className="text-xs text-gray-400">Loading info...</div>}

      {!loading && (country || email) && (
        <div className="flex flex-wrap gap-2">
          {country && (
            <div className={badgeCls}>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 13c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22c4-4 8-7.582 8-12a8 8 0 1 0-16 0c0 4.418 4 8 8 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{country}</span>
            </div>
          )}
          {email && (
            <div className={badgeCls}>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6h16v12H4z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m4 6 8 7 8-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{email}</span>
            </div>
          )}
        </div>
      )}

      {!loading && (phone || instagram) && (
        <div className="flex flex-wrap gap-2">
          {phone && (
            <div className={badgeCls}>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 4h4l2 5-3 1c.5 1.5 1.5 2.5 3 3l1-3 5 2v4c-6 1-11-4-12-12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{phone}</span>
            </div>
          )}
          {instagram && (
            <div className={badgeCls}>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="17" cy="7" r="1" fill="currentColor" />
              </svg>
              <span>@{instagram}</span>
            </div>
          )}
        </div>
      )}

      {!loading && !country && !email && !phone && !instagram && (
        <div className="text-xs text-gray-400">No info provided</div>
      )}
    </div>
  );
};

export default ProfileInfo;
