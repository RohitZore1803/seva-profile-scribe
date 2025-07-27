import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Trophy, ShoppingCart } from "lucide-react";
import { useLoyaltyProgram } from "@/hooks/useLoyaltyProgram";
import LoyaltyDashboard from "@/components/LoyaltyDashboard";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import PaymentModal from "@/components/PaymentModal";
import { toast } from "@/hooks/use-toast";

export default function Loyalty() {
  const { loyaltyProgram, transactions, loading } = useLoyaltyProgram();
  const { plans } = useSubscriptions();
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    planId: string;
    amount: number;
    title: string;
  }>({ open: false, planId: '', amount: 0, title: '' });

  const handleSubscribe = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setPaymentModal({
        open: true,
        planId: planId,
        amount: plan.price_monthly,
        title: `${plan.name} Subscription`,
      });
    }
  };

  const handlePaymentComplete = () => {
    setPaymentModal({ open: false, planId: '', amount: 0, title: '' });
    toast({
      title: "Subscription Activated",
      description: "Your subscription has been successfully activated!",
    });
  };

  const rewardItems = [
    {
      id: 1,
      title: "Free Pooja Booking",
      description: "Get one free pooja booking",
      points: 500,
      type: "service",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Premium Consultation",
      description: "30-minute premium astrology consultation",
      points: 1000,
      type: "consultation",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Spiritual Book",
      description: "Digital copy of spiritual teachings",
      points: 300,
      type: "digital",
      image: "/placeholder.svg",
    },
    {
      id: 4,
      title: "Sacred Items Kit",
      description: "Collection of blessed spiritual items",
      points: 2000,
      type: "physical",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-orange-800 mb-2">Loyalty & Rewards</h1>
            <p className="text-orange-600">Earn points and enjoy exclusive benefits</p>
          </div>

          {loyaltyProgram && (
            <div className="mb-8">
              <LoyaltyDashboard loyaltyProgram={loyaltyProgram} transactions={transactions} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-orange-600" />
                    Rewards Catalog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rewardItems.map((item) => (
                      <Card key={item.id} className="border hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Gift className="w-8 h-8 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{item.title}</h3>
                              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                              <div className="flex items-center justify-between mt-3">
                                <Badge variant="outline" className="text-xs">
                                  {item.points} points
                                </Badge>
                                <Button
                                  size="sm"
                                  disabled={!loyaltyProgram || loyaltyProgram.points_balance < item.points}
                                  className="bg-orange-600 hover:bg-orange-700 text-xs"
                                >
                                  <ShoppingCart className="w-3 h-3 mr-1" />
                                  Redeem
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-600" />
                    How to Earn Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">+50</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Book a Service</p>
                        <p className="text-xs text-gray-600">Earn 50 points per booking</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">+100</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Complete Service</p>
                        <p className="text-xs text-gray-600">Earn 100 points after completion</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">+25</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Refer Friends</p>
                        <p className="text-xs text-gray-600">Earn 25 points per referral</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">+200</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Monthly Subscription</p>
                        <p className="text-xs text-gray-600">Earn 200 points monthly</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-orange-800 mb-6">Subscription Plans</h2>
            <SubscriptionPlans
              plans={plans}
              onSubscribe={handleSubscribe}
              loading={loading}
            />
          </div>

          <PaymentModal
            open={paymentModal.open}
            onClose={() => setPaymentModal({ open: false, planId: '', amount: 0, title: '' })}
            amount={paymentModal.amount}
            title={paymentModal.title}
            description="Monthly subscription plan"
          />
        </div>
      </div>
    </div>
  );
}
