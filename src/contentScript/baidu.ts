// 创建宿主元素
const buttonHost = document.createElement('div');
buttonHost.style.display = 'inline-block';
buttonHost.style.marginLeft = '20px';

// 创建 Shadow DOM
const shadow = buttonHost.attachShadow({ mode: 'open' });

// 添加样式
const style = document.createElement('style');
style.textContent = `
  .neo-button {
    position: relative;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .neo-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, 
      rgba(255,255,255,0.2) 0%, 
      rgba(255,255,255,0.1) 50%, 
      rgba(255,255,255,0.2) 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .neo-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(110,142,251,0.3);
  }
  
  .neo-button:hover::before {
    opacity: 1;
  }
  
  .neo-button:active {
    transform: translateY(0);
    filter: brightness(0.9);
  }
`;

// 创建按钮
const button = document.createElement('button');
button.className = 'neo-button';
button.textContent = '✨ 炫酷功能';

// 添加点击事件（示例）
button.addEventListener('click', () => {
  alert(window.location.href)
});

// 组合元素
shadow.appendChild(style);
shadow.appendChild(button);
const targetContainer = document.getElementById('s-top-left')!;
// 插入到目标位置
targetContainer.appendChild(buttonHost);