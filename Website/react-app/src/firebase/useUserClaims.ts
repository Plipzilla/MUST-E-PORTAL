import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export function useUserClaims() {
  const { user, isLoading } = useAuth();
  const [claims, setClaims] = useState({ admin: false, reviewer: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      user.getIdTokenResult().then(tokenResult => {
        if (isMounted) {
          setClaims({
            admin: !!tokenResult.claims.admin,
            reviewer: !!tokenResult.claims.reviewer
          });
          setLoading(false);
        }
      });
    } else {
      setClaims({ admin: false, reviewer: false });
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [user]);

  return { ...claims, loading: isLoading || loading };
} 