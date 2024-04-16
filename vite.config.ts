// vite.config.js
import { defineConfig } from "vite"
import { vi } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Vitest를 사용할 때 전역변수로 assert 등의 테스트 유틸리티를 사용할 수 있도록 설정
    environment: "jsdom", // 브라우저 환경을 모방하는 jsdom을 테스트 환경으로 사용
  },
})
