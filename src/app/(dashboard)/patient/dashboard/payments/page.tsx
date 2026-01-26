import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CreditCard, Download, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentsPage() {
  const paymentMethods = [
    { id: 1, type: "Visa", last4: "4242", expiry: "12/25", isDefault: true },
    { id: 2, type: "Mastercard", last4: "8888", expiry: "09/24", isDefault: false },
  ];

  const paymentHistory = [
    {
      id: 1,
      psychologist: "Dr. Ahmet Yılmaz",
      date: "Jan 20, 2026",
      amount: 450,
      status: "paid",
      invoice: "INV-2026-001",
    },
    {
      id: 2,
      psychologist: "Dr. Ayşe Demir",
      date: "Jan 15, 2026",
      amount: 500,
      status: "paid",
      invoice: "INV-2026-002",
    },
    {
      id: 3,
      psychologist: "Dr. Ahmet Yılmaz",
      date: "Jan 10, 2026",
      amount: 450,
      status: "paid",
      invoice: "INV-2026-003",
    },
  ];

  const upcomingPayment = {
    psychologist: "Dr. Ahmet Yılmaz",
    date: "Tomorrow, Jan 27, 2026",
    amount: 450,
  };

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Payments</h1>
          <p className="text-text-secondary">Manage your payment methods and history</p>
        </div>

        {/* Upcoming Payment */}
        {upcomingPayment && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-primary font-semibold mb-1">Upcoming Payment</div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {upcomingPayment.psychologist}
                </h3>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {upcomingPayment.date}
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    ₺{upcomingPayment.amount}
                  </div>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                Pay Now
              </Button>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Payment Methods</h2>
            <Button variant="outline" size="sm">
              + Add Card
            </Button>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-primary" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {method.type} •••• {method.last4}
                    </div>
                    <div className="text-sm text-text-secondary">Expires {method.expiry}</div>
                  </div>
                  {method.isDefault && (
                    <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button variant="ghost" size="sm">
                      Set Default
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-primary">
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Payment History</h2>

          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-success" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      {payment.psychologist}
                    </div>
                    <div className="text-sm text-text-secondary">{payment.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">₺{payment.amount}</div>
                    <div className="text-xs text-text-secondary">{payment.invoice}</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-4">
                  <Download size={16} className="mr-1" />
                  Invoice
                </Button>
              </div>
            ))}
          </div>

          {/* Total Spent */}
          <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
            <span className="text-text-secondary">Total Spent This Month</span>
            <span className="text-2xl font-bold text-foreground">
              ₺{paymentHistory.reduce((sum, p) => sum + p.amount, 0)}
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
