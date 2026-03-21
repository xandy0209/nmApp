export interface OperationRecord {
  name: string;
  time: string;
  operator: string;
  phone: string;
  description: string;
}

export interface ComplaintRecord {
  id: string;
  title: string;
  status: '待派发' | '待受理' | '处理中' | '待质检' | '已完成' | '撤单' | '已驳回';
  tab: 'TODO' | 'DONE';
  type: string;
  customerName: string;
  contactPerson: string;
  customerPhone: string;
  createTime: string;
  content: string;
  priority: '高' | '中' | '低';
  city: string;
  county: string;
  // New fields
  source: string;
  dispatchTime: string;
  deadline: string;
  businessType: string;
  productInstance: string;
  circuitId: string;
  customerId: string;
  aEndLevel: string;
  zEndLevel: string;
  aEndAddress: string;
  zEndAddress: string;
  faultTime: string;
  operationRecords: OperationRecord[];
  hasPermission?: boolean;
}
