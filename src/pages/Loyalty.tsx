import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Trophy, ShoppingCart, Crown, Heart, Book, Users, Calendar, Award } from "lucide-react";

export default function Loyalty() {
  const [paymentModal, setPaymentModal] = useState({
    open: false,
    booking: null
  });

  // Mock data for demonstration
  const loyaltyProgram = {
    points_balance: 700,
    tier: "Gold",
    tier_progress: 75,
    next_tier: "Platinum",
    points_to_next_tier: 250
  };

  const transactions = [
    { id: 1, type: "earned", points: 100, description: "Pooja booking completed", date: "2024-01-15" },
    { id: 2, type: "earned", points: 50, description: "Service booking", date: "2024-01-10" },
    { id: 3, type: "redeemed", points: -300, description: "Digital book redeemed", date: "2024-01-05" }
  ];

  const handleSubscribe = async (planId) => {
    console.log(`Subscribing to plan: ${planId}`);
  };

  const rewardItems = [
    {
      id: 1,
      title: "Free Pooja Booking",
      description: "Get one complimentary pooja booking of your choice",
      points: 500,
      type: "service",
      icon: Heart,
    },
    {
      id: 2,
      title: "Premium Astrology Consultation",
      description: "30-minute premium astrology consultation with expert",
      points: 1000,
      type: "consultation",
      icon: Star,
    },
    {
      id: 3,
      title: "Sacred Mantras Collection",
      description: "Digital collection of powerful mantras and teachings",
      points: 300,
      type: "digital",
      icon: Book,
    },
    {
      id: 4,
      title: "Blessed Items Kit",
      description: "Collection of blessed spiritual items for worship",
      points: 2000,
      type: "physical",
      icon: Gift,
    }
  ];

  const subscriptionPlans = [
    {
      id: 1,
      name: "Devotee",
      price_monthly: 199,
      features: ["2 Free Bookings/month", "Basic Support", "Monthly Newsletter", "Community Access"],
      popular: false
    },
    {
      id: 2,
      name: "Seeker",
      price_monthly: 499,
      features: ["5 Free Bookings/month", "Priority Support", "Exclusive Content", "Monthly Consultation"],
      popular: true
    },
    {
      id: 3,
      name: "Enlightened",
      price_monthly: 999,
      features: ["Unlimited Bookings", "24/7 Support", "Personal Guide", "Premium Events"],
      popular: false
    }
  ];

  const tiers = [
    { name: "Bronze", min_points: 0, icon: Award },
    { name: "Silver", min_points: 500, icon: Star },
    { name: "Gold", min_points: 1000, icon: Trophy },
    { name: "Platinum", min_points: 2000, icon: Crown }
  ];

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-orange-800 mb-2">Loyalty & Rewards</h1>
            <p className="text-orange-600">Earn points and enjoy spiritual benefits with every service</p>
          </div>

          {/* Loyalty Dashboard and Tiers */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Membership Tiers - Left Side */}
              <div>
                <h2 className="text-xl font-bold text-orange-800 mb-4">Membership Tiers</h2>
                <div className="flex flex-wrap gap-2">
                  {tiers.map((tier) => {
                    const Icon = tier.icon;
                    const isCurrentTier = tier.name === loyaltyProgram.tier;
                    return (
                      <Card 
                        key={tier.name} 
                        className={`inline-flex ${isCurrentTier ? 'ring-2 ring-orange-400 bg-orange-50' : ''}`}
                      >
                        <CardContent className="p-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                              <Icon className="w-3 h-3 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-orange-800 text-sm">{tier.name}</h3>
                              <p className="text-xs text-orange-600">{tier.min_points}+</p>
                            </div>
                            {isCurrentTier && (
                              <Badge className="bg-orange-600 hover:bg-orange-700 text-xs ml-1">Current</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Loyalty Dashboard - Right Side */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-orange-800 mb-4">Your Progress</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Points Balance */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-800 mb-1">
                          {loyaltyProgram.points_balance.toLocaleString()}
                        </div>
                        <div className="text-orange-600 text-sm">Available Points</div>
                      </div>

                      {/* Current Tier */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Trophy className="w-6 h-6 mr-2 text-orange-600" />
                          <span className="text-xl font-bold text-orange-800">{loyaltyProgram.tier}</span>
                        </div>
                        <div className="text-orange-600 text-sm">Current Tier</div>
                      </div>

                      {/* Progress to Next Tier */}
                      <div className="text-center">
                        <div className="mb-2">
                          <div className="text-lg font-semibold text-orange-800">Next: {loyaltyProgram.next_tier}</div>
                          <div className="text-sm text-orange-600">{loyaltyProgram.points_to_next_tier} points needed</div>
                        </div>
                        <div className="w-full bg-orange-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: `${loyaltyProgram.tier_progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rewards Catalog */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Gift className="w-5 h-5 text-orange-600" />
                    Rewards Catalog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rewardItems.map((item) => {
                      const Icon = item.icon;
                      const canRedeem = loyaltyProgram.points_balance >= item.points;
                      
                      return (
                        <Card key={item.id} className="border hover:shadow-md">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Icon className="w-7 h-7 text-orange-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-orange-800 mb-1">{item.title}</h3>
                                <p className="text-sm text-orange-600 mb-3">{item.description}</p>
                                
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs">
                                    {item.points} points
                                  </Badge>
                                  <Button
                                    size="sm"
                                    disabled={!canRedeem}
                                    className={`text-xs ${
                                      canRedeem 
                                        ? 'bg-orange-600 hover:bg-orange-700' 
                                        : 'bg-gray-300'
                                    }`}
                                  >
                                    <ShoppingCart className="w-3 h-3 mr-1" />
                                    {canRedeem ? 'Redeem' : 'Need More'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* How to Earn Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Star className="w-5 h-5 text-orange-600" />
                    How to Earn Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">+50</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-orange-800">Book a Service</p>
                        <p className="text-xs text-orange-600">Earn 50 points per booking</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">+100</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-orange-800">Complete Service</p>
                        <p className="text-xs text-orange-600">Earn 100 points after completion</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">+25</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-orange-800">Refer Friends</p>
                        <p className="text-xs text-orange-600">Earn 25 points per referral</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">+200</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-orange-800">Monthly Subscription</p>
                        <p className="text-xs text-orange-600">Earn 200 points monthly</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Award className="w-5 h-5 text-orange-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-orange-800">{transaction.description}</p>
                          <p className="text-xs text-orange-600">{transaction.date}</p>
                        </div>
                        <span className={`font-semibold text-sm ${
                          transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'earned' ? '+' : ''}{transaction.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-orange-800 mb-6">Subscription Plans</h2>
            <div className="flex flex-wrap gap-4 justify-start">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className={`w-64 ${plan.popular ? 'ring-2 ring-orange-400 relative' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-orange-600 hover:bg-orange-700 text-xs">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-orange-600" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-orange-800 mb-2">{plan.name}</h3>
                    <div className="text-xl font-bold text-orange-600 mb-3">
                      ₹{plan.price_monthly}
                      <span className="text-sm font-normal text-orange-600">/mo</span>
                    </div>
                    
                    <ul className="space-y-1 mb-4 text-left">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs">
                          <Star className="w-3 h-3 text-orange-500 flex-shrink-0" />
                          <span className="text-orange-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      size="sm"
                      className="w-full bg-orange-600 hover:bg-orange-700 text-sm"
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
