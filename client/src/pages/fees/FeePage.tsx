import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  PaymentType,
  HouseholdPayment,
  FeeCategory,
  PaymentStatus,
} from "../../types";
import {
  Plus,
  DollarSign,
  Calendar,
  Filter,
  Info,
  Wallet,
  Edit2,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export const FeePage: React.FC = () => {
  const {
    paymentTypes,
    payments,
    households,
    residents,
    addPaymentType,
    editPaymentType,
    addPayment,
  } = useAppContext();
  const [activeTab, setActiveTab] = useState<"CAMPAIGNS" | "PAYMENTS">(
    "PAYMENTS"
  );
  const [paymentCategoryTab, setPaymentCategoryTab] = useState<FeeCategory>(
    FeeCategory.MANDATORY_SANITATION
  );

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<PaymentType | null>(
    null
  );

  // Filter States
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("ALL");

  // Form States
  const [newCampaign, setNewCampaign] = useState<Partial<PaymentType>>({
    paymentType: FeeCategory.VOLUNTARY_CONTRIBUTION,
  });
  const [newPayment, setNewPayment] = useState<Partial<HouseholdPayment>>({
    paymentDate: new Date().toISOString().split("T")[0],
    amountPaid: 0,
    amountExpected: 0,
  });

  // Helpers
  const getHouseholdMemberCount = (hid: string) =>
    residents.filter((r) => r.householdId === hid).length;

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // Payment Logic
  const handlePaymentHouseholdChange = (hid: string) => {
    const household = households.find((h) => h.id === hid);
    const campaign = paymentTypes.find(
      (c) => c.id === newPayment.paymentTypeId
    );

    let expected = 0;
    let amount = 0;
    let note = "";

    if (household && campaign) {
      if (
        campaign.paymentType === FeeCategory.MANDATORY_SANITATION &&
        campaign.amountPerPerson
      ) {
        // Auto calculate: 6000 * people * 12 months (Assuming annual payment as default)
        const members = getHouseholdMemberCount(hid);
        amount = members * campaign.amountPerPerson * 12;
        note = `Thu 12 tháng cho ${members} nhân khẩu (${formatter.format(
          campaign.amountPerPerson
        )}/tháng)`;
      }
    }

    setNewPayment({
      ...newPayment,
      householdId: hid,
      payerName: household?.ownerName || "",
      amountPaid: expected, // Default full pay
      amountExpected: expected,
      notes: note,
      status: "Đã đóng",
    });
  };

  const handleAmountPaidChange = (amount: number) => {
    let status: PaymentStatus = "Chưa đóng";
    const expected = newPayment.amountExpected || 0;

    if (amount >= expected && expected > 0) status = "Đã đóng";
    else if (amount > 0 && amount < expected) status = "Một phần";
    else if (amount === 0) status = "Chưa đóng";

    // Also check for Overdue logic (simple version)
    if (
      newPayment.dueDate &&
      new Date(newPayment.dueDate) < new Date() &&
      status !== "Đã đóng"
    ) {
      status = "Quá hạn";
    }

    setNewPayment({
      ...newPayment,
      amountPaid: amount,
      status: status,
    });
  };

  const handleOpenCampaignModal = (campaign?: PaymentType) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setNewCampaign(campaign);
      console.log(campaign);
    } else {
      setEditingCampaign(null);
      setNewCampaign({
        paymentType: FeeCategory.VOLUNTARY_CONTRIBUTION,
        canEdit: true,
      });
    }
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Đã đóng":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle size={12} className="mr-1" /> Đã đóng
          </span>
        );
      case "Một phần":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
            <Clock size={12} className="mr-1" /> Một phần
          </span>
        );
      case "Quá hạn":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">
            <AlertCircle size={12} className="mr-1" /> Quá hạn
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600">
            Chưa đóng
          </span>
        );
    }
  };

  // Filter Logic based on Sub-Tab
  const displayedPaymentTypes = paymentTypes.filter(
    (pt) => pt.paymentType === paymentCategoryTab
  );

  const filteredPayments = payments.filter((p) => {
    // 1. Filter by Category (Sub-tab)
    const pt = paymentTypes.find((t) => t.id === p.paymentTypeId);
    if (pt?.paymentType !== paymentCategoryTab) return false;

    // 2. Filter by Dropdown
    if (selectedCampaignId !== "ALL" && p.paymentTypeId !== selectedCampaignId)
      return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Quản lý Thu Phí & Đóng góp
          </h2>
          <p className="text-sm text-slate-500">
            Theo dõi phí vệ sinh, các khoản đóng góp tự nguyện
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
            <button
              onClick={() => setActiveTab("PAYMENTS")}
              className={`px-4 py-1.5 rounded-md transition-all ${
                activeTab === "PAYMENTS"
                  ? "bg-white text-teal-700 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Lịch sử thu
            </button>
            <button
              onClick={() => setActiveTab("CAMPAIGNS")}
              className={`px-4 py-1.5 rounded-md transition-all ${
                activeTab === "CAMPAIGNS"
                  ? "bg-white text-teal-700 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Danh sách khoản thu
            </button>
          </div>
        </div>
      </div>

      {activeTab === "CAMPAIGNS" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-end">
            <button
              onClick={() => handleOpenCampaignModal()}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm shadow-teal-600/20 transition-colors"
            >
              <Plus size={18} className="mr-2" /> Tạo khoản thu mới
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentTypes.map((camp) => (
              <div
                key={camp.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-2 rounded-lg ${
                      camp.paymentType === FeeCategory.MANDATORY_SANITATION
                        ? "bg-teal-50 text-teal-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    <Wallet size={20} />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        camp.paymentType === FeeCategory.MANDATORY_SANITATION
                          ? "bg-teal-100 text-teal-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {camp.paymentType === FeeCategory.MANDATORY_SANITATION
                        ? "Bắt buộc"
                        : "Tự nguyện"}
                    </span>
                    {camp.canEdit && (
                      <button
                        onClick={() => handleOpenCampaignModal(camp)}
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Chỉnh sửa khoản thu"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                  {camp.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4 min-h-[2.5rem] line-clamp-2">
                  {camp.description}
                </p>
                <div className="border-t border-slate-100 pt-3">
                  <div className="text-sm text-slate-500 mb-2 flex items-center">
                    <Calendar size={14} className="mr-2 text-slate-400" />
                    Tạo ngày:{" "}
                    {new Date(camp.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="text-sm text-slate-600 mb-2 flex items-center">
                    <Calendar size={14} className="mr-2 text-slate-400" />
                    Ngày bắt đầu thu:{" "}
                    {new Date(camp.startDate).toLocaleDateString("vi-VN")}
                  </div>

                  <div className="text-sm text-slate-600 mb-2 flex items-center">
                    <Calendar size={14} className="mr-2 text-slate-400" />
                    Ngày kết thúc:{" "}
                    {camp.dateExpired
                      ? new Date(camp.dateExpired).toLocaleDateString("vi-VN")
                      : "-"}
                  </div>
                  {camp.amountPerPerson && (
                    <div className="text-sm font-bold text-slate-900 bg-slate-50 p-2 rounded flex items-center justify-between">
                      <span>Đơn giá:</span>
                      <span className="text-teal-600">
                        {formatter.format(camp.amountPerPerson)} / người
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "PAYMENTS" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-200">
          {/* SUB TABS for History */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => {
                setPaymentCategoryTab(FeeCategory.MANDATORY_SANITATION);
                setSelectedCampaignId("ALL");
              }}
              className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${
                paymentCategoryTab === FeeCategory.MANDATORY_SANITATION
                  ? "border-teal-600 text-teal-800 bg-teal-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              PHÍ VỆ SINH & BẮT BUỘC
            </button>
            <button
              onClick={() => {
                setPaymentCategoryTab(FeeCategory.VOLUNTARY_CONTRIBUTION);
                setSelectedCampaignId("ALL");
              }}
              className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${
                paymentCategoryTab === FeeCategory.VOLUNTARY_CONTRIBUTION
                  ? "border-amber-500 text-amber-800 bg-amber-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              CÁC QUỸ ĐÓNG GÓP
            </button>
          </div>

          <div className="p-4 border-b border-teal-50 bg-white flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <select
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
              >
                <option value="ALL">Tất cả khoản thu trong danh mục</option>
                {displayedPaymentTypes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm shadow-teal-600/20 transition-colors"
            >
              <DollarSign size={18} className="mr-2" /> Ghi nhận đóng phí
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-teal-50 text-teal-900 text-sm uppercase font-bold border-b border-teal-100">
                <tr>
                  <th className="px-6 py-4">Mã GD / Ngày</th>
                  <th className="px-6 py-4">Hộ gia đình</th>
                  <th className="px-6 py-4">Khoản thu</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Số tiền</th>
                  <th className="px-6 py-4 text-right">Hạn nộp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-50">
                {filteredPayments.map((pay) => {
                  const hh = households.find((h) => h.id === pay.householdId);
                  const camp = paymentTypes.find(
                    (c) => c.id === pay.paymentTypeId
                  );

                  return (
                    <tr
                      key={pay.id}
                      className="hover:bg-teal-50/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-teal-600/70 font-semibold">
                          {pay.id}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(pay.paymentDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">
                          {hh?.ownerName}
                        </div>
                        <div className="text-xs text-slate-500">
                          Người nộp: {pay.payerName || "(Chưa có)"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="font-medium">{camp?.name}</span>
                        {pay.notes && (
                          <div className="text-xs text-slate-400 italic mt-1 max-w-xs truncate">
                            {pay.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(pay.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* Main Change Here: Display logic for amounts */}
                        <div
                          className={`font-bold ${
                            pay.amountPaid < pay.amountExpected
                              ? "text-amber-600"
                              : "text-teal-700"
                          }`}
                        >
                          {formatter.format(pay.amountPaid)}
                        </div>
                        {pay.amountExpected > 0 && (
                          <div className="text-xs text-slate-500 mt-1 border-t border-slate-200 pt-1">
                            Cần đóng:{" "}
                            <span className="font-semibold">
                              {formatter.format(pay.amountExpected)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-500">
                        {pay.dueDate
                          ? new Date(pay.dueDate).toLocaleDateString("vi-VN")
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-400 italic"
                    >
                      Chưa có dữ liệu giao dịch cho danh mục này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaign Modal (Create & Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 bg-teal-50 border-b border-teal-100">
              <h3 className="text-lg font-bold flex items-center text-teal-800">
                <Wallet className="mr-2 text-teal-600" size={20} />
                {editingCampaign ? "Chỉnh sửa khoản thu" : "Tạo khoản thu mới"}
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingCampaign) {
                  editPaymentType({
                    ...editingCampaign,
                    ...newCampaign,
                  } as PaymentType);
                } else {
                  addPaymentType({
                    ...newCampaign,
                    dateCreated: new Date().toISOString(),
                    canEdit: true,
                  } as PaymentType);
                }
                setIsModalOpen(false);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Tên khoản thu
                  </label>
                  <input
                    required
                    className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    value={newCampaign.name || ""}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, name: e.target.value })
                    }
                    placeholder="Vd: Phí vệ sinh 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Loại phí
                  </label>
                  <select
                    className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
                    value={newCampaign.paymentType}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        paymentType: e.target.value as FeeCategory,
                      })
                    }
                  >
                    <option value={FeeCategory.VOLUNTARY_CONTRIBUTION}>
                      Đóng góp tự nguyện
                    </option>
                    <option value={FeeCategory.MANDATORY_SANITATION}>
                      Phí vệ sinh (Bắt buộc)
                    </option>
                  </select>
                </div>
              </div>

              {newCampaign.paymentType === FeeCategory.MANDATORY_SANITATION && (
                <div className="bg-teal-50 p-3 rounded-lg border border-teal-100">
                  <label className="block text-sm font-bold text-teal-800 mb-1">
                    Định mức thu (VNĐ/người/tháng)
                  </label>
                  <input
                    type="number"
                    className="w-full border border-teal-200 p-2 rounded-lg font-semibold text-teal-700 focus:ring-2 focus:ring-teal-500 outline-none"
                    value={newCampaign.amountPerPerson || 6000}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        amountPerPerson: Number(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-teal-600 mt-2 flex items-center">
                    <Info size={12} className="mr-1" /> Mặc định: 6,000 VNĐ theo
                    quy định
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Ngày bắt đầu thu
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    value={
                      newCampaign.startDate
                        ? new Date(newCampaign.startDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Ngày kết thúc thu
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    value={
                      newCampaign.dateExpired
                        ? new Date(newCampaign.dateExpired)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        dateExpired: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Mô tả
                </label>
                <textarea
                  className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  rows={3}
                  value={newCampaign.description || ""}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm transition-colors"
                >
                  {editingCampaign ? "Lưu thay đổi" : "Tạo khoản thu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 bg-teal-50 border-b border-teal-100">
              <h3 className="text-lg font-bold flex items-center text-teal-800">
                <DollarSign className="mr-2 text-teal-600" size={20} /> Ghi nhận
                nộp phí
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addPayment({
                  ...newPayment,
                  id: `PAY${Date.now()}`,
                  category: paymentTypes.find(
                    (c) => c.id === newPayment.paymentTypeId
                  )?.paymentType,
                } as HouseholdPayment);
                setPaymentModalOpen(false);
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Chọn khoản thu (*)
                </label>
                <select
                  required
                  className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
                  value={newPayment.paymentTypeId || ""}
                  onChange={(e) =>
                    setNewPayment({
                      ...newPayment,
                      paymentTypeId: e.target.value,
                    })
                  }
                >
                  <option value="">-- Chọn khoản thu --</option>
                  {paymentTypes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (
                      {c.paymentType === FeeCategory.MANDATORY_SANITATION
                        ? "Bắt buộc"
                        : "Tự nguyện"}
                      )
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Hộ gia đình nộp (*)
                </label>
                <select
                  required
                  className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
                  value={newPayment.householdId || ""}
                  onChange={(e) => handlePaymentHouseholdChange(e.target.value)}
                  disabled={!newPayment.paymentTypeId}
                >
                  <option value="">-- Chọn hộ --</option>
                  {households.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.id} - {h.ownerName} (Số thành viên:{" "}
                      {getHouseholdMemberCount(h.id)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-teal-50 p-3 rounded-lg border border-teal-100 col-span-2">
                  <label className="block text-sm font-bold text-teal-800 mb-1">
                    Số tiền phải đóng
                  </label>
                  <input
                    disabled
                    type="text"
                    className="w-full bg-transparent border-none p-0 text-xl font-bold text-teal-700 focus:ring-0"
                    value={formatter.format(newPayment.amountExpected || 0)}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Số tiền thực đóng
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={newPayment.amountPaid || ""}
                    onChange={(e) =>
                      handleAmountPaidChange(Number(e.target.value))
                    }
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Trạng thái
                  </label>
                  <div className="mt-2">
                    {newPayment.status && getStatusBadge(newPayment.status)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Ngày hết hạn (Tuỳ chọn)
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newPayment.dueDate || ""}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, dueDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Người đi nộp
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  value={newPayment.payerName || ""}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, payerName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Ghi chú
                </label>
                <textarea
                  className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  rows={2}
                  value={newPayment.notes || ""}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, notes: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="mr-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm transition-colors"
                >
                  Lưu phiếu thu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
