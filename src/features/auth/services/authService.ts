import axios from "axios";

export interface RequestOtpResponse {
  fullhash: string;
  otpToken: string;
  otp?: number
}

interface RequestEmailOtpResponse {
  token: string;
}


const apiClient = axios.create({
  baseURL: "https://sone-taran-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// fro phone 
export const requestPhoneOtpApi = async (phone: string | { phoneNo: string }): Promise<RequestOtpResponse> => {

  const phoneNumber = typeof phone === "object" ? phone.phoneNo : phone;

  const response = await apiClient.post("/user/sendPhoneOtp", { phone: phoneNumber });
  console.log(`OTP requested for phone: ${phoneNumber}`);

  console.log(response.data.otp)

  return response.data as RequestOtpResponse;

};

// for verifing the phone otp
export const verifyPhoneOtpApi = async (
  phone: string,
  otp: string,
  fullhash: string,
  otpToken: string
): Promise<{ token: string } | null> => {
  try {
    const response = await apiClient.post(
      '/user/verifyPhoneOtp',
      { phone, otp, fullhash },
      getAuthHeaders(otpToken)
    );

    if (response.status === 200 && response.data.token) {
      return { token: response.data.token };
    }

    return null;
  } catch (error) {
    console.error('Error verifying phone OTP:', error);
    return null;
  }
};

// For Email

export const requestEmailOtpApi = async (email: string | { email: string }): Promise<RequestEmailOtpResponse> => {

  const enteredEmail = typeof email === "object" ? email.email : email;

  const response = await apiClient.post("/user/sendEmailOtp", { email: enteredEmail });

  console.log(`OTP requested for email: ${enteredEmail}`);

  return response.data as RequestEmailOtpResponse;
};


// Verifing the email OTP
export const verifyEmailOtpApi = async (
  otp: string,
  token: string
): Promise<{ token: string } | null> => {
  try {
    const response = await apiClient.post(
      '/user/verifyEmailOtp', // adjust route if needed
      { otp },
      getAuthHeaders(token)
    );

    if (response.status === 200 && response.data.token) {
      return { token: response.data.token }; // This is the new session token
    }

    return null;
  } catch (error) {
    console.error('Error verifying email OTP:', error);
    return null;
  }
};