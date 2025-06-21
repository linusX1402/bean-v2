<script lang="ts" setup>
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import type BeanSessionDTO from '~/models/bean-session-dto';
import { getDynamicBaseURL } from '~/composables/dynamic-base-url';
import LoginCopy from '~/components/login/login-copy.vue';
import cookieService from '~/composables/cookie-service';
import LoginFooter from '~/components/login/login-footer.vue';
import { DEFAULT_ICON, PLACEHOLDERS } from '~/constants/constants';

enum loginViews {
  join = 0,
  create = 1,
  copy = 2,
}

let baseUrl = getDynamicBaseURL();

const currentView = ref<loginViews>(loginViews.join);

const currentSession = ref<BeanSessionDTO | undefined>();

const sessionInput = ref<string>('');
const sessionInputError = ref<boolean>(false);

const createSessionError = ref<boolean>(false);

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

async function submitLogin() {
  currentSession.value = await getSessionById(sessionInput.value);
  if (currentSession.value) {
    sessionInputError.value = false;
    const highestPermissionSessionId = getHighestPermissionSessionId();
    if (highestPermissionSessionId) {
      cookieService().addSession(
        highestPermissionSessionId,
        doForwardUser.value,
      );
      sessionStorage.setItem('forward', doForwardUser.value.toString());
    }
    setCookie('bean_icon', currentSession.value.icon);
    forwardUserToUrl(getHighestPermissionSessionId() || '');
  } else {
    sessionInputError.value = true;
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

async function submitCreate(newSession: BeanSessionDTO) {
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
      currentSession.value = session as unknown as BeanSessionDTO;
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
  sessionInputError.value = false;
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

function getGamePlaceholder() {
  return PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];
}
</script>

<template>
  <main>
    <div
      class="flex h-screen w-screen flex-col place-content-start place-items-center gap-16 px-10 lg:gap-32"
    >
      <h1 class="py-10">Bean-Counter {{ DEFAULT_ICON }}</h1>
      <div
        class="h-fit w-full rounded-2xl bg-white px-12 py-16 sm:w-2/3 lg:w-[500px]"
      >
        <form
          v-if="currentView === loginViews.join"
          class="flex h-full flex-col place-content-between place-items-center gap-8"
          @submit.prevent="submitLogin"
        >
          <div
            class="flex w-full flex-col place-content-center place-items-center gap-8"
          >
            <h4>Join a Session</h4>
            <div class="w-full">
              <label class="w-full">Session ID / Session Name: </label>
              <label class="text-red-500" v-if="sessionInputError"
                >No session with this id was found</label
              >
              <form-text
                v-model="sessionInput"
                :is-required="true"
                name="sessionId"
                :placeholder="getGamePlaceholder()"
              />
            </div>
            <div
              class="flex w-full place-content-start place-items-center gap-2"
            >
              <label>Stay signed in</label>
              <input class="size-4" type="checkbox" v-model="doForwardUser" />
            </div>
          </div>
          <div
            class="grid w-full grid-cols-2 place-content-center place-items-center gap-4"
          >
            <ui-button
              @click="changeView(loginViews.create)"
              :style="'secondary'"
              :type="'button'"
              >create</ui-button
            >
            <ui-button :style="'primary'" :type="'submit'">submit</ui-button>
          </div>
        </form>
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
      <login-footer />
    </div>
  </main>
</template>

<style scoped></style>
