import {
  MAX_BEANS_PER_TICK,
  MAX_SECONDS_PER_TICK,
  MAX_STARTING_FUNDS,
  MIN_BEANS_PER_TICK,
  MIN_SECONDS_PER_TICK,
  MIN_STARTING_FUNDS,
} from '~/constants/constants';
import {
  openNewSession,
  validateName,
} from '../../session-controller-instance';
import { MAX } from 'uuid';
import BeanSessionDTO from '~/models/bean-session-dto';
import NewBeanSessionDTO from '~/models/new-bean-session-dto';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'POST') {
    const body = await readBody(event);

    const { sessionName, icon, beansPerTick, secondsPerTick, startingFunds } =
      body;

    if (
      !sessionName ||
      !icon ||
      !beansPerTick ||
      !secondsPerTick ||
      !startingFunds
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      });
    }
    if (
      beansPerTick < MIN_BEANS_PER_TICK ||
      beansPerTick > MAX_BEANS_PER_TICK ||
      secondsPerTick < MIN_SECONDS_PER_TICK ||
      secondsPerTick > MAX_SECONDS_PER_TICK ||
      startingFunds < MIN_STARTING_FUNDS ||
      startingFunds > MAX_STARTING_FUNDS ||
      icon.length === 1 ||
      !validateName(sessionName)
    ) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Invalid session parameter values',
      });
    }
    return openNewSession({
      name: sessionName,
      icon: icon,
      beansPerTick: beansPerTick,
      secondsPerTick: secondsPerTick,
      startingFunds: startingFunds,
    });
  }
});
