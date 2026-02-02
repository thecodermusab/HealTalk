"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { MessageThread } from "@/components/messages/MessageThread";

export default function PatientMessagesPage() {
  const searchParams = useSearchParams();
  const appointmentId =
    searchParams.get("appointmentId") || searchParams.get("chatId") || "";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Messages</h1>
          <p className="text-gray-500">Secure conversations with your psychologist</p>
        </div>

        {appointmentId ? (
          <MessageThread appointmentId={appointmentId} />
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-[24px] p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No conversation selected</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Open a chat from an appointment to start messaging.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
