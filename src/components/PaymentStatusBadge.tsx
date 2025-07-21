
import { Badge } from "@/components/ui/badge";

interface PaymentStatusBadgeProps {
  status: string | null;
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge variant="secondary" className={getStatusColor(status)}>
      {status?.toUpperCase() || 'UNKNOWN'}
    </Badge>
  );
}
