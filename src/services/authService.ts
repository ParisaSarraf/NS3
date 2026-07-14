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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) 
        {
<<<<<<< HEAD
        throw new Error('نام کاربری یا رمز عبور اشتباه است');
      }
      if (!error.response) {
        throw new Error('خطای شبکه - لطفاً اتصال خود را بررسی کنید');
      }
    }
    throw new Error('خطا در ورود به سیستم');
=======
        throw new Error('Invalid username or password');
      }
      if (!error.response) {
        throw new Error('Network error - please check your connection');
      }
    }
    throw new Error('Login failed');
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
  }
};

export const logout = async (): Promise<void> => 
  {
  const token = localStorage.getItem('access_token');

  if (!token) 
    {
<<<<<<< HEAD
    throw new Error('توکن یافت نشد');
=======
    throw new Error('Token not found');
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
  }

  try {
    await axios.post(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
<<<<<<< HEAD
        throw new Error('احراز هویت نامعتبر است');
      }
    }
    throw new Error('خطا در خروج از سیستم');
=======
        throw new Error('Invalid authentication');
      }
    }
    throw new Error('Logout failed');
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
  }
};
