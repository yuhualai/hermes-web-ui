<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { setApiKey, hasApiKey } from "@/api/client";
import { fetchAuthStatus, loginWithPassword } from "@/api/auth";

const { t } = useI18n();
const router = useRouter();

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");
const showLockResetHint = ref(false);

// If already has a key, try to go to main page
if (hasApiKey()) {
  router.replace("/hermes/chat");
}

onMounted(async () => {
  try {
    await fetchAuthStatus();
  } catch {
    // Login remains available; the submit request will surface connection errors.
  }
});

async function handleLogin() {
  await handlePasswordLogin();
}

async function handlePasswordLogin() {
  if (!username.value.trim() || !password.value) {
    errorMsg.value = t("login.credentialsRequired");
    return;
  }

  loading.value = true;
  errorMsg.value = "";
  showLockResetHint.value = false;

  try {
    const sessionToken = await loginWithPassword(username.value.trim(), password.value);
    setApiKey(sessionToken);
    router.replace("/hermes/chat");
  } catch (err: any) {
    if (err.status === 429 || err.status === 503) {
      errorMsg.value = t("login.tooManyAttempts");
      showLockResetHint.value = true;
    } else {
      errorMsg.value = err.message || t("login.invalidCredentials");
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-view">
    <div class="login-shell">
      <section class="login-brand-panel" aria-hidden="true">
        <div class="brand-logo-wrap">
          <img src="/logo.png" alt="" width="72" height="72" />
        </div>
        <div class="brand-rhythm">
          <span class="rhythm-line rhythm-line-primary"></span>
          <span class="rhythm-line"></span>
          <span class="rhythm-line rhythm-line-short"></span>
        </div>
        <div class="brand-grid">
          <span v-for="cell in 18" :key="cell"></span>
        </div>
      </section>

      <div class="login-card">
        <div class="login-logo">
          <img src="/logo.png" alt="Hermes" width="56" height="56" />
        </div>
        <h1 class="login-title">{{ t("login.title") }}</h1>
        <p class="login-desc">{{ t("login.description") }}</p>
        <p class="login-default-hint">{{ t("login.defaultCredentialsHint") }}</p>

        <form class="login-form" @submit.prevent="handleLogin">
          <input
            v-model="username"
            type="text"
            class="login-input"
            :placeholder="t('login.usernamePlaceholder')"
            autofocus
          />
          <input
            v-model="password"
            type="password"
            class="login-input"
            :placeholder="t('login.passwordPlaceholder')"
            @keyup.enter="handleLogin"
          />

          <div v-if="errorMsg" class="login-error">{{ errorMsg }}</div>
          <div v-if="showLockResetHint" class="login-lock-hint">
            <span>{{ t("login.lockResetHint") }}</span>
            <code>hermes-web-ui clear-login-locks --restart</code>
            <span>{{ t("login.defaultLoginResetHint") }}</span>
            <code>hermes-web-ui reset-default-login</code>
          </div>
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? "..." : t("login.submit") }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/variables" as *;

.login-view {
  height: calc(100 * var(--vh));
  display: grid;
  place-items: center;
  padding: 32px;
  background:
    linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.08), transparent 32%),
    linear-gradient(180deg, $bg-primary, $bg-secondary);
}

.login-shell {
  width: min(980px, 100%);
  min-height: 560px;
  display: grid;
  grid-template-columns: minmax(320px, 0.92fr) minmax(360px, 1fr);
  overflow: hidden;
  border: 1px solid $border-color;
  border-radius: 8px;
  background: $bg-card;
  box-shadow: 0 24px 70px rgba(var(--text-primary-rgb), 0.12);
}

.login-brand-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  overflow: hidden;
  background:
    linear-gradient(145deg, rgba(var(--accent-primary-rgb), 0.14), transparent 55%),
    $bg-secondary;
  border-right: 1px solid $border-color;
}

.brand-logo-wrap {
  width: 92px;
  height: 92px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(var(--accent-primary-rgb), 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.68);
  box-shadow: 0 16px 36px rgba(var(--text-primary-rgb), 0.08);
}

.brand-rhythm {
  display: grid;
  gap: 14px;
  width: min(280px, 100%);
}

.rhythm-line {
  height: 14px;
  border-radius: 999px;
  background: rgba(var(--text-muted-rgb), 0.2);
}

.rhythm-line-primary {
  width: 72%;
  background: rgba(var(--accent-primary-rgb), 0.55);
}

.rhythm-line-short {
  width: 48%;
}

.brand-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  max-width: 270px;

  span {
    aspect-ratio: 1;
    border: 1px solid rgba(var(--accent-primary-rgb), 0.18);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.42);
  }
}

.login-card {
  width: 100%;
  max-width: 520px;
  align-self: center;
  justify-self: center;
  padding: 56px;
  background: $bg-card;
  text-align: left;

  @media (max-width: $breakpoint-mobile) {
    padding: 32px 24px;
  }
}

.login-logo {
  display: none;
  margin-bottom: 24px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: $text-primary;
  margin: 0 0 12px;
  line-height: 1.2;
}

.login-desc {
  font-size: 14px;
  color: $text-secondary;
  margin: 0 0 12px;
  line-height: 1.6;
}

.login-default-hint {
  margin: 0 0 28px;
  font-family: $font-code;
  font-size: 13px;
  color: $text-secondary;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-input {
  width: 100%;
  height: 46px;
  padding: 0 15px;
  border: 1px solid $border-color;
  border-radius: 8px;
  font-size: 15px;
  color: $text-primary;
  background: $bg-input;
  outline: none;
  transition: border-color $transition-fast, box-shadow $transition-fast;
  box-sizing: border-box;
  font-family: $font-ui;

  &::placeholder {
    color: $text-muted;
  }

  &:focus {
    border-color: $accent-primary;
    box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb), 0.12);
  }
}

.login-error {
  font-size: 13px;
  color: $error;
  text-align: left;
}

.login-lock-hint {
  padding: 10px 12px;
  border: 1px solid rgba(var(--warning-rgb), 0.35);
  border-radius: 8px;
  background: rgba(var(--warning-rgb), 0.08);
  color: $text-secondary;
  font-size: 12px;
  line-height: 1.5;
  text-align: left;

  code {
    display: block;
    margin-top: 4px;
    color: $text-primary;
    font-family: $font-code;
    word-break: break-all;
  }
}

.login-btn {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 8px;
  background: $accent-primary;
  color: var(--text-on-accent);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color $transition-fast, transform $transition-fast, opacity $transition-fast;

  &:hover {
    background: $accent-hover;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@media (max-width: 860px) {
  .login-view {
    padding: 16px;
  }

  .login-shell {
    min-height: auto;
    grid-template-columns: 1fr;
  }

  .login-brand-panel {
    display: none;
  }

  .login-card {
    max-width: none;
    text-align: center;
  }

  .login-logo {
    display: block;
  }
}
</style>
