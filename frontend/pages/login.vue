<script lang="ts" setup>
import { iconList } from '~/types/types';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import type BeanSessionDTO from '~/models/bean-session-dto';
import { getDynamicBaseURL } from '~/composables/dynamic-base-url';
import LoginCopy from '~/components/data/login-copy.vue';
import cookieService from '~/composables/cookie-service';

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

const sessionName = ref<string>('');
const sessionNameError = ref<boolean>(false);
const doForwardUser = ref<boolean>(cookieService().getForwardCookie());
const icon = ref<string>('🫘');

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

async function submitCreate() {
  try {
    const session = await $fetch(`${baseUrl}/api/session/open`, {
      method: 'POST',
      body: {
        sessionName: sessionName.value,
        icon: icon.value,
      },
    });
    if (session) {
      sessionNameError.value = false;
      currentSession.value = session as unknown as BeanSessionDTO;
      cookieService().addSession(
        currentSession.value.sessionIdAdmin,
        doForwardUser.value,
      );
      sessionStorage.setItem('forward', doForwardUser.value.toString());
    } else {
      console.error('Failed to create session');
      return;
    }
    currentView.value = loginViews.copy;
  } catch (e: any) {
    sessionNameError.value = true;
    console.error('failed to open new Session');
  }
}

async function changeView(updatedView: loginViews, resetSession = false) {
  sessionInputError.value = false;
  sessionNameError.value = false;
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

const placeholders = [
  "Tim's game",
  "July's session",
  "Maxi's game",
  "Sophia's gathering",
  "Clemens's party",
  "Elena's game",
  "Hanna's party",
  "Linus's session",
  "Nina's gathering",
  "Lara's game",
  "Paula's session",
  "Pasis's party",
  "Tobi's gathering",
];

function getGamePlaceholder() {
  return placeholders[Math.floor(Math.random() * placeholders.length)];
}
</script>

<template>
  <main>
    <div
      class="flex h-screen w-screen flex-col place-content-start place-items-center gap-16 px-10 lg:gap-32"
    >
      <h1 class="py-10">Bean-Counter 🫘</h1>
      <div
        class="min-h-[50%] w-full rounded-2xl bg-white px-12 py-16 sm:min-h-[50%] sm:w-2/3 md:min-h-[33%] lg:w-[500px]"
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

        <form
          v-if="currentView === loginViews.create"
          class="flex h-full flex-col place-content-between place-items-center gap-8"
          @submit.prevent="submitCreate"
        >
          <div
            class="flex w-full flex-col place-content-center place-items-center gap-8"
          >
            <h4>Create a Session</h4>
            <div class="flex w-full flex-col gap-3">
              <div class="flex w-full flex-col gap-2">
                <div class="w-full">
                  <label class="w-full">Session Name:</label>
                  <label v-if="sessionNameError" class="text-red-500">
                    Invalid Session name!
                  </label>
                  <form-text
                    :max-length="50"
                    v-model="sessionName"
                    :is-required="true"
                    name="sessionId"
                    placeholder="Session Name"
                  />
                </div>
              </div>
              <div
                class="flex w-full place-content-start place-items-center gap-2"
              >
                <label>icon:</label>
                <div>
                  <select
                    v-model="icon"
                    class="h-fit w-full rounded-md border border-solid border-black/50 p-1"
                  >
                    <option v-for="i in iconList" :value="i">{{ i }}</option>
                  </select>
                </div>
              </div>
              <div
                class="flex w-full place-content-start place-items-center gap-2"
              >
                <label>Stay signed in</label>
                <input class="size-4" type="checkbox" v-model="doForwardUser" />
              </div>
            </div>
          </div>
          <div
            class="grid w-full grid-cols-2 place-content-center place-items-center gap-4"
          >
            <ui-button
              @click="changeView(loginViews.join)"
              :style="'secondary'"
              :type="'button'"
              >join</ui-button
            >
            <ui-button :style="'primary'" :type="'submit'">create</ui-button>
          </div>
        </form>
        <login-copy
          v-if="currentView === loginViews.copy"
          @update:back="changeView(loginViews.create, true)"
          :current-session="currentSession"
        />
      </div>
    </div>
  </main>
</template>

<style scoped></style>
