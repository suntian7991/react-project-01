/* 1.看官方文档 把echarts加入项目 
      在react中获取dom->useRef
      在什么地方获取dom节点->useEffect
   2.不抽离定制化参数 先把最小化demo跑起来
   3.按照需求，哪些参数需要定义 抽象出来
 */
import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { TitleComponent, TooltipComponent } from 'echarts/components'


echarts.use([GridComponent, BarChart, CanvasRenderer, TitleComponent, TooltipComponent])


function echartInit (node, xData, yData, title) {
  const myChart = echarts.init(node)
  // 绘制图表
  myChart.setOption({
    title: {
      text: title
    },
    tooltip: {},
    xAxis: {
      data: xData
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: yData
      }
    ]
  })
}

function Bar ({ style, xData, yData, title }) {
  // 1. 先不考虑传参问题  静态数据渲染到页面中
  // 2. 把那些用户可能定制的参数 抽象props (1.定制大小 2.data 以及说明文字)
  const nodeRef = useRef(null)
  useEffect(() => {
    echartInit(nodeRef.current, xData, yData, title)
  }, [xData, yData, title])

  return (
    <div ref={nodeRef} style={style}></div>
  )
}

export default Bar