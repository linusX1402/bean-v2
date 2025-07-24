<script lang="ts" setup>
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { getDynamicBaseURL } from '~/composables/dynamic-base-url';
import LoginCopy from '~/components/login/login-copy.vue';
import cookieService from '~/composables/cookie-service';
import LoginFooter from '~/components/login/login-footer.vue';
import { DEFAULT_ICON, loginViews, PLACEHOLDERS } from '~/constants/constants';
import LoginJoin from '~/components/login/login-join.vue';
import type BeanSession from '~/models/bean-session';

let baseUrl = getDynamicBaseURL();

const currentView = ref<loginViews>(loginViews.join);

const currentSession = ref<BeanSession | undefined>();

const createSessionError = ref<boolean>(false);
const loginSessionError = ref<boolean>(false);

const doForwardUser = ref<boolean>(cookieService().getForwardCookie());

onMounted(async () => {
  const cookieSessionId = cookieService().getCurrentSession();
  const doForwardCookie = cookieService().getForwardCookie();
  const doForwardSession = sessionStorage.getItem('forward') || 'true';
  if (cookieSessionId) {
    currentSession.value = await getSessionById(cookieSessionId);
  }

  if (doForwardSession === 'true' && doForwardCookie && currentSession.value) {
    forwardUserToUrl(cookieSessionId);
  }
  if (cookieSessionId && !currentSession.value) {
    removeCookie('bean_sessions');
  }
});

function forwardUserToUrl(uuid: string) {
  window.location.href = `${baseUrl}/session/${uuid}/home`;
}

async function submitLogin(sessionNameInput: string) {
  currentSession.value = await getSessionById(sessionNameInput);
  if (currentSession.value) {
    const highestPermissionSessionId = getHighestPermissionSessionId();
    if (highestPermissionSessionId) {
      cookieService().addSession(
        highestPermissionSessionId,
        doForwardUser.value,
      );
      sessionStorage.setItem('forward', doForwardUser.value.toString());
    }
    setCookie('bean_icon', currentSession.value.icon);
    loginSessionError.value = false;
    forwardUserToUrl(getHighestPermissionSessionId() || '');
  } else {
    loginSessionError.value = true;
    console.error('No session with this id was found');
    return;
  }
}

function getHighestPermissionSessionId() {
  if (currentSession.value?.sessionIdAdmin) {
    return currentSession.value.sessionIdAdmin;
  } else if (currentSession.value?.sessionIdEditor) {
    return currentSession.value.sessionIdEditor;
  } else if (currentSession.value?.sessionIdUser) {
    return currentSession.value.sessionIdUser;
  }
}

async function submitCreate(newSession: BeanSession) {
  try {
    const session = await $fetch(`${baseUrl}/api/session/open`, {
      method: 'POST',
      body: {
        sessionName: newSession.name,
        icon: newSession.icon,
        beansPerTick: newSession.beansPerTick,
        secondsPerTick: newSession.secondsPerTick,
        startingFunds: newSession.startingFunds,
      },
    });
    if (session) {
      currentSession.value = session as unknown as BeanSession;
      cookieService().addSession(
        currentSession.value.sessionIdAdmin,
        doForwardUser.value,
      );
      sessionStorage.setItem('forward', doForwardUser.value.toString());
      createSessionError.value = false;
    } else {
      console.error('Failed to create session');
      return;
    }
    currentView.value = loginViews.copy;
  } catch (e: any) {
    createSessionError.value = true;
    console.error('failed to open new Session');
  }
}

function setForwardUser(value: boolean) {
  doForwardUser.value = value;
  cookieService().setForwardCookie(doForwardUser.value);
}

async function changeView(updatedView: loginViews, resetSession = false) {
  loginSessionError.value = false;
  createSessionError.value = false;
  currentView.value = updatedView;
  if (resetSession && currentSession.value) {
    const res = await $fetch(baseUrl + '/api/session/close', {
      method: 'DELETE',
      headers: {
        adminSessionId: currentSession.value.sessionIdAdmin,
      },
    });
    removeCookie('bean_sessions');
  }
}
</script>

<template>
  <main>
    <div
      class="flex h-screen w-screen flex-col place-content-start place-items-center gap-8 px-10"
    >
      <h1 class="py-10">Bean-Counter {{ DEFAULT_ICON }}</h1>
      <section
        class="flex h-full w-full place-content-center place-items-start"
      >
        <div
          class="h-fit w-full rounded-2xl bg-white px-12 py-16 sm:w-2/3 lg:w-[500px]"
        >
          <login-join
            :current-view="currentView"
            :do-forward-user="doForwardUser"
            :api-error="loginSessionError"
            @update:change-view="changeView"
            @update:forward-user="setForwardUser"
            @update:submit-login="submitLogin"
          />
          <login-create
            :do-forward-user="doForwardUser"
            :current-view="currentView"
            :api-error="createSessionError"
            @update:change-view="changeView"
            @update:submit-create="submitCreate"
            @update:forward-user="setForwardUser"
          />

          <login-copy
            v-if="currentView === loginViews.copy"
            @update:back="changeView(loginViews.create, true)"
            :current-session="currentSession"
          />
        </div>
      </section>
      <login-footer />
    </div>
  </main>
</template>

<style scoped></style>
