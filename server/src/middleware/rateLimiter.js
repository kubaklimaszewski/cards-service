const store = {}; 
// store[key] = { attempts, firstAttemptAt }

function checkLimit(identifier, windowMs, maxAttempts) {
  const now = Date.now();
  const entry = store[identifier];

  if (!entry) {
    store[identifier] = { attempts: 1, firstAttemptAt: now };
    return { allowed: true };
  }

  const withinWindow = now - entry.firstAttemptAt <= windowMs;

  if (!withinWindow) {
    store[identifier] = { attempts: 1, firstAttemptAt: now };
    return { allowed: true };
  }

  if (entry.attempts >= maxAttempts) {
    const retryAfterMs = entry.firstAttemptAt + windowMs - now;
    const retryAfterSec = Math.ceil(retryAfterMs / 1000);
    return { allowed: false, retryAfterSec };
  }

  entry.attempts += 1;
  return { allowed: true };
}

module.exports = { checkLimit };
