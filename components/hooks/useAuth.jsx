import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get("/api/auth/me");
      setUser(data.user);
    };

    fetchUser();
    
  }, []);

  return user;
};