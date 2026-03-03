import React from 'react';
import { User, Clock } from 'lucide-react';

interface GroupTaskDetailFeedbackProps {
  feedbacks: any[];
  feedbackText: string;
  setFeedbackText: (text: string) => void;
  handleSubmitFeedback: () => void;
}

const GroupTaskDetailFeedback: React.FC<GroupTaskDetailFeedbackProps> = ({
  feedbacks,
  feedbackText,
  setFeedbackText,
  handleSubmitFeedback,
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-3 border-l-4 border-[#2ea2e6] pl-2">新增反馈</h3>
        <textarea 
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="请输入阶段反馈内容..."
          className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-gray-50 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-blue-400 mb-3"
        ></textarea>
        <button onClick={handleSubmitFeedback} className="w-full bg-[#2ea2e6] text-white py-2.5 rounded-lg font-medium text-sm active:bg-blue-600 transition-colors">
          提交反馈
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-3 border-l-4 border-[#2ea2e6] pl-2">反馈记录</h3>
        <div className="space-y-3">
          {feedbacks.map((fb, idx) => (
            <div key={idx} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm text-gray-800 flex items-center gap-1"><User size={14}/> {fb.user}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12}/> {fb.time}</span>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md mt-2">{fb.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupTaskDetailFeedback;
