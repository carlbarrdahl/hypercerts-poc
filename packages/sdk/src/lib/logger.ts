type LogLevel = 'INFO' | 'WARN' | 'ERROR';

const isProd = process.env.NODE_ENV === 'production';

function log(level: LogLevel, message: string, data?: any) {
  if (isProd && level === 'INFO') return; // skip info in production

  const timestamp = new Date().toISOString();
  const caller = getCallerModule();
  const output = `[${timestamp}] [${level}] [${caller}] ${message}`;

  if (data !== undefined) {
    console.log(output, data);
  } else {
    console.log(output);
  }
}

function getCallerModule(): string {
  // Capture stack trace and extract file name
  const err = new Error();
  const stack = err.stack?.split('\n') || [];
  // The 4th line usually contains the caller (adjust if necessary)
  const callerLine = stack[3] || '';
  const match = callerLine.match(/at\s+(?:.*\/)?([^\/]+\.ts)/);
  return match?.[1] ?? "unknown";
}

export const Logger = {
  info: (msg: string, data?: any) => log('INFO', msg, data),
  warn: (msg: string, data?: any) => log('WARN', msg, data),
  error: (msg: string, data?: any) => log('ERROR', msg, data),
};
