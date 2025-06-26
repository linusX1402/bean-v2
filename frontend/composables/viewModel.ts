import { BeanStation } from '~/models/bean-station';
import BeanSession from '~/models/bean-session';
import { cookieService } from '#build/imports';
import { setCookie } from 'typescript-cookie';
import BeanSessionDTO from '~/models/bean-session-dto';
import Child from '~/models/child';

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
    session.value?.stations.forEach((station) => {
      station.children.forEach((child) => {
        if (typeof child.lastCheckout === 'string') {
          child.lastCheckout = new Date(child.lastCheckout);
        }
        if (typeof child.lastCheckin === 'string') {
          child.lastCheckin = new Date(child.lastCheckin);
        }
      });
    });

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
    const newStation = new BeanStation(
      station.hexColor,
      station.name,
      station.id,
    );
    session.value?.stations.push(newStation);
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
        if (typeof station.children[childIndex].lastCheckin === 'string') {
          station.children[childIndex].lastCheckin = new Date(
            station.children[childIndex].lastCheckin,
          );
        }
      }
    }
  }

  async function addChild(stationId: number, child: Child) {
    const stationIndex = session.value?.stations.findIndex(
      (station) => station.id === stationId,
    );
    try {
      let res = (await $fetch('/api/session/addChild', {
        method: 'POST',
        body: {
          name: child.name,
          stationId: stationId,
          sessionId: get()?.getHighestPermissionStationId(),
        },
      })) as unknown as Child;
      const resChild = new Child(
        res.name,
        res.id,
        res.numberOfBeansEarned,
        res.numberOfBeansToPayout,
      );
      session.value?.stations[stationIndex!].children.push(resChild);
    } catch (error) {
      console.error('Error adding child:', error);
    }
  }

  function setBeans(stationId: number, childId: number, amount: number) {
    const stationIndex = session.value?.stations.findIndex(
      (station) => station.id === stationId,
    );
    const childIndex = session.value?.stations[
      stationIndex ?? -1
    ].children.findIndex((child) => child.id === childId);
    if (stationIndex !== undefined && childIndex !== undefined) {
      const child = session.value?.stations[stationIndex].children[childIndex];
      if (child) {
        session.value!.stations[stationIndex].children[
          childIndex
        ].numberOfBeansEarned += amount;
        session.value!.stations[stationIndex].children[
          childIndex
        ].numberOfBeansToPayout += amount;
      }
      console.log('beans to pay out: ', child?.numberOfBeansToPayout);
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
