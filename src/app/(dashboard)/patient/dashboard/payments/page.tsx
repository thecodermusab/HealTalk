"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CreditCard, Calendar, Clock, CheckCircle, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Payment {
  id: string;
  psychologistName: string;
  date: Date;
  duration: number;
  amount: number;
  status: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/appointments?status=COMPLETED");
        if (!res.ok) throw new Error("Failed to fetch payment history");

        const appointments = await res.json();

        const paymentHistory = appointments.map((apt: any) => ({
          id: apt.id,
          psychologistName: apt.psychologist?.user?.name || "Psychologist",
          date: new Date(apt.startTime),
          duration: apt.duration,
          amount: apt.price / 100, // Convert cents to dollars
          status: apt.status,
        }));

        setPayments(paymentHistory);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Payment History</h1>
          <p className="text-gray-500">View your completed sessions and payments</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 bg-white border border-dashed border-gray-200 rounded-[24px]">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white border border-red-200 rounded-[24px]">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-[24px]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No payments yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Payment history will appear here after your sessions are completed.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[24px] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Spent</p>
                  <h2 className="text-4xl font-bold">${totalSpent.toFixed(2)}</h2>
                  <p className="text-blue-100 text-sm mt-2">
                    {payments.length} session{payments.length !== 1 ? "s" : ""} completed
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <CreditCard size={32} />
                </div>
              </div>
            </div>

            {/* Payment List */}
            <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Session Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Calendar size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {payment.psychologistName}
                              </p>
                              <p className="text-xs text-gray-500">Psychology Session</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {payment.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <Clock size={14} className="text-gray-400" />
                            {payment.duration} min
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            ${payment.amount.toFixed(2)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                            <CheckCircle size={12} />
                            Paid
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Download size={14} className="mr-1" />
                            Receipt
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
