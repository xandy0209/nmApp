import { ComplaintRecord } from '../types/complaint';

export const generateComplaintData = (count: number): ComplaintRecord[] => {
  const data: ComplaintRecord[] = [];
  const todoStatuses: Array<'待受理' | '处理中' | '待质检'> = ['待受理', '处理中', '待质检'];
  const doneStatuses: Array<'处理中' | '待质检' | '已完成'> = ['处理中', '待质检', '已完成'];
  const enterpriseNames = [
    '内蒙古电力（集团）有限责任公司',
    '内蒙古伊利实业集团股份有限公司',
    '内蒙古蒙牛乳业（集团）股份有限公司',
    '内蒙古包钢钢联股份有限公司',
    '内蒙古鄂尔多斯投资控股集团有限公司',
    '中国移动通信集团内蒙古有限公司',
    '中国联合网络通信有限公司内蒙古分公司',
    '中国电信股份有限公司内蒙古分公司',
    '内蒙古银行股份有限公司',
    '呼和浩特市交通运输局',
    '内蒙古北方重工业集团有限公司',
    '内蒙古第一机械集团有限公司',
    '内蒙古大兴安岭林业管理局',
    '内蒙古森工集团',
    '内蒙古能源发电投资集团有限公司'
  ];
  const personNames = ['王伟', '李芳', '张强', '刘洋', '陈静', '杨光', '赵敏', '周磊', '徐杰', '孙悦', '马超', '郭晶', '高飞', '林峰', '何平'];
  const types = ['服务投诉', '网络投诉', '资费投诉', '业务投诉'];
  const priorities: Array<'高' | '中' | '低'> = ['高', '中', '低'];
  const cities = ['呼和浩特市', '包头市', '赤峰市', '通辽市', '鄂尔多斯市'];
  const counties = ['赛罕区', '新城区', '回民区', '玉泉区', '土默特左旗'];

  for (let i = 0; i < count; i++) {
    const tab: 'TODO' | 'DONE' = i % 2 === 0 ? 'TODO' : 'DONE';
    const status = tab === 'TODO' 
      ? todoStatuses[i % todoStatuses.length]
      : doneStatuses[i % doneStatuses.length];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 10));
    
    const timestamp = Date.now() + i;
    const customerName = enterpriseNames[i % enterpriseNames.length];
    const personName = personNames[i % personNames.length];

    const dispatchTime = new Date(date);
    dispatchTime.setMinutes(dispatchTime.getMinutes() + 30);
    const deadline = new Date(dispatchTime);
    deadline.setHours(deadline.getHours() + 48);

    const operationRecords = [
      {
        name: '工单派发',
        time: date.toISOString().replace('T', ' ').substring(0, 19),
        operator: '系统',
        phone: '-',
        description: '系统自动派发工单'
      }
    ];

    if (status !== '待受理') {
      operationRecords.push({
        name: '受理',
        time: dispatchTime.toISOString().replace('T', ' ').substring(0, 19),
        operator: personName,
        phone: `13${Math.floor(Math.random() * 900000000 + 100000000)}`,
        description: '工单已受理'
      });
    }

    data.push({
      id: `TS-${timestamp}`,
      title: `关于${types[i % types.length]}的投诉 - ${i + 1}`,
      status,
      tab,
      type: types[i % types.length],
      customerName: customerName,
      contactPerson: personName,
      customerPhone: `13${Math.floor(Math.random() * 900000000 + 100000000)}`,
      createTime: date.toISOString().replace('T', ' ').substring(0, 19),
      content: `这是第${i + 1}条投诉的具体内容，涉及${types[i % types.length]}相关问题。`,
      priority: priorities[i % priorities.length],
      city: cities[i % cities.length],
      county: counties[i % counties.length],
      source: '10086热线',
      dispatchTime: dispatchTime.toISOString().replace('T', ' ').substring(0, 19),
      deadline: deadline.toISOString().replace('T', ' ').substring(0, 19),
      businessType: '互联网专线',
      productInstance: `PI-${100000 + i}`,
      circuitId: `CIR-${200000 + i}`,
      customerId: `CUST-${300000 + i}`,
      aEndLevel: 'AAA',
      zEndLevel: 'AA',
      aEndAddress: `${cities[i % cities.length]}${counties[i % counties.length]}某某大厦A座`,
      zEndAddress: `${cities[i % cities.length]}${counties[i % counties.length]}某某园区B栋`,
      faultTime: date.toISOString().replace('T', ' ').substring(0, 19),
      operationRecords: operationRecords.sort((a, b) => b.time.localeCompare(a.time)),
      hasPermission: i % 3 !== 0, // Simulate some having permission and some not (1/3 don't have)
    });
  }
  return data;
};
