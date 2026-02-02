"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Payments</h1>
          <p className="text-gray-500">Manage your payment methods and history</p>
        </div>

        <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-[24px]">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No payments yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Payment history will appear once paid appointments are available.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
