import './App.css'
import { Button, Space } from 'antd'
import { useNavigate } from 'react-router'
import { Outlet } from 'react-router'
import logo from '../assets/logo.png'
const App = () => {
  const navigate = useNavigate()

  return (
    <div className='app'>
      <h1>
        <img src={logo} alt="" />
        PathfinderPro
      </h1>
      <Space>
        <Button type="primary" onClick={() => navigate('/history')}>
          历史记录
        </Button>
        <Button onClick={() => navigate('/settings')}>
          设置
        </Button>
        <Button onClick={() => navigate('/about')}>
          关于
        </Button>
      </Space>
      <Outlet />
    </div>
  )
}

export default App