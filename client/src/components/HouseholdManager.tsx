
import React, { useState } from 'react';
import { Household, Resident } from '../types';
import { Plus, Search, Edit2, Trash2, User, MapPin, Eye, Home } from 'lucide-react';

interface HouseholdManagerProps {
  households: Household[];
  residents: Resident[];
  onAdd: (h: Household) => void;
  onEdit: (h: Household) => void;
  onDelete: (id: string) => void;
  onSelectHousehold: (id: string) => void;
}

export const HouseholdManager: React.FC<HouseholdManagerProps> = ({ 
  households, residents, onAdd, onEdit, onDelete, onSelectHousehold 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Household | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Household>>({});

  const getFullAddress = (h: Household) => {
    return `${h.houseNumber}, ${h.street}, ${h.ward}, ${h.district}`;
  };

  const filteredHouseholds = households.filter(h => 
    h.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getFullAddress(h).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: Household) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        id: `HK${Math.floor(Math.random() * 10000)}`,
        district: 'Thanh Xuân', // Default
        ward: '',
        houseNumber: '',
        street: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onEdit({ ...editingItem, ...formData } as Household);
    } else {
      onAdd(formData as Household);
    }
    setIsModalOpen(false);
  };

  const countMembers = (householdId: string) => residents.filter(r => r.householdId === householdId).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Hộ Khẩu</h2>
          <p className="text-sm text-slate-500">Quản lý thông tin nơi cư trú của các hộ gia đình</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Thêm hộ mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo tên chủ hộ, mã hộ, địa chỉ..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Mã hộ</th>
                <th className="px-6 py-4">Chủ hộ</th>
                <th className="px-6 py-4">Địa chỉ (Số nhà, Đường, Phường, Quận)</th>
                <th className="px-6 py-4 text-center">Nhân khẩu</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHouseholds.map(household => (
                <tr key={household.id} className="hover:bg-blue-50/50 group transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">{household.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 flex items-center">
                       <User size={16} className="mr-2 text-slate-400" />
                       {household.ownerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-xs" title={getFullAddress(household)}>{getFullAddress(household)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {countMembers(household.id)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                       <button 
                        onClick={() => onSelectHousehold(household.id)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Xem chi tiết nhân khẩu"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(household)}
                        className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Sửa thông tin"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => { if(window.confirm('Xóa hộ khẩu này? Dữ liệu nhân khẩu liên quan sẽ bị ảnh hưởng.')) onDelete(household.id); }}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredHouseholds.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Không tìm thấy hộ khẩu nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                 <Home className="mr-2 text-blue-600" size={20}/>
                 {editingItem ? 'Sửa thông tin hộ khẩu' : 'Thêm hộ khẩu mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Mã hộ khẩu (*)</label>
                <input required type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  value={formData.id || ''} onChange={e => setFormData({...formData, id: e.target.value})} 
                  disabled={!!editingItem}
                  placeholder="VD: HK001"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên chủ hộ (*)</label>
                <input required type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  value={formData.ownerName || ''} onChange={e => setFormData({...formData, ownerName: e.target.value})} 
                  placeholder="Họ và tên chủ hộ"
                />
              </div>
              
              <div className="col-span-2 mt-2 border-t pt-2">
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Địa chỉ chi tiết</label>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Số nhà</label>
                <input required type="text" className="w-full p-2 border border-slate-300 rounded-lg" 
                  value={formData.houseNumber || ''} onChange={e => setFormData({...formData, houseNumber: e.target.value})} placeholder="VD: 12B"/>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Đường phố / Thôn xóm</label>
                <input required type="text" className="w-full p-2 border border-slate-300 rounded-lg" 
                  value={formData.street || ''} onChange={e => setFormData({...formData, street: e.target.value})} placeholder="VD: Nguyễn Trãi" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Phường / Xã / Thị trấn</label>
                <input required type="text" className="w-full p-2 border border-slate-300 rounded-lg" 
                  value={formData.ward || ''} onChange={e => setFormData({...formData, ward: e.target.value})} placeholder="VD: Thanh Xuân Trung" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Quận / Huyện</label>
                <input required type="text" className="w-full p-2 border border-slate-300 rounded-lg" 
                  value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})} placeholder="VD: Thanh Xuân" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Khu vực / Tổ dân phố</label>
                <input type="text" className="w-full p-2 border border-slate-300 rounded-lg" 
                  value={formData.areaCode || ''} onChange={e => setFormData({...formData, areaCode: e.target.value})} placeholder="Tùy chọn" />
              </div>
              
              <div className="col-span-2 mt-4 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
