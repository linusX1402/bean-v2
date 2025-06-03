<script lang="ts" setup>
import { iconList } from '../../types/types';
import { getCookie, setCookie } from 'typescript-cookie';
import type BeanSession from '../../models/session';

enum loginViews {
  login = 0,
  create = 1,
  copy = 2,
}

let baseURL = useRuntimeConfig().public.baseURL;

// ToDo: change to login
const currentView = ref<loginViews>(loginViews.copy);

const permissions = ref<string[]>(['Admin', 'Edit', 'View']);
const selectedPermission = ref<string>('Admin');
const currentSession = ref<BeanSession | undefined>();

const sessionId = ref<number>(0);

const sessionName = ref<string>('');
const icon = ref<string>('🫘');
const options = ref<string[]>();
const copied = ref<boolean>(false);

onMounted(async () => {
  const cookieSessionId = getCookie('BeanSession') || '';
  currentSession.value = await getSessionById(cookieSessionId);
  console.log(currentSession.value ? 'found session' : 'No session found');
});

function submitLogin() {
  console.log(sessionId.value);
}

async function submitCreate() {
  try {
    const session = await $fetch(`${baseURL}/api/session/open`, {
      method: 'POST',
      body: {
        sessionName: sessionName.value,
        icon: icon.value,
      },
    });
    if (session) {
      currentSession.value = session as BeanSession;
      console.log('Session created successfully:', currentSession.value);
    } else {
      console.error('Failed to create session');
      return;
    }

    // currentSession.value = sessionController.openNewSession(
    //   sessionName.value,
    //   icon.value,
    // );

    setCookie('BeanSession', currentSession.value.sessionIdAdmin);
    currentView.value = loginViews.copy;
  } catch (e: any) {
    console.log('failed to open new Session');
  }
}

function changeView(updatedView: loginViews) {
  currentView.value = updatedView;
}

function getCurrentLink(permission?: string) {
  const perm = permission ? permission : selectedPermission.value;
  let sessionIdByPerm: string | undefined = '';
  if (perm === 'Admin') {
    sessionIdByPerm = currentSession.value?.sessionIdAdmin;
  } else if (perm === 'Edit') {
    sessionIdByPerm = currentSession.value?.sessionIdEditor;
  } else if (perm === 'View') {
    sessionIdByPerm = currentSession.value?.sessionIdUser;
  }

  return baseURL + '/session/' + sessionIdByPerm;
}

function copyToClipboard() {
  const link = getCurrentLink();
  navigator.clipboard
    .writeText(link)
    .then(() => {
      copied.value = true;
      setTimeout(() => (copied.value = false), 2000);
      console.log('Link copied to clipboard:', link);
    })
    .catch((err) => {
      console.error('Failed to copy link:', err);
    });
}
</script>

<template>
  <main>
    <div
      class="flex h-screen w-screen flex-col place-content-start place-items-center gap-16 px-10 md:gap-32"
    >
      <h1>Bean-Counter 🫘</h1>
      <div
        class="min-h-[50%] w-full rounded-md border border-solid border-black/20 px-12 py-16 sm:min-h-[33%] sm:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-fit"
      >
        <form
          v-if="currentView === loginViews.login"
          class="flex h-full flex-col place-content-between place-items-center gap-8"
          @submit.prevent="submitLogin"
        >
          <div
            class="flex flex-col place-content-center place-items-center gap-8"
          >
            <h4>Join a Session</h4>
            <div>
              <label>Session ID:</label>
              <form-text
                v-model="sessionId"
                :is-required="true"
                name="sessionId"
                placeholder="Session ID"
              />
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
            class="flex flex-col place-content-center place-items-center gap-8"
          >
            <h4>Create a Session</h4>
            <div class="flex flex-col gap-2">
              <div>
                <label>Session Name:</label>
                <form-text
                  v-model="sessionName"
                  :is-required="true"
                  name="sessionId"
                  placeholder="Session Name"
                />
              </div>
            </div>
            <div>
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
          </div>
          <div
            class="grid w-full grid-cols-2 place-content-center place-items-center gap-4"
          >
            <ui-button
              @click="changeView(loginViews.login)"
              :style="'secondary'"
              :type="'button'"
              >join</ui-button
            >
            <ui-button :style="'primary'" :type="'submit'">create</ui-button>
          </div>
        </form>
        <section
          v-if="currentView === loginViews.copy"
          class="flex h-full flex-col place-content-between place-items-center gap-8"
        >
          <h4>Copy to share</h4>
          <div>
            <label>permissions:</label>
            <div>
              <select
                v-model="selectedPermission"
                class="h-fit w-full rounded-md border border-solid border-black/50 p-1"
              >
                <option v-for="i in permissions" :value="i">{{ i }}</option>
              </select>
            </div>
          </div>
          <div class="flex w-full flex-row-reverse gap-8">
            <button type="button">
              <LazyIcon
                :name="copied ? 'bean:check' : 'bean:copy'"
                @click="copyToClipboard"
                class="size-6"
              />
            </button>
            <p class="w-full overflow-x-auto text-nowrap">
              {{ getCurrentLink() }}
            </p>
          </div>
          <div
            class="grid w-full grid-cols-2 place-content-center place-items-center gap-4"
          >
            <ui-button
              @click="changeView(loginViews.create)"
              :style="'secondary'"
              :type="'button'"
              >back</ui-button
            >
            <a class="w-full" :href="getCurrentLink('Admin')">
              <ui-button :style="'primary'" :type="'button'"
                >continue</ui-button
              >
            </a>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
