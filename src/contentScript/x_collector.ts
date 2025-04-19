// x_collector.ts: 在 x.com/home 推文悬浮时插入收藏按钮，并发送推文内容到后端
import axios from 'axios';

// API_PREFIX 默认为 /api/v1
const API_PREFIX = '/api/v1';
const API_BASE = `http://localhost:8000${API_PREFIX}/collections/add`; // 根据实际后端端口调整

// 判断是否在目标页面
function isTargetPage() {
  return location.hostname === 'x.com' && location.pathname === '/home';
}

// 创建收藏按钮
function createCollectBtn(): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.innerText = 'Collect';
  btn.style.cssText = `margin-left:8px;padding:2px 8px;background:#1677ff;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;`;
  btn.className = 'x-collect-btn';
  return btn;
}

// 监听推文卡片的 mouseenter/mouseleave 事件，插入/移除按钮（防止闪烁）
function observeTweetCards() {
  function addListenersToCard(card: HTMLElement) {
    card.addEventListener('mouseenter', () => {
      if (card.querySelector('.x-collect-btn')) return;
      const btn = createCollectBtn();
      btn.onclick = (ev) => {
        ev.stopPropagation();
        handleCollect(card as HTMLElement);
      };
      const siderBar = card.querySelector('div.r-1kkk96v');
      siderBar?.insertAdjacentElement('afterbegin', btn);
    });
    card.addEventListener('mouseleave', () => {
      const btn = card.querySelector('.x-collect-btn');
      if (btn) btn.remove();
    });
  }

  // 初始添加监听
  document.querySelectorAll('article[role="article"]').forEach(card => {
    if (card instanceof HTMLElement) addListenersToCard(card);
  });

  // 监听新推文动态加载
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.matches('article[role="article"]')) {
          addListenersToCard(node);
        } else if (node instanceof HTMLElement) {
          node.querySelectorAll?.('article[role="article"]').forEach(card => {
            if (card instanceof HTMLElement) addListenersToCard(card);
          });
        }
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// 获取推文完整 HTML
function getTweetFullHtml(cardElem: HTMLElement): string | null {
  return cardElem.outerHTML;
}

// 获取推文正文 HTML
function getTweetHtmlFromCard(cardElem: HTMLElement): string | null {
  const tweetElem = cardElem.querySelector('[data-testid="tweetText"], div[lang]');
  return tweetElem ? tweetElem.innerHTML : null;
}

// 递归克隆并将所有节点的 computed style 转为 inline style
function cloneWithInlineStyle(elem: HTMLElement): HTMLElement {
  const clone = elem.cloneNode(true) as HTMLElement;
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT, null);
  const nodeList: HTMLElement[] = [clone];
  let node = walker.nextNode() as HTMLElement | null;
  while (node) {
    nodeList.push(node);
    node = walker.nextNode() as HTMLElement | null;
  }
  // 获取原始节点列表
  const origWalker = document.createTreeWalker(elem, NodeFilter.SHOW_ELEMENT, null);
  const origNodeList: HTMLElement[] = [elem];
  let origNode = origWalker.nextNode() as HTMLElement | null;
  while (origNode) {
    origNodeList.push(origNode);
    origNode = origWalker.nextNode() as HTMLElement | null;
  }
  // 应用 computed style
  nodeList.forEach((cloneNode, i) => {
    const orig = origNodeList[i];
    if (orig) {
      const style = window.getComputedStyle(orig);
      // (cloneNode as HTMLElement).style.cssText = style.cssText;
      for (const prop of style) {
        if (prop === 'float') {
          cloneNode.style.cssFloat = style.getPropertyValue(prop);
          continue;
        }
        if (prop.startsWith('-') || prop === 'length' || prop === 'parentRule') continue;
        
        const value = style.getPropertyValue(prop);
        cloneNode.style.setProperty(prop, value);
      }
    }
  });
  return clone;
}

// 获取推文静态快照 HTML
function getTweetSnapshotHtml(cardElem: HTMLElement): string | null {
  const clone = cloneWithInlineStyle(cardElem);
  return clone.outerHTML;
}

// 发送内容到后端
async function handleCollect(cardElem: HTMLElement) {
  const html = getTweetHtmlFromCard(cardElem);
  const styled_html = getTweetSnapshotHtml(cardElem);
  if (!html || !styled_html) {
    alert('No tweet content found!');
    return;
  }
  try {
    await axios.post(API_BASE, { html, styled_html });
    alert('Collected!');
  } catch (err) {
    alert('Failed to collect: ' + (err as any).message);
  }
}

if (isTargetPage()) {
  observeTweetCards();
}
