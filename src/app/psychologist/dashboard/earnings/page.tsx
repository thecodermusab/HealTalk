import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DollarSign, TrendingUp, Calendar, Download, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EarningsPage() {
  const earningsStats = {
    thisMonth: 12500,
    lastMonth: 11200,
    thisWeek: 3150,
    pending: 2250,
  };

  const recentEarnings = [
    { id: 1, patient: "John D.", date: "Jan 25", amount: 450, status: "paid" },
    { id: 2, patient: "Sarah M.", date: "Jan 25", amount: 500, status: "paid" },
    { id: 3, patient: "Michael K.", date: "Jan 24", amount: 450, status: "paid" },
    { id: 4, patient: "Emma W.", date: "Jan 24", amount: 500, status: "paid" },
    { id: 5, patient: "David L.", date: "Jan 23", amount: 450, status: "pending" },
  ];

  const monthlyBreakdown = [
    { month: "Jan", earnings: 12500 },
    { month: "Dec", earnings: 11200 },
    { month: "Nov", earnings: 10800 },
    { month: "Oct", earnings: 12000 },
    { month: "Sep", earnings: 11500 },
    { month: "Aug", earnings: 10200 },
  ];

  const percentageChange = ((earningsStats.thisMonth - earningsStats.lastMonth) / earningsStats.lastMonth * 100).toFixed(1);

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Earnings & Analytics</h1>
            <p className="text-text-secondary">Track your income and financial performance</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2" size={18} />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">This Month</span>
              <div className={`flex items-center gap-1 text-sm ${parseFloat(percentageChange) >= 0 ? 'text-success' : 'text-red-500'}`}>
                {parseFloat(percentageChange) >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {Math.abs(parseFloat(percentageChange))}%
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">₺{earningsStats.thisMonth.toLocaleString()}</div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Last Month</span>
            </div>
            <div className="text-3xl font-bold text-foreground">₺{earningsStats.lastMonth.toLocaleString()}</div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">This Week</span>
            </div>
            <div className="text-3xl font-bold text-foreground">₺{earningsStats.thisWeek.toLocaleString()}</div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Pending</span>
            </div>
            <div className="text-3xl font-bold text-primary">₺{earningsStats.pending.toLocaleString()}</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Earnings */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Recent Earnings</h3>
            <div className="space-y-3">
              {recentEarnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">{earning.patient[0]}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{earning.patient}</div>
                      <div className="text-sm text-text-secondary">{earning.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">₺{earning.amount}</div>
                    <div className={`text-xs ${earning.status === 'paid' ? 'text-success' : 'text-accent'}`}>
                      {earning.status === 'paid' ? 'Paid' : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">6-Month Overview</h3>
            <div className="space-y-4">
              {monthlyBreakdown.map((month) => (
                <div key={month.month} className="flex items-center gap-4">
                  <span className="w-12 text-sm font-medium text-text-secondary">{month.month}</span>
                  <div className="flex-1 h-10 bg-background rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent flex items-center justify-end pr-3"
                      style={{ width: `${(month.earnings / 13000) * 100}%` }}
                    >
                      <span className="text-sm font-semibold text-white">
                        ₺{month.earnings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Average */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">6-Month Average</span>
                <span className="text-xl font-bold text-primary">
                  ₺{(monthlyBreakdown.reduce((sum, m) => sum + m.earnings, 0) / monthlyBreakdown.length).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Info */}
        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="text-primary" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">Next Payout</h3>
              <p className="text-text-secondary mb-3">
                Your next payout of <strong>₺{earningsStats.pending.toLocaleString()}</strong> will be processed on <strong>February 1, 2026</strong>
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <span className="text-text-secondary">Bi-monthly payouts (1st & 15th)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
