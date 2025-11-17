import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    axios.get("/api/auth/me").then(res => {
      setUser(res.data.user);
    });
  }, []);

  return user;
};