const devMode = true || process.env.NODE_ENV === 'development';

module.exports = {
    plugins: {
        'postcss-import': {},
        'autoprefixer': {},
        ...(devMode
            ? {}  // PurgeCSS'i sadece prod ortamda çalıştır
            : {
                  '@fullhuman/postcss-purgecss': {
                      content: [
                          '../../lib/components/**/*.{js,jsx,ts,tsx}',
                          '../../lib/interfaces/**/*.{js,jsx,ts,tsx}',
                          '../../lib/layouts/**/*.{js,jsx,ts,tsx}',
                          '../../lib/constants/**/*.{js,jsx,ts,tsx}',
                          '../../lib/contexts/**/*.{js,jsx,ts,tsx}',
                          '../../lib/hooks/**/*.{js,jsx,ts,tsx}',
                          '../../lib/lib/**/*.{js,jsx,ts,tsx}',
                          '../../lib/pages/**/*.{js,jsx,ts,tsx}',
                          '../../lib/services/**/*.{js,jsx,ts,tsx}',
                          '../../lib/store/**/*.{js,jsx,ts,tsx}',
                          '../../lib/utils/**/*.{js,jsx,ts,tsx}',
                          '../../lib/views/**/*.{js,jsx,ts,tsx}',
                      ],
                      css: ['../../**/*.scss'],
                      safelist: [
                          'carousel-1-item',
                          'carousel-2-item',
                          'carousel-3-item',
                          'carousel-4-item',
                          'carousel-5-item',
                          '.dot',
                          /^counter/,
                          /^dot/,
                          /^carousel-/,
                          /^gg-/,
                          {
                              pattern: /^#/,
                          },
                      ],
                      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
                  },
              }),
        'cssnano': {
            preset: 'default',
        },
    },
};
