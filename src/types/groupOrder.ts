export interface GroupOrderRecord {
  id: string;
  isImportant: boolean;
  focusStatus: string; // 重点 e.g., "4/6"
  assignedTasks: string; // 分派任务 e.g., "1/5" (Uncompleted/Total)
  unassignedTickets: number; // 未分派工单
  name: string; // 团单名称
  level: string; // 团单等级 (省级, 地市级, etc.)
  manager: string; // 交付经理
  status: '处理中' | '待受理' | '撤单' | '已完成' | '待回单'; // 状态
  completionRate: string; // 竣工率
  inflightDispatched: string; // 在途量/派单量 e.g. "2/6"
  remainingTime: string; // 剩余时限 e.g. "3.85天" or "-"
  receiptTime: string; // 网络侧收单时间
  deliveryDeadline: string; // 交付时限
  completionTime: string; // 完成时间
  returnOrderTime?: string; // 回单时间
  groupOrderId?: string; // 团单标识号
  city?: string; // 地市
  county?: string; // 旗县
}

export interface DeliveryManagerRecord {
  id: string;
  name: string;
  phone: string;
  level: string;
  city: string;
  count: number;
  grid?: string;
  company?: string;
  jurisdiction?: string[];
}

export interface GroupOrderTaskRecord {
  id: string;
  taskId: string;
  name: string;
  groupOrderName: string;
  status: string;
  manager: string;
  rate: string;
  dispatchRatio: string;
  remaining: string;
  deadline: string;
  finishTime: string;
  receiptTime: string;
  groupOrderId: string; // Added for filtering
}
