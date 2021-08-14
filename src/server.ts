import { prepareBot, launchBot } from './actions';
import { checkEnvironment } from './config';
import { handleStartupError, handleUnexpectedRejection } from './errors';

checkEnvironment().then(prepareBot).then(launchBot).catch(handleStartupError);

process.on('unhandledRejection', handleUnexpectedRejection);
