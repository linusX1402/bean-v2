import type { BeanStation } from '~/models/bean-station';
import BeanSession from '~/models/bean-session';
import { cookieService } from '#build/imports';
import { setCookie } from 'typescript-cookie';
import BeanSessionDTO from '~/models/bean-session-dto';
import type Child from '~/models/child';

const session = ref<BeanSessionDTO>();
export const useSession = () => {
  async function loadSessionBySlug(slug: string) {
    const sessionId = slug;

    const res = await getSessionById(sessionId);
    session.value = new BeanSessionDTO(
      res?.name || '',
      res?.icon || '',
      res?.sessionIdAdmin || '',
      res?.sessionIdEditor || '',
      res?.sessionIdUser || '',
      res?.secondsPerTick,
      res?.beansPerTick,
      res?.startingFunds,
      res?.stations || [],
    );
    if (session.value.getHighestPermissionStationId() === '') {
      console.log('invalid session');
      return false;
    } else {
      cookieService().addSession(sessionId);
      setCookie('bean_icon', session.value.icon);
      return true;
    }
  }

  function get() {
    return session.value;
  }

  function addStation(station: BeanStation) {
    session.value?.stations.push(station);
  }

  function updateChild(stationId: number, child: Child) {
    const station = session.value?.stations.find(
      (station) => station.id === stationId,
    );
    if (station) {
      const childIndex = station.children.findIndex((c) => c.id === child.id);
      if (childIndex !== -1) {
        station.children[childIndex] = child;
        if (typeof station.children[childIndex].lastCheckout === 'string') {
          station.children[childIndex].lastCheckout = new Date(
            station.children[childIndex].lastCheckout,
          );
        }
      }
    }
  }

  function reloadChild(childId: number) {}

  return { loadSessionBySlug, get, addStation, updateChild };
};
