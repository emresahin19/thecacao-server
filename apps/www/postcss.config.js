const devMode = true || process.env.NEXT_PUBLIC_APP_MODE === 'development';

module.exports = devMode ? {plugins: {}} : {
    plugins: {
        'postcss-import': {},
        'autoprefixer': {},
        '@fullhuman/postcss-purgecss': {
            content: [
                './pages/**/*.{js,jsx,ts,tsx}',
                './components/**/*.{js,jsx,ts,tsx}',
                './layouts/**/*.{js,jsx,ts,tsx}',
                './src/**/*.{js,jsx,ts,tsx}',
            ],
            css: ['./styles/**/*.scss'],
            safelist: [
                'carousel-1-item',
                'carousel-2-item',
                'carousel-3-item',
                'carousel-4-item',
                'carousel-5-item',
                '.dot',
                '.dot',
                '#category-1',
                /^#category-1/,
                /^counter/,
                /^dot/,
                /^carousel-/,
                /^gg-/,
            ],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        },
    },
}