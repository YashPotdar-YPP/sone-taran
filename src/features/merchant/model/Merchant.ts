export interface merchant {
  _id: string;
  merchant: MerchantDetails;
}

export interface MerchantDetails {
  address: Address;
  _id: string;
  merchantId: string;
  name: string;
  contact: string[]; // Assuming contact is an array of strings
  __v: number;
}

export interface Address {
  street: string;
  city: string;
  zip: string;
}