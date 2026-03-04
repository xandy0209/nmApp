import { GroupOrderRecord, DeliveryManagerRecord, GroupOrderTaskRecord } from '../types/groupOrder';

export const INNER_MONGOLIA_CITIES = [
    { name: '呼和浩特市', code: '150100' },
    { name: '包头市', code: '150200' },
    { name: '乌海市', code: '150300' },
    { name: '赤峰市', code: '150400' },
    { name: '通辽市', code: '150500' },
    { name: '鄂尔多斯市', code: '150600' },
    { name: '呼伦贝尔市', code: '150700' },
    { name: '巴彦淖尔市', code: '150800' },
    { name: '乌兰察布市', code: '150900' },
    { name: '兴安盟', code: '152200' },
    { name: '锡林郭勒盟', code: '152500' },
    { name: '阿拉善盟', code: '152900' }
];

export const generateGroupOrderData = (count: number): GroupOrderRecord[] => {
    const data: GroupOrderRecord[] = [];
    const statuses: Array<'处理中' | '待受理' | '撤单' | '已完成' | '待回单'> = ['处理中', '待受理', '撤单', '已完成', '待回单'];
    const levels = ['省级', '地市级', '旗县级', '网格级'];
    const names = [
        "内蒙古自治区教育厅教育专网项目", "呼和浩特市智慧城市建设项目", "包头钢铁集团工业互联网项目", 
        "鄂尔多斯能源大数据中心项目", "赤峰市医疗保障局专线项目", "通辽市公安局雪亮工程项目", 
        "乌兰察布市云计算中心扩容项目", "巴彦淖尔市农业物联网项目", "锡林郭勒盟生态监测项目", 
        "兴安盟旅游大数据平台项目", "阿拉善盟边防监控项目", "乌海市智慧矿山项目",
        "内蒙古电力集团调度数据网项目", "内蒙古银行金融专网优化项目", "呼和浩特铁路局通信改造项目"
    ];
    const managers = [
        "张宏伟(13947180...)", "李明(15847129...)", "王坤鹏(15004820...)", "赵铁柱(13800138...)", 
        "刘伟(18447180...)", "陈建国(13604710...)", "杨丽(13704710...)", "周杰(13504710...)", 
        "吴敏(13304710...)", "郑伟(13604710...)", "钱芳(13900000...)", "孙强(13800000...)",
        "张彦飞(18747749...)", "武楠(158481299...)", "额力苏(18247744...)", "侯峰(138476704...)", 
        "王晓强(19804899...)"
    ];

    for (let i = 0; i < count; i++) {
        const nameIndex = i % names.length;
        const status = statuses[i % statuses.length];
        
        // Dates
        const receiptDate = new Date();
        receiptDate.setDate(receiptDate.getDate() - Math.floor(Math.random() * 5));
        receiptDate.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
        const receiptTime = receiptDate.toISOString().replace('T', ' ').substring(0, 19);

        const deadlineDate = new Date(receiptDate);
        deadlineDate.setDate(deadlineDate.getDate() + 4);
        const deliveryDeadline = deadlineDate.toISOString().replace('T', ' ').substring(0, 19);

        let completionTime = '';
        let returnOrderTime = '';
        if (status === '已完成') {
            const compDate = new Date(receiptDate);
            compDate.setDate(compDate.getDate() + 2);
            completionTime = compDate.toISOString().replace('T', ' ').substring(0, 19);
            
            // Return time is slightly after completion time
            const returnDate = new Date(compDate);
            returnDate.setMinutes(returnDate.getMinutes() + 45);
            returnOrderTime = returnDate.toISOString().replace('T', ' ').substring(0, 19);
        }

        const remainingDays = (Math.random() * 5 + 1).toFixed(2);
        const completionRate = status === '已完成' ? '100.00%' : (status === '待受理' ? '0.00%' : (Math.random() * 80).toFixed(2) + '%');
        const inflight = Math.floor(Math.random() * 6);
        const total = inflight + Math.floor(Math.random() * 3);
        const inflightStr = status === '已完成' ? `0/1` : `${inflight}/${total === 0 ? 1 : total}`;

        // Ensure logical focusStatus: completed / total, where total >= completed
        const totalTasks = Math.floor(Math.random() * 8) + 5; // 5 to 12 tasks
        // For '待回单', tasks should be 100% completed technically, but maybe not officially 'Done'
        const completedTasks = (status === '已完成' || status === '待回单') ? totalTasks : (status === '待受理' ? 0 : Math.floor(Math.random() * totalTasks));
        const uncompletedTasks = totalTasks - completedTasks;
        const focusStatus = `${completedTasks}/${totalTasks}`;
        const assignedTasksStr = `${uncompletedTasks}/${totalTasks}`;

        const cityObj = INNER_MONGOLIA_CITIES[Math.floor(Math.random() * INNER_MONGOLIA_CITIES.length)];
        const city = cityObj.name;
        // Simple mock county logic
        const county = `${city}辖区`; 

        const unassignedTickets = (status === '待受理') 
            ? totalTasks 
            : ((status === '处理中' && i % 4 === 0) ? Math.min(totalTasks, (i % 5) + 1) : 0);

        data.push({
            id: `go-${i}`,
            isImportant: i % 5 === 0,
            focusStatus: focusStatus,
            assignedTasks: assignedTasksStr,
            unassignedTickets: unassignedTickets,
            name: names[nameIndex],
            level: levels[nameIndex % levels.length],
            manager: managers[nameIndex % managers.length],
            status,
            completionRate,
            inflightDispatched: inflightStr,
            remainingTime: (status === '已完成' || status === '撤单') ? '-' : `${remainingDays}天`,
            receiptTime,
            deliveryDeadline: (status === '撤单') ? '-' : deliveryDeadline,
            completionTime,
            returnOrderTime,
            city,
            county,
            groupOrderId: `BN-20260210-${(1000 + i).toString().slice(1)}`
        });
    }
    return data;
};

export const generateGroupOrderTaskData = (orders: GroupOrderRecord[]): GroupOrderTaskRecord[] => {
    const tasks: GroupOrderTaskRecord[] = [];
    orders.forEach(order => {
        // Generate 1-3 tasks per order
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
            let taskStatus = '处理中';
            if (order.status === '待受理') taskStatus = '待受理';
            else if (order.status === '已完成') taskStatus = '已完成';
            else if (order.status === '撤单') taskStatus = '撤单';
            else {
                // For other order statuses, mix of statuses
                const rand = Math.random();
                if (rand > 0.7) taskStatus = '已完成';
                else if (rand > 0.6) taskStatus = '撤单'; // Add some random cancelled tasks
                else taskStatus = '处理中';
            }

            tasks.push({
                id: `${order.id}-0${i+1}`,
                taskId: `${order.groupOrderId}-0${i+1}`,
                name: `${order.name}-任务${i+1}`,
                groupOrderName: order.name,
                status: taskStatus,
                manager: order.manager,
                rate: order.completionRate,
                dispatchRatio: order.inflightDispatched,
                remaining: order.remainingTime,
                deadline: order.deliveryDeadline,
                finishTime: order.completionTime,
                receiptTime: order.receiptTime,
                groupOrderId: order.groupOrderId || order.id
            });
        }
    });
    return tasks;
};

export const generateDeliveryManagerData = (count: number): DeliveryManagerRecord[] => {
    const data: DeliveryManagerRecord[] = [];
    const levels = ['省级', '地市级', '旗县级', '网格级'];
    const names = [
        "张宏伟", "李明", "王坤鹏", "赵铁柱", "刘伟", "陈建国", "杨丽", "周杰", 
        "吴敏", "郑伟", "钱芳", "孙强", "张彦飞", "武楠", "额力苏", "侯峰", "王晓强"
    ];
    const companies = ["内蒙古移动", "呼和浩特移动", "包头移动", "赤峰移动", "通辽移动", "鄂尔多斯移动"];
    const jurisdictionTypes = ['专线', '宽带', '终端'];

    for (let i = 0; i < count; i++) {
        const cityObj = INNER_MONGOLIA_CITIES[Math.floor(Math.random() * INNER_MONGOLIA_CITIES.length)];
        const level = levels[i % levels.length];
        
        // Randomly select 1-3 jurisdiction types for non-provincial managers
        const jurisdiction: string[] = [];
        if (level !== '省级') {
            const numTypes = Math.floor(Math.random() * 3) + 1;
            const shuffled = [...jurisdictionTypes].sort(() => 0.5 - Math.random());
            jurisdiction.push(...shuffled.slice(0, numTypes));
        }

        data.push({
            id: `dm-${i}`,
            name: names[i % names.length],
            phone: `13${Math.floor(Math.random() * 9 + 1)}${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
            level: level,
            city: level === '省级' ? '全区' : cityObj.name,
            count: Math.floor(Math.random() * 50),
            grid: level === '网格级' ? `${cityObj.name}网格${i}` : '-',
            company: companies[i % companies.length],
            jurisdiction: jurisdiction
        });
    }
    return data;
};
