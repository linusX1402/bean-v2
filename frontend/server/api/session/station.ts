import jsonMapService from '~/composables/json-map-service';
import sessionController from '../../session-controller-instance';
import { BeanStation } from '~/models/bean-station';
import { broadcastUpdateStation } from '~/server/routes/ws';
export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'POST') {
    const body = await readBody(event);
    const { sessionId, stationName, hexColor } = body;

    if (!stationName || !hexColor || !sessionId) {
      throw createError({
        statusCode: 400,
        statusMessage: '[add-station] Missing required fields',
      });
    }

    const station = sessionController.addStation(
      stationName,
      hexColor,
      sessionId,
    );
    if (station) {
      const jsonStation = jsonMapService().station.toJson(station);
      broadcastUpdateStation(jsonStation);
      return jsonStation;
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: '[add-station] Session not found',
      });
    }
  }
});
