<script lang="ts" setup>
import { iconList } from '../../types/types';
import { getCookie, setCookie } from 'typescript-cookie';
import type BeanSession from '../../models/session';

enum loginViews {
  join = 0,
  create = 1,
  copy = 2,
}

let baseURL = useRuntimeConfig().public.baseURL;

const currentView = ref<loginViews>(loginViews.join);

const permissions = ref<string[]>(['Admin', 'Edit', 'View']);
const selectedPermission = ref<string>('Admin');
const currentSession = ref<BeanSession | undefined>();

const sessionInput = ref<string>('');
const sessionInputError = ref<boolean>(false);

const sessionName = ref<string>('');
const sessionNameError = ref<boolean>(false);
const icon = ref<string>('🫘');
const options = ref<string[]>();
const copied = ref<boolean>(false);

onMounted(async () => {
  const cookieSessionId = getCookie('BeanSession') || '';
  if (cookieSessionId) {
    currentSession.value = await getSessionById(cookieSessionId);
  }
  console.log(currentSession.value ? 'found session' : 'No session found');
  if (currentSession.value) {
    forwardUser(cookieSessionId);
  }
});

const router = useRouter();

function forwardUser(uuid: string) {
  const redirectPath = baseURL + '/session/' + uuid;
  console.log('Redirecting to:', redirectPath);
  window.location.href = redirectPath;
}

async function submitLogin() {
  currentSession.value = (await getSessionById(
    sessionInput.value,
  )) as BeanSession;
  if (currentSession.value) {
    sessionInputError.value = false;
    console.log('sessionId: ');
    console.log(currentSession.value);
    forwardUser(currentSession.value.getHighestPermissionSessionId());
  } else {
    sessionInputError.value = true;
    console.error('No session with this id was found');
    return;
  }
}

// function getHighestPermissionSessionId(session: BeanSession): string {
//   if (selectedPermission.value === 'Admin') {
//     return currentSession.value?.sessionIdAdmin || '';
//   } else if (selectedPermission.value === 'Edit') {
//     return currentSession.value?.sessionIdEditor || '';
//   } else if (selectedPermission.value === 'View') {
//     return currentSession.value?.sessionIdUser || '';
//   }
//   return '';
// }

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
    currentView.value = loginViews.copy;
  } catch (e: any) {
    console.log('failed to open new Session');
  }
}

function changeView(updatedView: loginViews) {
  sessionInputError.value = false;
  sessionNameError.value = false;
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

function forwardAndSaveCookie() {
  if (currentSession.value) {
    setCookie('BeanSession', currentSession.value.sessionIdAdmin);
    forwardUser(currentSession.value.sessionIdAdmin);
  } else {
  }
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
          v-if="currentView === loginViews.join"
          class="flex h-full flex-col place-content-between place-items-center gap-8"
          @submit.prevent="submitLogin"
        >
          <div
            class="flex flex-col place-content-center place-items-center gap-8 md:w-2/3"
          >
            <h4>Join a Session</h4>
            <div class="w-full">
              <label class="w-full">Session ID / Session Name: </label>
              <label v-if="sessionNameError" class="pl-4 text-red-500"
                >Invalid Session name!</label
              >
              <form-text
                v-model="sessionInput"
                :is-required="true"
                name="sessionId"
                placeholder="Tim's game"
              />
            </div>
            <label class="text-red-500" v-if="sessionInputError"
              >No session with this id was found</label
            >
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
                  :max-length="50"
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
              @click="changeView(loginViews.join)"
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
            <a class="w-full" @click="forwardAndSaveCookie">
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
