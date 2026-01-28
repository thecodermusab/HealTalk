"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CreditCard, Download, Calendar, CheckCircle, Plus, Wallet } from "lucide-react";
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
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Payments</h1>
          <p className="text-gray-500">Manage your payment methods and history</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: Upcoming + Methods */}
            <div className="xl:col-span-2 space-y-6">
                
                {/* Upcoming Payment Gradient Card */}
                {upcomingPayment && (
                  <div className="bg-gradient-to-r from-[#5B6CFF] to-[#8090FF] rounded-[16px] p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/20">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2" />
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                      <div>
                        <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-1">
                            <Wallet size={16} /> Upcoming Payment
                        </div>
                        <h3 className="text-2xl font-bold mb-1">
                          {upcomingPayment.psychologist}
                        </h3>
                        <div className="flex items-center gap-3 text-white/90 text-sm">
                           <span className="bg-white/20 px-2 py-0.5 rounded text-xs backdrop-blur-sm">Session Fee</span>
                           <span>•</span>
                           <span className="flex items-center gap-1"><Calendar size={14} /> {upcomingPayment.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="text-3xl font-bold">₺{upcomingPayment.amount}</div>
                         <Button className="bg-white text-[#5B6CFF] hover:bg-white/90 border-0 font-bold shadow-sm">
                            Pay Now
                         </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Methods */}
                <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Payment Methods</h2>
                    <Button variant="outline" size="sm" className="gap-2 border-[#E6EAF2] text-gray-700">
                      <Plus size={16} /> Add Card
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-4 bg-gray-50 border border-[#E6EAF2] rounded-xl hover:bg-white hover:border-[#5B6CFF] hover:shadow-md transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white border border-[#E6EAF2] rounded-xl flex items-center justify-center shadow-sm">
                            <CreditCard className="text-[#5B6CFF]" size={24} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                              {method.type} •••• {method.last4}
                              {method.isDefault && (
                                <span className="px-2 py-0.5 bg-[#E6F8F3] text-[#20C997] text-[10px] font-bold rounded-full uppercase tracking-wide">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 font-medium">Expires {method.expiry}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!method.isDefault && (
                            <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-[#5B6CFF]">
                              Set Default
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Payment History */}
            <div className="xl:col-span-1">
               <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-full">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Payment History</h2>

                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-[#E6F8F3] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <CheckCircle className="text-[#20C997]" size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <div className="font-semibold text-gray-900 truncate pr-2">{payment.psychologist}</div>
                                <div className="font-bold text-gray-900">₺{payment.amount}</div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>{payment.date}</span>
                                <button className="flex items-center gap-1 text-[#5B6CFF] hover:underline">
                                    <Download size={12} /> Invoice
                                </button>
                            </div>
                            <div className="text-[10px] text-gray-300 mt-1 font-mono">{payment.invoice}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-start justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                       <div>
                           <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Spent (Jan)</p>
                           <p className="text-2xl font-bold text-[#5B6CFF]">₺{paymentHistory.reduce((sum, p) => sum + p.amount, 0)}</p>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100">
                          <Wallet size={16} className="text-gray-400" />
                       </div>
                    </div>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
