import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import Header from './components/Header';
import MapSection from './components/MapSection';
import StatsDashboard from './components/StatsDashboard';
import GridMenu from './components/GridMenu';
import StatusBar from './components/StatusBar';
import IMSQuery from './components/IMSQuery';
import GroupOrderManagement from './components/GroupOrderManagement';
import GroupOrderDetail from './components/GroupOrderDetail';
import GroupTaskDetail from './components/GroupTaskDetail';
import ComplaintSupport from './components/ComplaintSupport';
import ComplaintDetail from './components/ComplaintDetail';
import { generateGroupOrderData, generateGroupOrderTaskData, generateDeliveryManagerData } from './src/utils/groupOrderData';
import { generateComplaintData } from './src/utils/complaintData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'HOME' | 'IMS_QUERY' | 'GROUP_ORDER' | 'GROUP_ORDER_DETAIL' | 'GROUP_TASK_DETAIL' | 'COMPLAINT_SUPPORT' | 'COMPLAINT_DETAIL'>('HOME');
  const [selectedId, setSelectedId] = useState<string>('');
  const [favoritedOrders, setFavoritedOrders] = useState<string[]>([]);

  // Generate data once (force refresh for mock data)
  const orders = useMemo(() => generateGroupOrderData(20), []);
  const tasks = useMemo(() => generateGroupOrderTaskData(orders), [orders]);
  // Use a unique key to force regeneration of managers data
  const managers = useMemo(() => generateDeliveryManagerData(15), [orders]);
  
  const [complaints, setComplaints] = useState(() => generateComplaintData(15));

  const handleUpdateComplaint = (id: string, updates: Partial<any>) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleMenuClick = (label: string) => {
    if (label === 'IMS固话查询') {
      setCurrentView('IMS_QUERY');
    } else if (label === '团单管理') {
      setCurrentView('GROUP_ORDER');
    } else if (label === '投诉支撑' || label === '投诉' || label === '投诉跟踪反馈') {
      setCurrentView('COMPLAINT_SUPPORT');
    }
    // Handle other menu items if needed
  };

  const handleBack = () => {
    if (currentView === 'GROUP_ORDER_DETAIL' || currentView === 'GROUP_TASK_DETAIL') {
      setCurrentView('GROUP_ORDER');
    } else if (currentView === 'COMPLAINT_DETAIL') {
      setCurrentView('COMPLAINT_SUPPORT');
    } else {
      setCurrentView('HOME');
    }
  };

  const handleGroupItemClick = (type: 'ORDER' | 'TASK', id: string) => {
    setSelectedId(id);
    if (type === 'ORDER') {
      setCurrentView('GROUP_ORDER_DETAIL');
    } else {
      setCurrentView('GROUP_TASK_DETAIL');
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'HOME': return '首页';
      case 'IMS_QUERY': return 'IMS固话查询';
      case 'GROUP_ORDER': return '团单管理';
      case 'GROUP_ORDER_DETAIL': return '团单详情';
      case 'GROUP_TASK_DETAIL': return '任务详情';
      case 'COMPLAINT_SUPPORT': return '投诉支撑';
      case 'COMPLAINT_DETAIL': return '投诉详情';
      default: return '首页';
    }
  };

  const selectedOrder = useMemo(() => orders.find(o => o.id === selectedId), [orders, selectedId]);
  const selectedTask = useMemo(() => tasks.find(t => t.id === selectedId), [tasks, selectedId]);
  const selectedComplaint = useMemo(() => complaints.find(c => c.id === selectedId), [complaints, selectedId]);

  const toggleFavorite = () => {
    if (selectedOrder) {
      setFavoritedOrders(prev => 
        prev.includes(selectedOrder.id) 
          ? prev.filter(id => id !== selectedOrder.id)
          : [...prev, selectedOrder.id]
      );
    }
  };

  const renderRightContent = () => {
    if (currentView === 'GROUP_ORDER_DETAIL' && selectedOrder) {
      const isFavorited = favoritedOrders.includes(selectedOrder.id);
      return (
        <button onClick={toggleFavorite} className="p-1">
          <Star size={20} className={isFavorited ? "fill-yellow-400 text-yellow-400" : "text-white"} />
        </button>
      );
    }
    return undefined;
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center w-full overflow-hidden">
      <div className="w-full h-full sm:h-[844px] sm:max-h-[95vh] sm:max-w-[390px] bg-white shadow-2xl flex flex-col relative sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-800 overflow-hidden">
        
        {/* Mobile Status Bar */}
        <StatusBar />

        {/* Top Header */}
        <Header 
          title={getTitle()}
          showBack={currentView !== 'HOME'}
          showRightIcon={currentView === 'HOME'}
          onBack={handleBack}
          rightContent={renderRightContent()}
        />

        {/* Main Content Area */}
        <div className="flex-1 relative w-full overflow-hidden bg-gray-50">
          
          {currentView === 'HOME' && (
            <div className="absolute inset-0 flex flex-col overflow-y-auto overflow-x-hidden">
              {/* Map Section - Reduced Height */}
              <div className="relative w-full h-[220px] shrink-0">
                {/* Background Blue Extension */}
                <div className="absolute top-0 left-0 w-full h-16 bg-[#2ea2e6] z-0"></div>

                {/* Map Card */}
                <div className="relative z-10 h-full">
                  <MapSection />
                </div>
              </div>

              {/* Statistics Dashboard */}
              <div className="shrink-0 mt-[-20px] relative z-20">
                <StatsDashboard onStatClick={handleMenuClick} />
              </div>

              {/* Menu Grid */}
              <div className="mt-4 px-4 shrink-0 pb-20">
                <GridMenu onMenuClick={handleMenuClick} />
              </div>
            </div>
          )}

          {currentView === 'IMS_QUERY' && (
            <div className="absolute inset-0 overflow-y-auto">
              <IMSQuery />
            </div>
          )}

          {/* Group Order Management - Rendered only when in Group Order flow to allow reset on Home */}
          {(currentView === 'GROUP_ORDER' || currentView === 'GROUP_ORDER_DETAIL' || currentView === 'GROUP_TASK_DETAIL') && (
            <div 
              className="absolute inset-0 bg-gray-50 flex flex-col overflow-y-auto"
              style={{ 
                visibility: currentView === 'GROUP_ORDER' ? 'visible' : 'hidden',
                zIndex: currentView === 'GROUP_ORDER' ? 10 : 0
              }}
            >
              <GroupOrderManagement 
                onItemClick={handleGroupItemClick} 
                orders={orders}
                tasks={tasks}
                managers={managers}
              />
            </div>
          )}

          {currentView === 'GROUP_ORDER_DETAIL' && selectedOrder && (
            <div className="absolute inset-0 z-20 bg-gray-50 flex flex-col overflow-y-auto">
              <GroupOrderDetail order={selectedOrder} />
            </div>
          )}

          {currentView === 'GROUP_TASK_DETAIL' && selectedTask && (
            <div className="absolute inset-0 z-20 bg-gray-50 flex flex-col overflow-y-auto">
              <GroupTaskDetail task={selectedTask} />
            </div>
          )}

          {/* Complaint Support - Keep mounted to preserve state and scroll position */}
          {(currentView === 'COMPLAINT_SUPPORT' || currentView === 'COMPLAINT_DETAIL') && (
            <div 
              className="absolute inset-0 z-10 bg-gray-50 flex flex-col overflow-y-auto"
              style={{ 
                visibility: currentView === 'COMPLAINT_SUPPORT' ? 'visible' : 'hidden',
                zIndex: currentView === 'COMPLAINT_SUPPORT' ? 10 : 0
              }}
            >
              <ComplaintSupport 
                complaints={complaints} 
                onItemClick={(id) => {
                  setSelectedId(id);
                  setCurrentView('COMPLAINT_DETAIL');
                }}
              />
            </div>
          )}

          {currentView === 'COMPLAINT_DETAIL' && selectedComplaint && (
            <div className="absolute inset-0 z-20 bg-gray-50 flex flex-col overflow-y-auto">
              <ComplaintDetail 
                complaint={selectedComplaint} 
                onBack={() => setCurrentView('COMPLAINT_SUPPORT')}
                onUpdateComplaint={handleUpdateComplaint}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default App;