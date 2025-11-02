<template>
  <footer class="footer">
    <div class="footer-content">
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
        class="beian-link"
      >
        皖ICP备2025094768号
      </a>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 80px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px clamp(16px, 3vw, 40px);
  text-align: center;
}

.beian-link {
  color: #666;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.beian-link:hover {
  color: #17c5c5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer {
    margin-top: 60px;
  }

  .footer-content {
    padding: 20px 12px;
  }

  .beian-link {
    font-size: 13px;
  }
}
</style>
