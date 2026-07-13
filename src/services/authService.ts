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
        throw new Error('Invalid username or password');
      }
      if (!error.response) {
        throw new Error('Network error - please check your connection');
      }
    }
    throw new Error('Login failed');
  }
};

export const logout = async (): Promise<void> => 
  {
  const token = localStorage.getItem('access_token');

  if (!token) 
    {
    throw new Error('Token not found');
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
        throw new Error('Invalid authentication');
      }
    }
    throw new Error('Logout failed');
  }
};
