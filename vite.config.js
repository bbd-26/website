import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 👇 加入這一行，將 '你的儲存庫名稱' 換成你剛剛在 GitHub 取的名字
  // 例如你的儲存庫叫 valentine-2026，這裡就填 '/valentine-2026/'
  // 注意前後都要有斜線 /
  base: '/website/', 
})