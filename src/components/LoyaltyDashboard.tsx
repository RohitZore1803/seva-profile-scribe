
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Trophy, Gift, TrendingUp } from "lucide-react";
import { LoyaltyProgram, PointTransaction } from "@/hooks/useLoyaltyProgram";

interface LoyaltyDashboardProps {
  loyaltyProgram: LoyaltyProgram;
  transactions: PointTransaction[];
}

export default function LoyaltyDashboard({ loyaltyProgram, transactions }: LoyaltyDashboardProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-purple-100 text-purple-800";
      case "gold":
        return "bg-yellow-100 text-yellow-800";
      case "silver":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const getNextTierPoints = (currentTier: string) => {
    switch (currentTier) {
      case "bronze":
        return 1000;
      case "silver":
        return 5000;
      case "gold":
        return 10000;
      default:
        return 0;
    }
  };

  const nextTierPoints = getNextTierPoints(loyaltyProgram.tier_level);
  const progressPercentage = nextTierPoints > 0 
    ? (loyaltyProgram.total_points_earned / nextTierPoints) * 100 
    : 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Balance</CardTitle>
            <Star className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {loyaltyProgram.points_balance}
            </div>
            <p className="text-xs text-muted-foreground">
              Available to redeem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
            <Trophy className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <Badge className={getTierColor(loyaltyProgram.tier_level)}>
              {loyaltyProgram.tier_level.toUpperCase()}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Total earned: {loyaltyProgram.total_points_earned}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Redeemed</CardTitle>
            <Gift className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loyaltyProgram.total_points_redeemed}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime redemptions
            </p>
          </CardContent>
        </Card>
      </div>

      {nextTierPoints > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progress to Next Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current: {loyaltyProgram.total_points_earned} points</span>
                <span>Next tier: {nextTierPoints} points</span>
              </div>
              <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.max(0, nextTierPoints - loyaltyProgram.total_points_earned)} points needed for next tier
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{transaction.description || transaction.source}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.transaction_type} • {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge 
                  variant={transaction.transaction_type === "earned" ? "default" : "destructive"}
                  className={transaction.transaction_type === "earned" ? "bg-green-100 text-green-800" : ""}
                >
                  {transaction.transaction_type === "earned" ? "+" : "-"}{transaction.points}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
