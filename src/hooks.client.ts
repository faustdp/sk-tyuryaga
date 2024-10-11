import type { HandleClientError } from '@sveltejs/kit'

// Sentry.init({});
export const handleError: HandleClientError = async ({ error, event, status, message }) => {
  console.log('hooks.client5', { error, event, status, message })
  // 	const errorId = crypto.randomUUID();
  // 	Sentry.captureException(error, {
  // 		extra: { event, errorId, status },
  // 	});
  // 	return {
  // 		message: 'Whoops!',
  // 		errorId,
  // 	};
}

// mockTelegramEnv({
//   themeParams: {
//     accentTextColor: '#6ab2f2',
//     bgColor: '#17212b',
//     buttonColor: '#5288c1',
//     buttonTextColor: '#ffffff',
//     destructiveTextColor: '#ec3942',
//     headerBgColor: '#17212b',
//     hintColor: '#708499',
//     linkColor: '#6ab3f3',
//     secondaryBgColor: '#232e3c',
//     sectionBgColor: '#17212b',
//     sectionHeaderTextColor: '#6ab3f3',
//     subtitleTextColor: '#708499',
//     textColor: '#f5f5f5',
//   },
//   initData: {
//     user: {
//       id: 883729040,
//       firstName: 'Denis',
//       username: 'paskodenis',
//       languageCode: 'en',
//       isPremium: true,
//       allowsWriteToPm: true,
//     },
//     hash: '34ed36bf7e67585d9d78c6d07bae62c8d59902d22cd24cb119c180cda909ff5d',
//     authDate: new Date(1728214924000),
//     startParam: 'debug',
//     chatType: 'private',
//     chatInstance: '8084724315231179358',
//   },
//   initDataRaw: new URLSearchParams([
//     [
//       'user',
//       JSON.stringify({
//         id: 883729040,
//         first_name: 'Denis',
//         username: 'paskodenis',
//         language_code: 'en',
//         is_premium: true,
//         allows_write_to_pm: true,
//       }),
//     ],
//     ['hash', '34ed36bf7e67585d9d78c6d07bae62c8d59902d22cd24cb119c180cda909ff5d'],
//     ['auth_date', '1728214924'],
//     ['start_param', 'debug'],
//     ['chat_type', 'private'],
//     ['chat_instance', '8084724315231179358'],
//   ]).toString(),
//   version: '7.2',
//   platform: 'tdesktop',
// })
