"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Building, Plus, Edit, Trash2, MapPin, Users, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HospitalsManagementPage() {
  const handleAddHospital = () => {
    console.log("Add hospital clicked");
  };

  const handleEdit = (id: number) => {
    console.log("Edit hospital", id);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Delete this hospital?");
    if (!confirmed) {
      return;
    }
    console.log("Delete hospital", id);
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
      phone: "+90 212 555 1234"
    },
    {
      id: 2,
      name: "Memorial Hospital",
      location: "Istanbul",
      address: "Piyalepaşa Bulvarı, Okmeydanı",
      psychologists: 8,
      status: "active",
      joinedDate: "Mar 2024",
      phone: "+90 212 555 5678"
    },
    {
      id: 3,
      name: "Acıbadem Ankara",
      location: "Ankara",
      address: "Kızılay Mahallesi, Atatürk Bulvarı",
      psychologists: 6,
      status: "active",
      joinedDate: "Jun 2024",
      phone: "+90 312 555 9012"
    },
    {
      id: 4,
      name: "Memorial Ankara",
      location: "Ankara",
      address: "Çankaya, Tahran Caddesi",
      psychologists: 5,
      status: "active",
      joinedDate: "Yesterday",
      phone: "+90 312 555 3456"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Hospital Management
            </h1>
            <p className="text-gray-500">Manage partner hospitals and medical centers</p>
          </div>
          <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0] shadow-blue-500/20" onClick={handleAddHospital}>
            <Plus size={18} className="mr-2" />
            Add Hospital
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center">
                <Building className="text-[#5B6CFF]" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{hospitals.length}</div>
                <div className="text-sm text-gray-500 font-medium">Total Hospitals</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-[#E6F8F3] rounded-xl flex items-center justify-center">
                <MapPin className="text-[#20C997]" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-500 font-medium">Cities Covered</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-[#FFF5EB] rounded-xl flex items-center justify-center">
                <Users className="text-[#FF9F43]" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {hospitals.reduce((sum, h) => sum + h.psychologists, 0)}
                </div>
                <div className="text-sm text-gray-500 font-medium">Total Psychologists</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hospitals List */}
        <div className="space-y-4">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 hover:shadow-[0_8px_24px_rgba(17,24,39,0.04)] hover:border-[#5B6CFF] transition-all group"
            >
              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-[#F4F7FF] rounded-[16px] flex items-center justify-center flex-shrink-0 border border-blue-50/50">
                    <Building className="text-[#5B6CFF]" size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{hospital.name}</h3>
                      <span className="px-2.5 py-0.5 bg-[#E6F8F3] text-[#20C997] text-[10px] font-bold uppercase tracking-wide rounded-full">
                        {hospital.status}
                      </span>
                      {hospital.joinedDate === "Yesterday" && (
                        <span className="px-2.5 py-0.5 bg-[#FFF5EB] text-[#FF9F43] text-[10px] font-bold uppercase tracking-wide rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-gray-400" />
                            {hospital.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Phone size={14} className="text-gray-400" />
                            {hospital.phone}
                        </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg inline-block border border-gray-100">
                        <span className="font-semibold text-gray-700">Address:</span> {hospital.address}
                    </p>

                    <div className="flex items-center gap-6 text-sm border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-[#5B6CFF]" />
                        <span className="text-gray-500">Psychologists: </span>
                        <span className="font-bold text-gray-900">{hospital.psychologists}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Joined: </span>
                        <span className="font-medium text-gray-900">{hospital.joinedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(hospital.id)} className="border-gray-200 hover:bg-gray-50 text-gray-600">
                    <Edit size={14} className="mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(hospital.id)}
                  >
                    <Trash2 size={14} className="mr-1.5" />
                    Delete
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#5B6CFF] hover:text-[#4a5ae0] hover:bg-[#EEF0FF]">
                     Details <ArrowRight size={14} className="ml-1" />
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
