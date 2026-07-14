import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "";

export const getComponents=async ()=>
     
    {
  const token =localStorage.getItem("access_token");

  if (!token)
  {
<<<<<<< HEAD
    throw new Error("توکن پیدا نشد.");
=======
    throw new Error("Token not found.");
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
  }

  try 
  {
    const response=await axios.get(`${BASE_URL}/components/list-components`, 
        {
      headers: 
      {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) 
  {
    if (!error.response) 
    {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
<<<<<<< HEAD
      throw new Error("سرور در دسترس نیست.");
=======
      throw new Error("Server is unavailable.");
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
    }
    
    throw error;
  }
};
