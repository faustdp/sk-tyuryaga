import type { HandleClientError } from '@sveltejs/kit'

// Sentry.init({});
export const handleError: HandleClientError = async ({ message }) => {
  // console.log('hooks.client5', { error, event, status, message })
  return {
    message,
  }
  // 	const errorId = crypto.randomUUID();
  // 	Sentry.captureException(error, {
  // 		extra: { event, errorId, status },
  // 	});
  // 	return {
  // 		message: 'Whoops!',
  // 		errorId,
  // 	};
}
