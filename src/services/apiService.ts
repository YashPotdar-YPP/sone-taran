import axios from "axios";

// Create a reusable axios instance with a base URL
//import.meta.env.BASE_URL
const apiClient = axios.create({
  baseURL: "https://sone-taran-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});


export interface AddKalam {
  customerId: string,
  loans: {
    details: {
      number: number,
      name: string,
      materialType: string,
      netWeight: number,
      grossWeight: number,
      purity: number,
      goldRateAtLoan: number,
    }
    loanDetails: {
      totalAmt: number,
      customerAmt: number,
      dukandarAmt: number,
      dueAmount: number,
      customerROI: number,
      merchantROI: number,
      loanStartDate: string,
      validity: string,
    },
  }
  merchantId: string,
}

export interface Customer {
  name: string;
  contact: string[];
  address: {
    street: string;
    city: string;
    zip: number;
  };
}

export interface EditCustomer {
  name: string;
  contact: string[];
  address: {
    street: string;
    city: string;
    zip: number;
  };
}

export interface EditLoan {
  loans: {
    details: {
      number: number,
      name: string,
      materialType: string,
      netWeight: number,
      grossWeight: number,
      purity: number,
      goldRateAtLoan: number,
    }
    loanDetails: {
      totalAmt: number,
      customerAmt: number,
      dukandarAmt: number,
      dueAmount: number,
      customerROI: number,
      merchantROI: number,
      loanStartDate: string,
      validity: string,
    },
  }
}

export interface AddMerchant {
  name: string;
  shopName: string;
  contact: string[];
  address: {
    street: string | undefined;
    city: string | undefined;
    zip: number;
  };
}

export interface EditMerchant {
  name: string,
  shopName: string,
  address: {
    street: string,
    city: string,
    zip: number
  },
  contact: string[]
}

// API methods

// Kalam
const fetchKalamsData = async () => {
  try {
    const response = await apiClient.get("/loan/getLoans");
    return response.data;
  } catch (error) {
    console.error("Error fetching Kalams data:", error);
    throw error;
  }
};

const AddKalamsData = async (KalamData: AddKalam) => {

  try {
    const response = await apiClient.post("/loan/addLoan",
      KalamData
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Kalams data:", error);
    throw error;
  }

};

const updateLoan = async (_id: string, editLoan: EditLoan) => {
  try {
    const response = await apiClient.patch(`/loan/updateLoan/${_id}`, editLoan)
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

const deleteLoan = async (_id: string) => {
  try {
    const response = await apiClient.delete(`/loan/deleteLoan/${_id}`)
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}


//Customer 
const fetchCustomerData = async () => {
  try {
    const response = await apiClient.get("/customer/getCustomers");
    return response.data;
  } catch (error) {
    console.error("Error fetching Kalams data:", error);
    throw error;
  }
};


const AddCustomerData = async (CustomerData: Customer) => {

  try {
    const response = await apiClient.post("/customer/addCustomer",
      CustomerData
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Kalams data:", error);
    throw error;
  }
};

const searchCustomer = async (name: string, contact: string[]) => {
  try {
    const response = await apiClient.post("/customer/search", { name, contact });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

const updateCustomer = async (_id: string, updateCustomer: EditCustomer) => {
  try {
    const response = await apiClient.patch(`/customer/updateCustomer/${_id}`, updateCustomer)
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

const deleteCustomer = async (_id: string) => {
  try {
    const response = await apiClient.delete(`/customer/deleteCustomer/${_id}`)
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

// Merchant
const AddMerchantData = async (MerchantData: AddMerchant) => {

  try {
    const response = await apiClient.post("/merchant/addMerchant",
      MerchantData
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching Kalams data:", error);
    throw error;
  }
};

const searchMerchant = async (name: string, contact: string[]) => {
  try {
    const response = await apiClient.post("/merchant/searchMerchant", { name, contact });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

const updateMerchant = async (_id: string, editMerchant: EditMerchant) => {
  try {
    const response = await apiClient.patch(`/merchant/updateMerchant/${_id}`, editMerchant)
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

// Export the API methods
export default {
  // Kalam API
  fetchKalamsData,
  AddKalamsData,
  updateLoan,
  deleteLoan,
  // Customer API
  fetchCustomerData,
  AddCustomerData,
  updateCustomer,
  deleteCustomer,
  searchCustomer,
  // Merchant API
  searchMerchant,
  AddMerchantData,
  updateMerchant
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);
