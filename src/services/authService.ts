import axios from 'axios';

interface LoginRequest 
{
  username: string;
  password: string;
}

interface LoginResponse 
{
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> =>
   {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', credentials.username);
  params.append('password', credentials.password);
  params.append('scope', '');
  params.append('client_id', '');
  params.append('client_secret', '');

  try {
    const response = await axios.post<LoginResponse>(
      '/auth/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error)
   {
    if (axios.isAxiosError(error))
       {
      if (error.response?.status === 401) 
        {
        throw new Error('نام کاربری یا رمز عبور اشتباه است');
      }
      if (!error.response) 
        {
        throw new Error('خطای شبکه - لطفاً اتصال خود را بررسی کنید');
      }
    }
    throw new Error('خطا در ورود به سیستم');
  }
};
