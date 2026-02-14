<template>
 <div class="main-container" :class="{ 'love-cursor': step >= 3  }">
    <transition name="fade">
      <div v-if="step === 1" class="overlay">
        <button class="open-btn" @click="step = 2">
          <span class="gift-icon"></span> 打開
        </button>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="step === 2" class="overlay">
        <div class="question-box">
          <h2 class="question-text">請問你是 RT 小姐嗎？</h2>
          <button class="open-btn" @click="handleAnswerYes">
            是
          </button>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="step === 3" class="overlay">
        <div class="greeting-box">
          <img :src="sakuraIcon" class="decoration-flower left-flower" />
          
          <h2 class="greeting-text">
            蕭如庭小姐<br>
            情人節快樂！
          </h2>
          
          <img :src="sakura1Icon" class="decoration-flower right-flower" />
        </div>
      </div>
    </transition>

    <transition name="zoom">
      <div v-if="step === 4" class="content-wrapper">
        
        <transition name="slow-fade">
          <div v-if="showFalling" class="falling-container">
             <div v-for="(item, index) in fallingItems" :key="index" class="item" :style="{ left: item.left + '%', animationDuration: item.duration + 's', animationDelay: item.delay + 's', width: item.size + 'px' }">
               <img :src="item.icon" class="falling-img" />
             </div>
          </div>
        </transition>

        <div class="env-wrapper">
           <div class="valentines" @mouseenter="isHover = true" @mouseleave="isHover = false" @click="showFullLetter = true">
            <div class="envelope"></div>
            <div class="front"></div>
            <div class="card" :class="{ 'card-up': isHover }">
              <div class="card-text">Happy<br>Valentine's<br>Day!</div>
              <div class="card-heart"></div>
            </div>
            <div class="hearts">
              <div class="one"></div><div class="two"></div><div class="three"></div><div class="four"></div><div class="five"></div>
            </div>
          </div>
          <div class="shadow"></div>
        </div>

        <transition name="fade">
          <div v-if="showFullLetter" class="letter-overlay" @click.self="showFullLetter = false">
            <div class="letter-paper">
              <div class="letter-content">
                <p>hello  RT 寶貝</p>
                <br>
                <p>好開心歐我們終於過了第一個情人節！但因為沒辦法去到你身邊，所以做禮物給你，希望寶貝會喜歡，希望能跟寶貝在一起到好久以後！祝寶貝開心，滑雪加油，在學校順利，跟身邊的人也能好好相處，情人節快樂！</p>
                <br>
                <p class="signature">愛你的 bbd 敬上</p>
              </div>
              <button class="close-letter" @click="showFullLetter = false">✕</button>
            </div>
          </div>
        </transition>

      </div>
    </transition>
  </div>
  
</template>

<script setup>
import { ref } from 'vue';
import confetti from 'canvas-confetti'; // 引入彩炮套件

// --- 1. 根據你的 assets 截圖修正引入名稱 ---
import heartIcon from './assets/heart.png';
import chocolateIcon from './assets/chocolate.png';
import teddyIcon from './assets/teddy-bear.png';
import sakuraIcon from './assets/sakura.png';
import sakura1Icon from './assets/sakura (1).png';
import sakura2Icon from './assets/sakura (2).png';
import sakura3Icon from './assets/sakura (3).png';

const step = ref(1); 
const isHover = ref(false);
const showFalling = ref(false); // 新增：獨立控制掉落物
const showFullLetter = ref(false); // 新增：控制完整信紙的顯示

// --- 2. 設定掉落物種類與權重 (愛心權重 3，其餘 1) ---
const rawTypes = [
  { icon: heartIcon, weight: 3 },
  { icon: chocolateIcon, weight: 1 },
  { icon: teddyIcon, weight: 1 },
  { icon: sakuraIcon, weight: 1 },
  { icon: sakura1Icon, weight: 1 },
  { icon: sakura2Icon, weight: 1 },
  { icon: sakura3Icon, weight: 1 }
];

const handleAnswerYes = () => {
  step.value = 3; // 進入祝福文字畫面
  
  // --- 新增：彩炮特效 ---
  // 定義一個發射彩炮的函式
  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 } // 從畫面下方 70% 的位置發射
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    // 發射第一波：從左下角往右上噴
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 0, y: 1 }, // 左下角
      colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'] // 彩虹色
    });

    // 發射第二波：從右下角往左上噴
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 1, y: 1 }, // 右下角
      colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
    });

    // 發射第三波：中間爆炸
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { y: 0.6 }
    });
    
    // 發射第四波：慢速飄落
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  // 立即觸發一次
  fireConfetti();

  // 0.5 秒後再觸發一次，增加熱鬧感
  setTimeout(fireConfetti, 500);

  // --- 原本的轉場邏輯 ---
  setTimeout(() => {
    step.value = 4; // 切換到信封畫面
    
    // 延遲顯示掉落物
    setTimeout(() => {
      showFalling.value = true;
    }, 1500);
    
  }, 4000); // 這裡改為 4 秒，讓彩炮飛一會兒
};

// 建立加權隨機池
const weightedPool = [];
rawTypes.forEach(type => {
  for (let i = 0; i < type.weight; i++) {
    weightedPool.push(type.icon);
  }
});

// --- 3. 生成 60 個掉落物 ---
const fallingItems = Array.from({ length: 60 }, () => ({
  icon: weightedPool[Math.floor(Math.random() * weightedPool.length)],
  left: Math.random() * 100,
  duration: 4 + Math.random() * 6,
  delay: Math.random() * 5,
  size: 25 + Math.random() * 20 
}));


const handleOpen = () => { isOpened.value = true; };
</script>

<style scoped>

/* 修改：保證能顯示的 SVG 愛心游標 */
.love-cursor {
  /* 使用 SVG 繪製紅色愛心 (色碼 ff4d4d)，座標 16 16 是游標熱點 */
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="%23ff4d4d" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>') 16 16, auto;
}

/* 修改：互動元素 hover 時的游標 (變成手指點擊樣式 + 愛心) */
.love-cursor button:hover,
.love-cursor .valentines:hover,
.love-cursor .close-letter:hover {
   /* 這裡我們保持原本的手指游標，操作比較直覺，或者你也可以換成上面的愛心代碼 */
   cursor: pointer; 
}
/* 1. 引入 Google Fonts 字體庫 (放在 style 最上面) */
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+TC:wght@600;900&family=Zen+Maru+Gothic:wght@700&display=swap');

/* 祝福頁面容器 */
.greeting-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  position: relative;
  z-index: 102; /* 確保在最上層 */
}

/* 祝福文字樣式 */
.greeting-text {
  /* --- 字體設定區 (選一個你喜歡的打開註解) --- */
  

  
  /* 方案 B: 可愛圓潤 (若喜歡這個，把上面那行刪掉，改用這行) */
  font-family: 'Zen Maru Gothic', sans-serif;
  
  /* 方案 C: 手寫書法 */
  /* font-family: 'Ma Shan Zheng', cursive; */

  /* --- 文字特效 --- */
  font-size: 3.5rem; /* 字體放大 */
  font-weight: 900;  /* 最粗體 */
  line-height: 1.6;
  text-align: center;
  letter-spacing: 5px; /* 字距拉開更有質感 */
  
  /* 漸層金屬色特效 */
  background: linear-gradient(to bottom, #ffe4e1, #ffb6c1, #ff69b4);
  -webkit-background-clip: text;
  color: transparent;
  
  /* 發光濾鏡 */
  filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.6));
  
  /* 進場動畫 */
  animation: textFloat 3s ease-in-out infinite;
}

/* 左右花朵裝飾 */
.decoration-flower {
  width: 80px; /* 花朵稍微放大 */
  height: auto;
  opacity: 0.9;
  filter: drop-shadow(0 5px 5px rgba(0,0,0,0.3));
}

.left-flower {
  animation: floatLeft 4s ease-in-out infinite;
}

.right-flower {
  animation: floatRight 4s ease-in-out infinite;
  animation-delay: 1s;
}

/* 動畫定義 */
@keyframes textFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.02); } /* 文字輕微呼吸浮動 */
}

@keyframes floatLeft {
  0%, 100% { transform: translateY(0) rotate(-10deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

@keyframes floatRight {
  0%, 100% { transform: translateY(0) rotate(10deg); }
  50% { transform: translateY(-20px) rotate(-10deg); }
}

/* 頁面基礎設置 */
.main-container {
  width: 100vw;
  height: 100vh;
  background-color: #301A47;
  overflow: hidden;
  position: relative;
}

.overlay {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 內容置中核心 */
.content-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center; /* 垂直置中 */
  position: relative;
}

.open-btn {
  background: transparent;
  border: 3px solid #ff4d4d; /* 邊框稍微加粗更有份量 */
  color: #ff4d4d;
  
  /* 關鍵修改：增加內距與字體 */
  padding: 2rem 4.5rem;    /* 原本是 1.5rem 3rem */
  font-size: 2rem;         /* 原本是 1.5rem */
  
  border-radius: 60px;     /* 配合放大後的比例調整圓角 */
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;               /* 圖示與文字的間距 */
  
  /* 保持動畫 */
  animation: breathe 2s infinite ease-in-out;
  transition: all 0.3s;
  font-weight: bold;       /* 讓文字更清晰 */
}

.open-btn:hover {
  background: rgba(255, 77, 77, 0.1);
  transform: scale(1.05);  /* 滑鼠移上去微幅放大 */
}

.env-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
}


/* 信封主體 */
.valentines {
  position: relative;
  width: 300px;
  height: 200px;
  cursor: pointer;
  animation: float 3s linear infinite;
}

.envelope {
  position: relative;
  width: 300px;
  height: 200px;
  background-color: #f08080;
  z-index: 2;
}
.envelope:before {
  content: "";
  position: absolute;
  width: 212px;
  height: 212px;
  background-color: #f08080;
  transform: rotate(45deg);
  top: -106px;
  left: 44px;
  border-radius: 30px 0 0 0;
}

/* 修正後的卡片：統一寬度與置中 */
/* 修正後的卡片：縮小並置中 */
.card {
  position: absolute;
  background-color: #eae2b7;
  
  /* 關鍵修改：將寬度從 280px 降到 260px */
  width: 260px; 
  height: 170px;
  
  /* 關鍵修改：調整 left，讓 260px 在 300px 的信封中左右各有 20px 留白 */
  top: 10px;
  left: 20px; 
  
  box-shadow: -5px -5px 50px rgba(0,0,0,0.1);
  transition: transform 0.6s ease-in-out;
  z-index: 3;
  
  /* 確保內容不會撐開卡片 */
  box-sizing: border-box; 
  overflow: hidden;
}

/* 修正卡片內文字，避免擠壓感 */
.card-text {
  text-align: center;
  font-family: 'Brush Script MT', cursive;
  font-size: 22px; /* 稍微調小字體 */
  color: #003049;
  padding: 20px 10px 0 10px; /* 增加左右內距防止貼邊 */
  line-height: 1.2;
}
.card-up {
  transform: translateY(-110px); /* 向上彈出的距離 */
}

/* 信封前片 */
.front {
  position: absolute;
  width: 0; height: 0;
  border-right: 180px solid #f4978e;
  border-top: 95px solid transparent;
  border-bottom: 100px solid transparent;
  left: 120px;
  top: 0;
  z-index: 10;
}
.front:before {
  content: "";
  position: absolute;
  border-left: 300px solid #f8ad9d;
  border-top: 195px solid transparent;
  left: -120px;
  top: -95px;
}

/* 漂浮的小愛心 */
.hearts { position: absolute; top: 50px; left:0; width: 100%; z-index: 1; }
.one, .two, .three, .four, .five {
  background-color: red;
  width: 10px; height: 10px;
  position: absolute;
  transform: rotate(-45deg);
  opacity: 0;
}
.one:before, .one:after, .two:before, .two:after, .three:before, .three:after, .four:before, .four:after, .five:before, .five:after {
  content: ""; background: red; border-radius: 50%; width: 10px; height: 10px; position: absolute;
}
.one:before, .two:before, .three:before, .four:before, .five:before { top: -5px; left: 0; }
.one:after, .two:after, .three:after, .four:after, .five:after { left: 5px; top: 0; }

.one { left: 10%; animation: heart-rise 1s infinite; }
.two { left: 30%; animation: heart-rise 2s infinite; }
.three { left: 50%; animation: heart-rise 1.5s infinite; }
.four { left: 70%; animation: heart-rise 2.3s infinite; }
.five { left: 90%; animation: heart-rise 1.7s infinite; }

/* 陰影 */
.shadow {
  width: 300px;
  height: 20px;
  background: rgba(0,0,0,0.3);
  border-radius: 50%;
  margin-top: 40px;
  animation: shadow-scale 3s infinite;
}

/* 確保掉落的圖片自動適應容器寬度 */
.falling-img {
  width: 100%;
  height: auto;
  display: block;
}

/* 呼吸動畫微調 (確保放大後的按鈕動畫流暢) */
@keyframes breathe {
  0%, 100% { 
    transform: scale(1); 
    box-shadow: 0 0 15px rgba(255, 77, 77, 0.4); 
  }
  50% { 
    transform: scale(1.05); 
    box-shadow: 0 0 35px rgba(255, 77, 77, 0.8); 
  }
}

/* 所有動畫定義 */
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
@keyframes shadow-scale { 0%, 100% { transform: scaleX(1); opacity: 0.8; } 50% { transform: scaleX(0.8); opacity: 0.4; } }
@keyframes fall { 0% { transform: translateY(-50px); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateY(110vh) rotate(360deg); } }
@keyframes heart-rise {
  0% { transform: translateY(0) rotate(-45deg) scale(0.3); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(-100px) rotate(-45deg) scale(1.2); opacity: 0; }
}

/* 通用過場動畫 */
.fade-leave-active, .zoom-enter-active { transition: all 1s ease; }
.zoom-enter-from { opacity: 0; transform: scale(0.5); }

/* 新增：詢問文字的樣式 */
.question-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem; /* 文字和按鈕的間距 */
  z-index: 101;
}

.question-text {
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 2px;
  text-align: center;
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 新增：Step 3 祝福頁面的樣式 */
.greeting-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
}

.greeting-text {
  color: #ffccbc; /* 溫柔的粉膚色 */
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  line-height: 1.5;
  text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
  animation: fadeInZoom 2s ease-in-out;
}

.decoration-flower {
  width: 60px;
  opacity: 0.9;
  animation: floatFlower 3s ease-in-out infinite;
}

.left-flower {
  animation-delay: 0s;
  transform: rotate(-15deg);
}

.right-flower {
  animation-delay: 1.5s; /* 錯開動畫時間 */
  transform: rotate(15deg);
}

/* 文字淡入並微幅放大特效 */
@keyframes fadeInZoom {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

/* 花朵上下飄浮特效 */
@keyframes floatFlower {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

/* 1. 修改通用的 fade 轉場：讓「離開」變得非常緩慢 (2秒) */
.fade-enter-active {
  transition: opacity 1s ease;
}
.fade-leave-active {
  transition: opacity 2s ease-in-out; /* 關鍵：讓黑幕與文字慢慢消失 */
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 2. 新增：掉落物專用的緩慢淡入 */
.slow-fade-enter-active {
  transition: opacity 3s ease; /* 掉落物慢慢浮現 */
}
.slow-fade-enter-from {
  opacity: 0;
}

/* 1. 清除瀏覽器預設邊距 */
:global(body) {
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止捲軸出現 */
  background-color: #301A47; /* 預設背景色設為紫色，避免閃爍 */
}

/* 2. 確保主容器佔滿螢幕 */
.main-container {
  position: absolute; /* 強制定位 */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #301A47;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 確保 padding 不會撐大寬度 */
}

/* 3. 確保掉落物容器也是滿版 */
.falling-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden; /* 避免掉落物超出邊界產生捲軸 */
}.item { position: absolute; top: -50px; animation: fall linear infinite; }



.overlay {
  /* ...保留原本設定... */
  background-color: #000; /* 這是 Step 1-3 的黑色背景 */
  z-index: 100; /* 蓋在紫色上面，當它 fade out 時，紫色就會顯現 */
}

.letter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* 半透明黑底 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200; /* 確保在最上層 */
  backdrop-filter: blur(5px); /* 背景模糊特效 */
}

.letter-paper {
  background: #fffdf0; /* 米黃色信紙 */
  width: 90%;
  max-width: 500px;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  position: relative;
  transform: rotate(-1deg); /* 微微傾斜更有手寫感 */
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.letter-content {
  font-family: 'Noto Serif TC', serif; /* 使用之前引入的好看字體 */
  font-size: 1.2rem;
  color: #5d4037;
  line-height: 1.8;
  text-align: left;
}

.signature {
  text-align: right;
  margin-top: 30px;
  font-weight: bold;
  font-size: 1.4rem;
}

/* 關閉按鈕 */
.close-letter {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #aaa;
  cursor: pointer;
  transition: color 0.3s;
}

.close-letter:hover {
  color: #ff4d4d;
}

/* 彈出動畫 */
@keyframes popIn {
  from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
  to { opacity: 1; transform: scale(1) rotate(-1deg); }
}
</style>