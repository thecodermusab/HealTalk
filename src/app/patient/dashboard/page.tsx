import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Calendar, MessageCircle, Heart, Clock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PatientDashboardHome() {
  const nextAppointment = {
    psychologist: "Dr. Ahmet Yılmaz",
    date: "Tomorrow, Jan 27",
    time: "2:00 PM - 3:00 PM",
    type: "Video Consultation",
  };

  const quickActions = [
    { icon: Calendar, label: "Book Appointment", href: "/find-psychologists", color: "primary" },
    { icon: MessageCircle, label: "Send Message", href: "/patient/dashboard/messages", color: "secondary" },
    { icon: Heart, label: "View Favorites", href: "/patient/dashboard/favorites", color: "accent" },
  ];

  const upcomingAppointments = [
    { id: 1, psychologist: "Dr. Ahmet Yılmaz", date: "Tomorrow", time: "2:00 PM" },
    { id: 2, psychologist: "Dr. Ayşe Demir", date: "Jan 30", time: "4:00 PM" },
  ];

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back, John!
          </h1>
          <p className="text-text-secondary">
            Here's what's happening with your mental health journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <button className="w-full p-6 bg-white border border-border rounded-xl hover:border-primary hover:shadow-lg transition-all text-left group">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-${action.color}/10 rounded-lg flex items-center justify-center group-hover:bg-${action.color} transition-colors`}>
                    <action.icon className={`text-${action.color} group-hover:text-white transition-colors`} size={28} />
                  </div>
                  <span className="font-semibold text-foreground text-lg">
                    {action.label}
                  </span>
                </div>
              </button>
            </Link>
          ))}
        </div>

        {/* Next Appointment Card */}
        {nextAppointment && (
          <div className="bg-gradient-to-r from-primary via-primary/90 to-accent rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-white/80 mb-1">Next Appointment</div>
                <h3 className="text-2xl font-bold">{nextAppointment.psychologist}</h3>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Video size={24} />
              </div>
            </div>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{nextAppointment.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{nextAppointment.time}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-primary hover:bg-white/90">
                Join Session
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20">
                Reschedule
              </Button>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Upcoming Appointments</h3>
              <Link href="/patient/dashboard/appointments" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <div className="font-semibold text-foreground">{apt.psychologist}</div>
                    <div className="text-sm text-text-secondary">{apt.date} at {apt.time}</div>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="text-primary" size={16} />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">New message from Dr. Ahmet</div>
                  <div className="text-xs text-text-secondary">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-success" size={16} />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Appointment confirmed</div>
                  <div className="text-xs text-text-secondary">Yesterday</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="text-accent" size={16} />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Added Dr. Ayşe to favorites</div>
                  <div className="text-xs text-text-secondary">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
