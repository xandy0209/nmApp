import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import MapSection from './components/MapSection';
import StatsDashboard from './components/StatsDashboard';
import GridMenu from './components/GridMenu';
import StatusBar from './components/StatusBar';
import IMSQuery from './components/IMSQuery';
import GroupOrderManagement from './components/GroupOrderManagement';
import GroupOrderDetail from './components/GroupOrderDetail';
import GroupTaskDetail from './components/GroupTaskDetail';
import { generateGroupOrderData, generateGroupOrderTaskData, generateDeliveryManagerData } from './src/utils/groupOrderData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'HOME' | 'IMS_QUERY' | 'GROUP_ORDER' | 'GROUP_ORDER_DETAIL' | 'GROUP_TASK_DETAIL'>('HOME');
  const [selectedId, setSelectedId] = useState<string>('');

  // Generate data once
  const orders = useMemo(() => generateGroupOrderData(20), []);
  const tasks = useMemo(() => generateGroupOrderTaskData(orders), [orders]);
  const managers = useMemo(() => generateDeliveryManagerData(15), []);

  const handleMenuClick = (label: string) => {
    if (label === 'IMS固话查询') {
      setCurrentView('IMS_QUERY');
    } else if (label === '团单管理') {
      setCurrentView('GROUP_ORDER');
    }
    // Handle other menu items if needed
  };

  const handleBack = () => {
    if (currentView === 'GROUP_ORDER_DETAIL' || currentView === 'GROUP_TASK_DETAIL') {
      setCurrentView('GROUP_ORDER');
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
      default: return '首页';
    }
  };

  const selectedOrder = useMemo(() => orders.find(o => o.id === selectedId), [orders, selectedId]);
  const selectedTask = useMemo(() => tasks.find(t => t.id === selectedId), [tasks, selectedId]);

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
                <StatsDashboard />
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
        </div>

      </div>
    </div>
  );
};

export default App;