
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { PaymentType, HouseholdPayment, FeeCategory } from '../../types';
import { Plus, DollarSign, Calendar, Filter, Info } from 'lucide-react';

export const FeePage: React.FC = () => {
  const { paymentTypes, payments, households, residents, addPaymentType, addPayment } = useAppContext();
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'PAYMENTS'>('PAYMENTS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Filter States
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('ALL');

  // Form States
  const [newCampaign, setNewCampaign] = useState<Partial<PaymentType>>({ category: FeeCategory.VOLUNTARY_CONTRIBUTION });
  const [newPayment, setNewPayment] = useState<Partial<HouseholdPayment>>({ paymentDate: new Date().toISOString().split('T')[0] });

  // Helpers
  const getHouseholdMemberCount = (hid: string) => residents.filter(r => r.householdId === hid).length;
  
  const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

  // Payment Logic
  const handlePaymentHouseholdChange = (hid: string) => {
    const household = households.find(h => h.id === hid);
    const campaign = paymentTypes.find(c => c.id === newPayment.paymentTypeId);
    
    let amount = 0;
    let note = '';

    if (household && campaign) {
      if (campaign.category === FeeCategory.MANDATORY_SANITATION && campaign.amountPerPerson) {
        // Auto calculate: 6000 * people * 12 months (Assuming annual payment as default)
        const members = getHouseholdMemberCount(hid);
        amount = members * campaign.amountPerPerson * 12;
        note = `Thu 12 tháng cho ${members} nhân khẩu (${formatter.format(campaign.amountPerPerson)}/tháng)`;
      }
    }

    setNewPayment({
      ...newPayment,
      householdId: hid,
      payerName: household?.ownerName || '',
      amountPaid: amount,
      notes: note
    });
  };

  const filteredPayments = payments.filter(p => selectedCampaignId === 'ALL' || p.paymentTypeId === selectedCampaignId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Thu Phí & Đóng góp</h2>
          <p className="text-sm text-slate-500">Theo dõi phí vệ sinh, các khoản đóng góp tự nguyện</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
            <button 
              onClick={() => setActiveTab('PAYMENTS')}
              className={`px-4 py-1.5 rounded-md transition-all ${activeTab === 'PAYMENTS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Lịch sử thu
            </button>
             <button 
              onClick={() => setActiveTab('CAMPAIGNS')}
              className={`px-4 py-1.5 rounded-md transition-all ${activeTab === 'CAMPAIGNS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Danh sách khoản thu
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'CAMPAIGNS' && (
        <div className="space-y-4 animate-in fade-in duration-200">
           <div className="flex justify-end">
             <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm">
                <Plus size={18} className="mr-2" /> Tạo khoản thu mới
             </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {paymentTypes.map(camp => (
               <div key={camp.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                 <div className="flex justify-between items-start mb-4">
                   <div className={`p-2 rounded-lg ${camp.category === FeeCategory.MANDATORY_SANITATION ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                     <DollarSign size={20} />
                   </div>
                   <span className={`text-xs font-semibold px-2 py-1 rounded ${camp.category === FeeCategory.MANDATORY_SANITATION ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                     {camp.category === FeeCategory.MANDATORY_SANITATION ? 'Bắt buộc' : 'Tự nguyện'}
                   </span>
                 </div>
                 <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{camp.name}</h3>
                 <p className="text-sm text-slate-500 mb-4 min-h-[2.5rem] line-clamp-2">{camp.description}</p>
                 <div className="border-t pt-3">
                    <div className="text-sm text-slate-600 mb-2 flex items-center">
                      <Calendar size={14} className="mr-2 text-slate-400" /> 
                      Tạo ngày: {new Date(camp.dateCreated).toLocaleDateString('vi-VN')}
                    </div>
                    {camp.amountPerPerson && (
                        <div className="text-sm font-bold text-slate-900 bg-slate-50 p-2 rounded flex items-center justify-between">
                          <span>Đơn giá:</span>
                          <span className="text-blue-600">{formatter.format(camp.amountPerPerson)} / người</span>
                        </div>
                    )}
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {activeTab === 'PAYMENTS' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-200">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <select 
                className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
              >
                <option value="ALL">Tất cả khoản thu</option>
                {paymentTypes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button onClick={() => setPaymentModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm">
                <DollarSign size={18} className="mr-2" /> Ghi nhận đóng phí
            </button>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Mã GD</th>
                  <th className="px-6 py-4">Ngày nộp</th>
                  <th className="px-6 py-4">Hộ gia đình</th>
                  <th className="px-6 py-4">Khoản thu</th>
                  <th className="px-6 py-4 text-right">Số tiền</th>
                  <th className="px-6 py-4">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map(pay => {
                   const hh = households.find(h => h.id === pay.householdId);
                   const camp = paymentTypes.find(c => c.id === pay.paymentTypeId);
                   return (
                     <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 font-mono text-xs text-slate-400">{pay.id}</td>
                       <td className="px-6 py-4 text-sm">{new Date(pay.paymentDate).toLocaleDateString('vi-VN')}</td>
                       <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">{hh?.ownerName}</div>
                          <div className="text-xs text-slate-400">Người nộp: {pay.payerName}</div>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-600">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${camp?.category === FeeCategory.MANDATORY_SANITATION ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {camp?.name}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatter.format(pay.amountPaid)}</td>
                       <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">{pay.notes || '-'}</td>
                     </tr>
                   )
                })}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">Không có dữ liệu giao dịch.</td>
                  </tr>
                )}
              </tbody>
             </table>
          </div>
        </div>
      )}

      {/* Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <DollarSign className="mr-2 text-blue-600"/> Tạo khoản thu mới
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              addPaymentType({...newCampaign, id: `PT${Date.now()}`, dateCreated: new Date().toISOString()} as PaymentType);
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên khoản thu</label>
                <input required className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={newCampaign.name || ''} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} placeholder="Vd: Phí vệ sinh 2024" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Loại phí</label>
                <select className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newCampaign.category} 
                  onChange={e => setNewCampaign({...newCampaign, category: e.target.value as FeeCategory})}>
                  <option value={FeeCategory.VOLUNTARY_CONTRIBUTION}>Đóng góp tự nguyện</option>
                  <option value={FeeCategory.MANDATORY_SANITATION}>Phí vệ sinh (Bắt buộc)</option>
                </select>
              </div>
              {newCampaign.category === FeeCategory.MANDATORY_SANITATION && (
                 <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <label className="block text-sm font-bold text-blue-800 mb-1">Định mức thu (VNĐ/người/tháng)</label>
                  <input type="number" className="w-full border border-blue-200 p-2 rounded-lg font-semibold text-blue-700" 
                    value={newCampaign.amountPerPerson || 6000} 
                    onChange={e => setNewCampaign({...newCampaign, amountPerPerson: Number(e.target.value)})} />
                  <p className="text-xs text-blue-600 mt-1 flex items-center">
                    <Info size={12} className="mr-1"/> Mặc định: 6,000 VNĐ theo quy định
                  </p>
                </div>
              )}
               <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3}
                  value={newCampaign.description || ''} onChange={e => setNewCampaign({...newCampaign, description: e.target.value})} />
              </div>
              <div className="flex justify-end pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="mr-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">Tạo khoản thu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <DollarSign className="mr-2 text-emerald-600"/> Ghi nhận nộp phí
            </h3>
            <form onSubmit={(e) => {
               e.preventDefault();
               addPayment({...newPayment, id: `PAY${Date.now()}`} as HouseholdPayment);
               setPaymentModalOpen(false);
            }} className="space-y-4">
               <div>
                <label className="block text-sm font-medium mb-1">Chọn khoản thu (*)</label>
                <select required className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={newPayment.paymentTypeId || ''} 
                  onChange={e => setNewPayment({...newPayment, paymentTypeId: e.target.value})}
                >
                  <option value="">-- Chọn khoản thu --</option>
                  {paymentTypes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.category === FeeCategory.MANDATORY_SANITATION ? 'Bắt buộc' : 'Tự nguyện'})</option>)}
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium mb-1">Hộ gia đình nộp (*)</label>
                <select required className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={newPayment.householdId || ''} 
                  onChange={e => handlePaymentHouseholdChange(e.target.value)}
                  disabled={!newPayment.paymentTypeId}
                >
                  <option value="">-- Chọn hộ --</option>
                  {households.map(h => <option key={h.id} value={h.id}>{h.id} - {h.ownerName} (Số thành viên: {getHouseholdMemberCount(h.id)})</option>)}
                </select>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-1">Số tiền nộp (VNĐ)</label>
                <input required type="number" className="w-full border border-slate-300 p-2 rounded-lg font-bold text-emerald-600 text-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={newPayment.amountPaid || ''} onChange={e => setNewPayment({...newPayment, amountPaid: Number(e.target.value)})} />
                 {newPayment.paymentTypeId && paymentTypes.find(c => c.id === newPayment.paymentTypeId)?.category === FeeCategory.MANDATORY_SANITATION && (
                   <p className="text-xs text-slate-500 mt-2 italic">
                     * Hệ thống tự động tính theo công thức: 6,000 x Số nhân khẩu x 12 tháng
                   </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Người đi nộp</label>
                <input type="text" className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={newPayment.payerName || ''} onChange={e => setNewPayment({...newPayment, payerName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ghi chú</label>
                <textarea className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" rows={2} 
                  value={newPayment.notes || ''} onChange={e => setNewPayment({...newPayment, notes: e.target.value})} />
              </div>
               <div className="flex justify-end pt-4 border-t">
                <button type="button" onClick={() => setPaymentModalOpen(false)} className="mr-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm">Lưu phiếu thu</button>
              </div>
            </form>
           </div>
        </div>
      )}
    </div>
  );
};
