import { BeanStation } from '~/models/bean-station';
import BeanSession from '~/models/bean-session';
import { cookieService } from '#build/imports';
import { setCookie } from 'typescript-cookie';
import Child from '~/models/child';

const session = ref<BeanSession>();

export const useSession = () => {
  async function loadSessionBySlug(slug: string) {
    const sessionId = slug;

    const res = await getSessionById(sessionId);
    if (res === undefined) {
      // TODO: Toast message or forward to start page
      return new Error('Session not found');
    }
    session.value = res;

    if (session.value.getHighestPermissionSessionId() === '') {
      // TODO: Toast message or forward to start page
      return new Error('invalid session');
    } else {
      cookieService().addSession(sessionId);
      setCookie('bean_icon', session.value.icon);
      return true;
    }
  }

  function get() {
    return session.value;
  }

  function getStationById(stationId: number) {}

  function addStation(station: BeanStation) {
    session.value?.stations.set(station.id, station);
  }

  function updateChild(stationId: number, child: Child) {
    const station = session.value?.stations.get(stationId);
    session.value?.stations.get(stationId)?.children.set(child.id, child);
  }

  async function addChild(stationId: number, child: Child) {
    console.log('trying to add child', child, 'with stationId', stationId);
    try {
      let res = (await $fetch('/api/session/addChild', {
        method: 'POST',
        body: {
          name: child.name,
          stationId: stationId,
          sessionId: get()?.getHighestPermissionSessionId(),
        },
      })) as unknown as Child;
      const resChild = new Child(
        res.name,
        res.id,
        res.numberOfBeansEarned,
        res.numberOfBeansToPayout,
      );
      session.value?.stations
        .get(stationId)
        ?.children.set(resChild.id, resChild);
    } catch (error) {
      // TODO: Toast message
      console.error('Error adding child:', error);
    }
  }

  function setBeans(stationId: number, childId: number, amount: number) {
    try {
      const child = session.value?.stations
        .get(stationId)
        ?.children.get(childId);
      child!.numberOfBeansToPayout += amount;
      child!.numberOfBeansEarned += amount;
      session.value?.stations.get(stationId)?.children.set(childId, child!);
    } catch (error) {
      // TODO: Toast message (child not found ...)
      console.error('Error setting beans:', error);
    }
  }

  return {
    loadSessionBySlug,
    get,
    addStation,
    updateChild,
    addChild,
    addBeans: setBeans,
  };
};
