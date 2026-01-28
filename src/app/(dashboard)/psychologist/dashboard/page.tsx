import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { KPIGrid } from "@/components/dashboard/home/KPIGrid";
import { PatientsOverviewChart } from "@/components/dashboard/home/PatientsOverviewChart";
import { UpcomingAppointments } from "@/components/dashboard/home/UpcomingAppointmentsCard";
import { AppointmentRequests } from "@/components/dashboard/home/AppointmentRequests";

export default function PsychologistDashboardHome() {
  return (
    <DashboardLayout>
       <div className="flex flex-col xl:flex-row gap-6">
          {/* Left Column (Wider ~ 70%) */}
          <div className="flex-1 space-y-6 min-w-0">
             {/* 1. KPI Cards Grid */}
             <KPIGrid />
             
             {/* 2. Upcoming Appointments (Wide Table) */}
             <UpcomingAppointments />
          </div>

          {/* Right Column (Narrow ~ 30%) */}
          <div className="w-full xl:w-[380px] space-y-6 flex flex-col">
             {/* 3. Patients Overview Chart */}
             <div className="h-[340px]">
                <PatientsOverviewChart />
             </div>

             {/* 4. Appointment Requests */}
             <div className="flex-1 min-h-[400px]">
                <AppointmentRequests />
             </div>
          </div>
       </div>
    </DashboardLayout>
  );
}
