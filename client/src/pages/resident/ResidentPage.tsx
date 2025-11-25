import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Resident, Gender } from "../../types";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowLeft,
  Users,
  CreditCard,
  X,
  Eye,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";

interface ResidentPageProps {
  filterHouseholdId?: string | null;
  onBack?: () => void;
}

export const ResidentPage: React.FC<ResidentPageProps> = ({
  filterHouseholdId,
  onBack,
}) => {
  const { residents, households, addResident, editResident, deleteResident } =
    useAppContext();
  const [searchTerm, setSearchTerm] = useState("");

  // State for Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Resident | null>(null);
  const [formData, setFormData] = useState<Partial<Resident>>({});

  // State for View Details Modal
  const [viewingItem, setViewingItem] = useState<Resident | null>(null);

  const filteredResidents = residents.filter((r) => {
    const matchesFilter = filterHouseholdId
      ? r.householdId === filterHouseholdId
      : true;
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.idCardNumber && r.idCardNumber.includes(searchTerm)) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeHousehold = filterHouseholdId
    ? households.find((h) => h.id === filterHouseholdId)
    : null;

  const handleOpenModal = (item?: Resident) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        id: `R${Date.now()}`, // Internal ID
        householdId: filterHouseholdId || households[0]?.id || "",
        ethnicity: "Kinh",
        gender: "Nam",
        relationshipToHead: "Thành viên",
        hometown: "",
        registrationDate: new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      editResident({ ...editingItem, ...formData } as Resident);
    } else {
      addResident(formData as Resident);
    }
    setIsModalOpen(false);
  };

  const getHouseholdInfo = (id: string) => households.find((h) => h.id === id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              title="Quay lại danh sách hộ"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              {activeHousehold
                ? `Nhân khẩu hộ: ${activeHousehold.ownerName}`
                : "Quản lý Nhân khẩu"}
            </h2>
            {activeHousehold ? (
              <p className="text-slate-500 text-sm flex items-center mt-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-mono mr-2">
                  {activeHousehold.id}
                </span>
                {activeHousehold.houseNumber}, {activeHousehold.street},{" "}
                {activeHousehold.ward}
              </p>
            ) : (
              <p className="text-slate-500 text-sm">
                Quản lý thông tin nhân khẩu, CMND/CCCD
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Thêm nhân khẩu
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm theo tên, CCCD..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Họ và tên</th>
                <th className="px-6 py-4">Giới tính</th>
                <th className="px-6 py-4">Ngày sinh</th>
                <th className="px-6 py-4">CCCD/CMND</th>
                <th className="px-6 py-4">Quan hệ</th>
                {!filterHouseholdId && <th className="px-6 py-4">Thuộc hộ</th>}
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResidents.map((resident) => (
                <tr
                  key={resident.id}
                  className="hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {resident.fullName}
                    </div>
                    {resident.alias && (
                      <div className="text-xs text-slate-500">
                        Bí danh: {resident.alias}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        resident.gender === "Nam"
                          ? "bg-blue-50 text-blue-700"
                          : resident.gender === "Nữ"
                          ? "bg-pink-50 text-pink-700"
                          : "bg-slate-100"
                      }`}
                    >
                      {resident.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(resident.dateOfBirth).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">
                    {resident.idCardNumber ? (
                      <span className="flex items-center">
                        <CreditCard size={12} className="mr-1" />
                        {resident.idCardNumber}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        resident.relationshipToHead === "Chủ hộ"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {resident.relationshipToHead}
                    </span>
                  </td>
                  {!filterHouseholdId && (
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {households.find((h) => h.id === resident.householdId)
                        ?.ownerName || resident.householdId}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setViewingItem(resident)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenModal(resident)}
                        className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Xóa nhân khẩu này?"))
                            deleteResident(resident.id);
                        }}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0 rounded-t-xl">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Users className="mr-2 text-blue-600" size={20} />
                {editingItem ? "Sửa nhân khẩu" : "Thêm nhân khẩu mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form
                id="resident-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Section: Basic Info */}
                <div className="col-span-1 md:col-span-3">
                  <h4 className="text-xs uppercase text-blue-600 font-bold mb-3 border-b pb-1 tracking-wider">
                    Thông tin cơ bản
                  </h4>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Thuộc Hộ khẩu (*)
                  </label>
                  <select
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.householdId}
                    onChange={(e) =>
                      setFormData({ ...formData, householdId: e.target.value })
                    }
                    disabled={!!filterHouseholdId}
                  >
                    <option value="">Chọn hộ khẩu...</option>
                    {households.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.id} - {h.ownerName} ({h.houseNumber} {h.street})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Quan hệ với chủ hộ (*)
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.relationshipToHead || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        relationshipToHead: e.target.value,
                      })
                    }
                    placeholder="Vd: Chủ hộ, Vợ, Con..."
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Họ và tên (*)
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.fullName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ngày sinh (*)
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.dateOfBirth || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Giới tính (*)
                  </label>
                  <select
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value as Gender,
                      })
                    }
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bí danh (nếu có)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.alias || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, alias: e.target.value })
                    }
                  />
                </div>

                {/* Section: Identification */}
                <div className="col-span-1 md:col-span-3 mt-2">
                  <h4 className="text-xs uppercase text-blue-600 font-bold mb-3 border-b pb-1 tracking-wider">
                    Giấy tờ tùy thân (CMND/CCCD)
                  </h4>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Số CMND/CCCD
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    value={formData.idCardNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, idCardNumber: e.target.value })
                    }
                    placeholder="Số thẻ định danh"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ngày cấp
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.idCardIssueDate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idCardIssueDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nơi cấp
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.idCardIssuePlace || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idCardIssuePlace: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Section: Details */}
                <div className="col-span-1 md:col-span-3 mt-2">
                  <h4 className="text-xs uppercase text-blue-600 font-bold mb-3 border-b pb-1 tracking-wider">
                    Thông tin chi tiết
                  </h4>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Dân tộc
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.ethnicity || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, ethnicity: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nguyên quán
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.hometown || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, hometown: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nơi sinh
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.placeOfBirth || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, placeOfBirth: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nghề nghiệp
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.occupation || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, occupation: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nơi làm việc
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.workplace || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, workplace: e.target.value })
                    }
                  />
                </div>

                {/* Section: Residency Info */}
                <div className="col-span-1 md:col-span-3 mt-2">
                  <h4 className="text-xs uppercase text-blue-600 font-bold mb-3 border-b pb-1 tracking-wider">
                    Quản lý Cư trú
                  </h4>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ngày ĐK Thường trú
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.registrationDate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Địa chỉ trước khi chuyển đến
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={formData.previousAddress || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        previousAddress: e.target.value,
                      })
                    }
                    placeholder="Ghi rõ địa chỉ cũ"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0 rounded-b-xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                form="resident-form"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
              >
                Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-slate-100 flex justify-between items-start shrink-0 rounded-t-xl">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-white shadow-sm">
                  <Users size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {viewingItem.fullName}
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center mt-1">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono mr-2">
                      {viewingItem.id}
                    </span>
                    {viewingItem.relationshipToHead}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 hover:bg-slate-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* ID Card Section */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center">
                  <CreditCard size={14} className="mr-2" /> Giấy tờ tùy thân
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 block">
                      Số CMND/CCCD
                    </span>
                    <span className="font-mono font-medium text-slate-800 text-lg">
                      {viewingItem.idCardNumber || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">
                      Ngày cấp
                    </span>
                    <span className="font-medium text-slate-800">
                      {viewingItem.idCardIssueDate
                        ? new Date(
                            viewingItem.idCardIssueDate
                          ).toLocaleDateString("vi-VN")
                        : "-"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-slate-500 block">
                      Nơi cấp
                    </span>
                    <span className="font-medium text-slate-800">
                      {viewingItem.idCardIssuePlace || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Info Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 border-b pb-1">
                  Thông tin cá nhân
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                  <div>
                    <span className="text-xs text-slate-500 block">
                      Ngày sinh
                    </span>
                    <span className="font-medium text-slate-800">
                      {new Date(viewingItem.dateOfBirth).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">
                      Giới tính
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        viewingItem.gender === "Nam"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-pink-50 text-pink-700"
                      }`}
                    >
                      {viewingItem.gender}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">
                      Dân tộc
                    </span>
                    <span className="font-medium text-slate-800">
                      {viewingItem.ethnicity}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">
                      Bí danh
                    </span>
                    <span className="font-medium text-slate-800">
                      {viewingItem.alias || "Không"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">
                      Nghề nghiệp
                    </span>
                    <span className="font-medium text-slate-800 flex items-center">
                      <Briefcase size={12} className="mr-1 text-slate-400" />{" "}
                      {viewingItem.occupation || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Origins */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 border-b pb-1">
                  Quê quán & Nơi sinh
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin size={16} className="mr-2 text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Nguyên quán
                      </span>
                      <span className="font-medium text-slate-800">
                        {viewingItem.hometown}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin size={16} className="mr-2 text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Nơi sinh
                      </span>
                      <span className="font-medium text-slate-800">
                        {viewingItem.placeOfBirth}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Residency */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 border-b pb-1">
                  Thông tin cư trú
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 block">
                      Ngày đăng ký thường trú
                    </span>
                    <div className="flex items-center mt-1">
                      <Calendar size={14} className="mr-1.5 text-blue-500" />
                      <span className="font-medium text-slate-800">
                        {new Date(
                          viewingItem.registrationDate
                        ).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">
                      Hộ khẩu số
                    </span>
                    <span className="font-medium text-blue-600 cursor-pointer hover:underline">
                      {viewingItem.householdId}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      ({getHouseholdInfo(viewingItem.householdId)?.ownerName})
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-slate-500 block">
                      Địa chỉ trước khi chuyển đến
                    </span>
                    <span className="font-medium text-slate-800">
                      {viewingItem.previousAddress || "Không có dữ liệu"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0 rounded-b-xl">
              <button
                onClick={() => setViewingItem(null)}
                className="px-6 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
