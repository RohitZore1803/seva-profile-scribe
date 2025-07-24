
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { SubscriptionPlan } from "@/hooks/useSubscriptions";

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  onSubscribe: (planId: string) => void;
  loading?: boolean;
}

export default function SubscriptionPlans({ plans, onSubscribe, loading }: SubscriptionPlansProps) {
  const formatPrice = (price: number) => {
    return `₹${price}`;
  };

  const getFeaturesList = (features: any) => {
    if (Array.isArray(features)) {
      return features;
    }
    if (typeof features === 'object' && features !== null) {
      return Object.values(features);
    }
    return [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className={`relative ${plan.name === 'Premium' ? 'border-orange-200 shadow-lg' : ''}`}>
          {plan.name === 'Premium' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-orange-600 text-white">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
          )}
          
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">
                {formatPrice(plan.price_monthly)}
                <span className="text-sm text-gray-600 font-normal">/month</span>
              </div>
              {plan.price_yearly && (
                <div className="text-sm text-gray-600">
                  or {formatPrice(plan.price_yearly)}/year
                </div>
              )}
            </div>
            {plan.description && (
              <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {getFeaturesList(plan.features).map((feature: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button
              onClick={() => onSubscribe(plan.id)}
              disabled={loading}
              className={`w-full ${
                plan.name === 'Premium' 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {loading ? "Processing..." : "Subscribe"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
