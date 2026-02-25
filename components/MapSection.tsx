import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const MapSection: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);

    // Inner Mongolia GeoJSON URL (DataV Aliyun)
    const geoJsonUrl = './150000_full.json';

    fetch(geoJsonUrl)
      .then((response) => response.json())
      .then((geoJson) => {
        setLoading(false);
        echarts.registerMap('neimenggu', geoJson);

        // Data matching the previous screenshot
        // name needs to match GeoJSON properties usually ending with "市" or "盟"
        const data = [
          { name: '呼伦贝尔市', value: 9531, customer: 2577, display: '呼伦贝尔' },
          { name: '兴安盟', value: 6875, customer: 1517, display: '兴安盟' },
          { name: '通辽市', value: 9357, customer: 1358, display: '通辽' },
          { name: '锡林郭勒盟', value: 5082, customer: 1362, display: '锡林郭勒盟' },
          { name: '赤峰市', value: 4408, customer: 1427, display: '赤峰' },
          { name: '乌兰察布市', value: 4140, customer: 2273, display: '乌兰察布' },
          { name: '包头市', value: 4822, customer: 115, display: '包头' },
          { name: '呼和浩特市', value: 9576, customer: 3368, display: '呼和浩特' },
          { name: '巴彦淖尔市', value: 5846, customer: 1284, display: '巴彦淖尔' },
          { name: '阿拉善盟', value: 4056, customer: 1064, display: '阿拉善盟' },
          { name: '乌海市', value: 2789, customer: 733, display: '乌海' },
          { name: '鄂尔多斯市', value: 12107, customer: 3565, display: '鄂尔多斯' },
        ];

        const option = {
          tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
              if (!params.data) return params.name;
              return `${params.data.display}<br/>客户量: ${params.data.customer}<br/>业务量: ${params.value}`;
            },
            confine: true, // Keep tooltip inside chart
          },
          // Visual Map for Heat Gradient (Green -> Yellow -> Red)
          visualMap: {
            min: 2000,
            max: 13000,
            left: '10',
            top: '10',
            text: ['高', '低'], // Map legend labels
            calculable: true,
            inRange: {
              color: ['#4ade80', '#facc15', '#ef4444'] // Green to Red
            },
            textStyle: {
              fontSize: 10,
              color: '#666'
            },
            itemWidth: 10,
            itemHeight: 80, 
            orient: 'vertical',
          },
          series: [
            {
              name: '内蒙古业务数据',
              type: 'map',
              map: 'neimenggu',
              roam: true, // Enable Zoom and Drag
              zoom: 1.2, // Initial Zoom
              label: {
                show: true,
                formatter: (params: any) => {
                  if (!params.data) return params.name;
                  return `${params.data.display}\n(${params.data.customer}/${params.value})`;
                },
                fontSize: 8,
                color: '#333',
                lineHeight: 12
              },
              itemStyle: {
                areaColor: '#f3f4f6',
                borderColor: '#fff',
                borderWidth: 1
              },
              emphasis: {
                itemStyle: {
                  areaColor: '#bfdbfe'
                },
                label: {
                  color: '#000',
                  fontWeight: 'bold'
                }
              },
              data: data,
              // Fix for label overlap if needed, though simple map usually ok
            }
          ]
        };

        myChart.setOption(option);
      })
      .catch((err) => {
        console.error("Failed to load map data", err);
        setLoading(false);
      });

    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, []);

  return (
    <div className="mx-0 bg-white relative overflow-hidden h-72 border-b border-gray-100">
      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
          <span className="text-gray-400 text-sm">地图加载中...</span>
        </div>
      )}
      
      {/* ECharts Container */}
      <div ref={chartRef} className="w-full h-full" />

      {/* Legend Note Bottom Right */}
      <div className="absolute bottom-2 right-4 text-xs text-gray-400 pointer-events-none z-10 bg-white/50 px-1 rounded">
        显示说明： 客户量/业务量
      </div>
    </div>
  );
};

export default MapSection;