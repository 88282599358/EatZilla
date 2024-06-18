import { useEffect, useState } from "react";

export function useProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const profileData = await response.json();
        setData(profileData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };-

    fetchProfile();
  }, []);

  return { loading, data, error };
}


// import { useEffect, useState } from "react";

// export function useProfile() {
//   const [data, setData] = useState(false);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     setLoading(true);
//     fetch('/api/profile')
//     .then(response => {
//       response.json().then(data => {
//         setData(data);
//         setLoading(false);
//       });
//     })
//   }, []);

//   return { loading, data };
// }