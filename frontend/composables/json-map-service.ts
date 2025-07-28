import BeanSession from '~/models/bean-session';
import { BeanStation } from '~/models/bean-station';
import type Child from '~/models/child';

export default function () {
  const session = {
    toJson(obj: BeanSession): string {
      const stations = obj.stations as Map<number, any>;
      const arrayJsonStations = Array.from(stations, ([key, value]) => {
        return [key, { ...value, children: Array.from(value.children || []) }];
      });
      const jsonObj = { ...obj, stations: arrayJsonStations };
      return JSON.stringify(jsonObj);
    },

    fromJson(jsonString: any): BeanSession {
      const jsonObj = JSON.parse(jsonString);
      const stationsArray = jsonObj.stations as [number, any][];
      const stationsMap = new Map<number, any>(
        stationsArray.map(([key, value]) => {
          return [key, { ...value, children: new Map(value.children || []) }];
        }),
      );
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
      const childrenArray = Array.from(obj.children || []);
      const jsonObj = { ...obj, children: childrenArray };
      return JSON.stringify(jsonObj);
    },

    fromJson(jsonString: any): BeanStation {
      const jsonObj = JSON.parse(jsonString);
      const childrenMap = new Map(jsonObj.children || []) as Map<number, Child>;
      return new BeanStation(
        jsonObj.hexColor,
        jsonObj.name,
        jsonObj.id,
        childrenMap,
      );
    },
  };

  return {
    session,
    station,
  };
}
