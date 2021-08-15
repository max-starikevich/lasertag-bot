require('module-alias/register');

import { launchBot } from '@/actions/init';
import { checkEnvironment } from '@/config';
import { handleStartupError, handleUnexpectedRejection } from '@/errors';

checkEnvironment().then(launchBot).catch(handleStartupError);

process.on('unhandledRejection', handleUnexpectedRejection);
