import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Calendar, Users, DollarSign, Clock, TrendingUp, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PsychologistDashboardHome() {
  const todayStats = {
    appointments: 5,
    patients: 3,
    earnings: 2250,
    hours: 5,
  };

  const nextAppointment = {
    patient: "John D.",
    time: "2:00 PM - 3:00 PM",
    type: "Video Consultation",
    isNew: false,
  };

  const recentPatients = [
    { id: 1, name: "John D.", lastSession: "Today", status: "active" },
    { id: 2, name: "Sarah M.", lastSession: "Yesterday", status: "active" },
    { id: 3, name: "Michael K.", lastSession: "2 days ago", status: "active" },
  ];

  const weeklyStats = [
    { day: "Mon", appointments: 4 },
    { day: "Tue", appointments: 5 },
    { day: "Wed", appointments: 6 },
    { day: "Thu", appointments: 5 },
    { day: "Fri", appointments: 4 },
    { day: "Sat", appointments: 2 },
    { day: "Sun", appointments: 0 },
  ];

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, Dr. Yılmaz!
          </h1>
          <p className="text-text-secondary">Here's your practice overview for today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="text-primary" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {todayStats.appointments}
            </div>
            <div className="text-sm text-text-secondary">Today's Appointments</div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Users className="text-secondary" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {todayStats.patients}
            </div>
            <div className="text-sm text-text-secondary">Patients Today</div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-success" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              ₺{todayStats.earnings}
            </div>
            <div className="text-sm text-text-secondary">Today's Earnings</div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Clock className="text-accent" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {todayStats.hours}h
            </div>
            <div className="text-sm text-text-secondary">Hours Today</div>
          </div>
        </div>

        {/* Next Appointment */}
        {nextAppointment && (
          <div className="bg-gradient-to-r from-primary via-primary/90 to-accent rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-white/80 mb-1">Next Appointment</div>
                <h3 className="text-2xl font-bold mb-3">
                  {nextAppointment.patient}
                  {nextAppointment.isNew && (
                    <span className="ml-2 px-2 py-1 bg-white/20 rounded text-xs">New Patient</span>
                  )}
                </h3>
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{nextAppointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video size={18} />
                    <span>{nextAppointment.type}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-white text-primary hover:bg-white/90">
                    Start Session
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/20">
                    View Patient Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Patients */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Recent Patients</h3>
              <Link href="/psychologist/dashboard/patients" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">{patient.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{patient.name}</div>
                      <div className="text-sm text-text-secondary">Last session: {patient.lastSession}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Overview */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">This Week</h3>
              <TrendingUp className="text-success" size={20} />
            </div>
            <div className="space-y-3">
              {weeklyStats.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className="w-12 text-sm text-text-secondary">{day.day}</span>
                  <div className="flex-1 h-8 bg-background rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-primary flex items-center justify-end pr-2"
                      style={{ width: `${(day.appointments / 6) * 100}%` }}
                    >
                      {day.appointments > 0 && (
                        <span className="text-xs font-semibold text-white">
                          {day.appointments}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border text-center">
              <div className="text-2xl font-bold text-primary">26</div>
              <div className="text-sm text-text-secondary">Total appointments this week</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
