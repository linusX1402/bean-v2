import BeanSession from '~/models/bean-session';
import { BeanStation } from '~/models/bean-station';

export default function () {
  const session = {
    toJson(obj: BeanSession): string {
      console.log('[toJson]', obj);
      let stations = obj.stations as Map<number, any>;
      stations.forEach((s) => {
        Object.defineProperty(s, 'children', {
          value: Array.from(s.children),
          writable: true,
          configurable: true,
        });
      });
      let arrayJsonStations = Array.from(stations);
      let jsonObj = JSON.parse(JSON.stringify(obj)) as any;
      jsonObj.stations = arrayJsonStations;
      return JSON.stringify(jsonObj);
    },

    fromJson(jsonString: any): BeanSession {
      const jsonObj = JSON.parse(jsonString);
      let stationsArray = jsonObj.stations as [number, any][];
      let stationsMap = new Map<number, any>(stationsArray);
      stationsMap.forEach((s) => {
        s.children = new Map(s.children);
      });
      jsonObj.stations = stationsMap;
      return new BeanSession(
        jsonObj._name,
        jsonObj._icon,
        jsonObj.sessionIdAdmin,
        jsonObj.sessionIdEditor,
        jsonObj.sessionIdUser,
        jsonObj.secondsPerTick,
        jsonObj.beansPerTick,
        jsonObj.startingFunds,
        stationsMap,
      );
    },
  };

  const station = {
    toJson(obj: BeanStation): string {
      let children = obj.children as Map<number, any>;
      children.forEach((c) => {
        Object.defineProperty(c, 'id', {
          value: c.id,
          writable: true,
          configurable: true,
        });
      });
      let arrayJsonChildren = Array.from(children);
      let jsonObj = JSON.parse(JSON.stringify(obj)) as any;
      jsonObj.children = arrayJsonChildren;
      return JSON.stringify(jsonObj);
    },

    fromJson(jsonString: any): BeanStation {
      const jsonObj = JSON.parse(jsonString);
      let childrenArray = jsonObj.children as [number, any][];
      let childrenMap = new Map<number, any>(childrenArray);
      jsonObj.children = childrenMap;
      return new BeanStation(jsonObj.hexColor, jsonObj.name, jsonObj.id);
    },
  };

  return {
    session,
    station,
  };
}
