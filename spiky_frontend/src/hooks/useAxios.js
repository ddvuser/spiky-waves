import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000";

export const useAxios = (axiosParams) => {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (params) => {
    try {
      const result = await axios.request(params);
      setResponse(result.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(axiosParams);
  }, []);

  return { response, isLoading, error };
};
