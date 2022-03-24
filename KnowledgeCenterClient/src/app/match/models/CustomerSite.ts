import {Customer} from './Customer';

export interface CustomerSite {
  id: number;
  name: string;
  address: string;
  contact: string;
  customerId: number;
  customer: Customer;
}
