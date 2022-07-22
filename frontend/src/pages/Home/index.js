import Bar from "@/components/Bar"
import './index.scss'

const Home = () => {
  return (
    <div className="home">
      <Bar
        style={{ width: '250px', height: '300px' }}
        xData={['vue', 'angular', 'react']}
        yData={[50, 60, 70]}
        title='三大框架满意度' />

      <Bar
        style={{ width: '250px', height: '300px' }}
        xData={['vue', 'angular', 'react']}
        yData={[50, 60, 70]}
        title='三大框架使用度' />
    </div>
  )
}
export default Home