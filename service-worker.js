importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');
// Cache your assets
workbox.routing.registerRoute(
  /\.(?:js|css|ttf)$/,
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
  /\.(?:html|jpg|jpeg|png|gif|svg)$/,
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  /\.(?:html|jpg|jpeg|png|gif|svg).*$/,
  new workbox.strategies.CacheFirst()
);

const imageDelivery = /^https:\/\/jnz3dtiuj77ca\.dummycachetest\.com\/.*\.(html|jpg|jpeg|png|gif|svg)$/;

workbox.routing.registerRoute(
  imageDelivery,
  new workbox.strategies.CacheFirst({
    cacheName: 'commerce-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0], // Cache responses with a 200 status code
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100, // Cache a maximum of 50 responses
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
      }),
    ],
  })
);

const reviewLocation = /^https:\/\/reviewlocation\.aem-screens\.com\/.*$/;
workbox.routing.registerRoute(
  reviewLocation,
  new workbox.strategies.CacheFirst({
    cacheName: 'review-location',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200], // Cache responses with a 200 status code
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100, // Cache a maximum of 50 responses
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
      }),
    ],
  })
);


const offers = /^https:\/\/offers\.aem-screens\.com\/.*$/;
workbox.routing.registerRoute(
  offers,
  new workbox.strategies.CacheFirst({
    cacheName: 'offers',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200], // Cache responses with a 200 status code
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100, // Cache a maximum of 50 responses
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
      }),
    ],
  })
);


const graphQL = /^https:\/\/graphql\.aem-screens\.com\/.*$/;
workbox.routing.registerRoute(
  graphQL,
  new workbox.strategies.CacheFirst({
    cacheName: 'graphQL-Response',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200], // Cache responses with a 200 status code
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100, // Cache a maximum of 50 responses
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
      }),
    ],
  })
);

const franklinPreview = /^https:\/\/main--wknd--hlxscreens\.hlx\.page\/.*$/
workbox.routing.registerRoute(
  franklinPreview,
  new workbox.strategies.CacheFirst({
    cacheName: 'franklin-prview',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0], // Cache responses with a 200 status code
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100, // Cache a maximum of 50 responses
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
      }),
    ],
  })
);

const franklinLive = /^https:\/\/main--wknd--hlxscreens\.hlx\.live\/.*$/
workbox.routing.registerRoute(
  franklinLive,
  new workbox.strategies.CacheFirst({
    cacheName: 'franklin-live',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0], // Cache responses with a 200 status code
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100, // Cache a maximum of 50 responses
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
      }),
    ],
  })
);

const appRoot = '/screens-demo/wknd-kiosk-commerce';
workbox.routing.registerRoute(
  appRoot,
  new workbox.strategies.CacheFirst({
    cacheName: 'appRoot',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200], // Cache responses with a 200 status code
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100, // Cache a maximum of 50 responses
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
      }),
    ],
  })
);

const fonts = /^https:\/\/fonts\.googleapis\.com\/.*$/
workbox.routing.registerRoute(
  fonts,
  new workbox.strategies.CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0], // Cache responses with a 200 status code
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100, // Cache a maximum of 50 responses
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
      }),
    ],
  })
);

