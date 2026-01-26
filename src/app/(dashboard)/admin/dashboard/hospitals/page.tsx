"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Building, Plus, Edit, Trash2, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HospitalsManagementPage() {
  const handleAddHospital = () => {
    console.log("Add hospital clicked");
    alert("Add hospital (placeholder).");
  };

  const handleEdit = (id: number) => {
    console.log("Edit hospital", id);
    alert(`Edit hospital ${id} (placeholder).`);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Delete this hospital?");
    if (!confirmed) {
      return;
    }
    console.log("Delete hospital", id);
    alert(`Deleted hospital ${id} (placeholder).`);
  };

  const hospitals = [
    {
      id: 1,
      name: "Acıbadem Hospital",
      location: "Istanbul",
      address: "Teşvikiye Mahallesi, Güzelbahçe Sk. No:20",
      psychologists: 12,
      status: "active",
      joinedDate: "Jan 2024",
    },
    {
      id: 2,
      name: "Memorial Hospital",
      location: "Istanbul",
      address: "Piyalepaşa Bulvarı, Okmeydanı",
      psychologists: 8,
      status: "active",
      joinedDate: "Mar 2024",
    },
    {
      id: 3,
      name: "Acıbadem Ankara",
      location: "Ankara",
      address: "Kızılay Mahallesi, Atatürk Bulvarı",
      psychologists: 6,
      status: "active",
      joinedDate: "Jun 2024",
    },
    {
      id: 4,
      name: "Memorial Ankara",
      location: "Ankara",
      address: "Çankaya, Tahran Caddesi",
      psychologists: 5,
      status: "active",
      joinedDate: "Yesterday",
    },
  ];

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Hospital Management
            </h1>
            <p className="text-text-secondary">Manage partner hospitals and medical centers</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleAddHospital}>
            <Plus size={18} className="mr-2" />
            Add Hospital
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building className="text-primary" size={20} />
              </div>
              <div className="text-2xl font-bold text-foreground">{hospitals.length}</div>
            </div>
            <div className="text-sm text-text-secondary">Total Hospitals</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <MapPin className="text-secondary" size={20} />
              </div>
              <div className="text-2xl font-bold text-foreground">3</div>
            </div>
            <div className="text-sm text-text-secondary">Cities Covered</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="text-accent" size={20} />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {hospitals.reduce((sum, h) => sum + h.psychologists, 0)}
              </div>
            </div>
            <div className="text-sm text-text-secondary">Total Psychologists</div>
          </div>
        </div>

        {/* Hospitals List */}
        <div className="space-y-4">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="text-primary" size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-foreground">{hospital.name}</h3>
                      <span className="px-2 py-1 bg-success/10 text-success text-xs font-semibold rounded">
                        {hospital.status}
                      </span>
                      {hospital.joinedDate === "Yesterday" && (
                        <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-semibold rounded">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                      <MapPin size={14} />
                      <span>{hospital.location}</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">{hospital.address}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-text-secondary">Psychologists: </span>
                        <span className="font-semibold text-foreground">{hospital.psychologists}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary">Joined: </span>
                        <span className="text-text-secondary">{hospital.joinedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(hospital.id)}>
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() => handleDelete(hospital.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
