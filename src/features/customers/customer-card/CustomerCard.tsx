import ExpandableCustomerCard from '../../../shared/components/expandable-card/ExpandableCard-Customer/ExpandableCustomerCard';
import { CustomerProps } from '../models/CustomerProps';

export default function CustomerCard(props: CustomerProps) {
  const { data } = props;
  console.log('data ', data);
  return <ExpandableCustomerCard />;
}
