import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "";

export const getComponents=async ()=>
     
    {
  const token =localStorage.getItem("access_token");

  if (!token)
  {
    throw new Error("توکن پیدا نشد.");
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
      throw new Error("سرور در دسترس نیست.");
    }
    
    throw error;
  }
};
