import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssImportExtGlob from 'postcss-import-ext-glob';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import fs from 'node:fs/promises';
import path from 'node:path';

export const cssConfig = eleventyConfig => {
  eleventyConfig.addTemplateFormats('css');

  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (inputContent, inputPath) => {
      // Determine the output path based on the input path
      let outputPath;

      if (inputPath.endsWith('/src/assets/css/global.css')) {
        outputPath = './src/_includes/css/global-inline.css';
      } else if (inputPath.includes('/src/assets/css/components/')) {
        const filename = path.basename(inputPath);
        outputPath = `./dist/assets/components/${filename}`;
      } else {
        // Return an empty function for any CSS files that do not match the specific paths
        return () => '';
      }

      // Process the CSS file using PostCSS
      const result = await postcss([
        postcssImportExtGlob,
        postcssImport,
        tailwindcss,
        autoprefixer,
        cssnano
      ]).process(inputContent, {from: inputPath});

      // Ensure the directory for the output file exists
      await fs.mkdir(path.dirname(outputPath), {recursive: true});

      // Write the processed CSS to the output location
      await fs.writeFile(outputPath, result.css);

      // Return a function that provides the CSS for inclusion in the site
      return () => result.css;
    }
  });
};
