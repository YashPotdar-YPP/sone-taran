import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
  requestPhoneOtpApi,
  requestEmailOtpApi,
  verifyPhoneOtpApi,
  verifyEmailOtpApi,
} from '../services/authService';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  iat: number;
  // Add more fields if your token has them
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [fullhash, setFullhash] = useState<string | null>(null);
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [emailToken, setEmailToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<number | undefined | null>(null);

  const isTokenValid = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const storedOtpToken = localStorage.getItem('otpToken');
    const storedEmailToken = localStorage.getItem('emailToken');

    if (storedOtpToken && isTokenValid(storedOtpToken)) {
      setOtpToken(storedOtpToken);
      setIsAuthenticated(true);
    } else if (storedEmailToken && isTokenValid(storedEmailToken)) {
      setEmailToken(storedEmailToken);
      setIsAuthenticated(true);
    } else {
      logout();
    }
  }, []);

  const requestOtp = async (phone: string) => {
    const response = await requestPhoneOtpApi(phone);
    console.log(response);

    setFullhash(response.fullhash);
    setOtpToken(response.otpToken);
    setPhoneNumber(phone);
    setOtpSent(response.otp);
  };

  const requestEmailOtp = async (email: string) => {
    const response = await requestEmailOtpApi(email);
    setEmailToken(response.token);
    setEmail(email);
  };

  const verifyOtp = async (otp: string) => {
    if (!fullhash || !phoneNumber || !otpToken) return false;

    const response = await verifyPhoneOtpApi(
      String(phoneNumber),
      otp,
      fullhash,
      otpToken
    );

    if (response && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('otpToken', otpToken);
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const verifyEmailOtp = async (otp: string) => {
    if (!emailToken) return false;

    const response = await verifyEmailOtpApi(otp, emailToken);

    if (response?.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('emailToken', emailToken);
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const logout = () => {
    setPhoneNumber(null);
    setEmail(null);
    setIsAuthenticated(false);
    setOtpToken(null);
    setEmailToken(null);
    localStorage.removeItem('otpToken');
    localStorage.removeItem('emailToken');
    localStorage.removeItem('token');
    localStorage.removeItem('PhoneToken');
  };

  return (
    <AuthContext.Provider
      value={{
        phoneNumber,
        email,
        requestOtp,
        requestEmailOtp,
        verifyOtp,
        verifyEmailOtp,
        logout,
        otpSent,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
