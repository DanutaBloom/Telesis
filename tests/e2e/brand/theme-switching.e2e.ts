import { expect, test } from '@playwright/test';

/**
 * Theme Switching and Brand Consistency Tests
 * Tests dark/light theme switching functionality and brand element adaptation
 */

test.describe('Theme Switching and Brand Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Light to Dark Theme Transition', () => {
    test('should transition brand elements smoothly between themes', async ({ page }) => {
      // Create a comprehensive theme switching test page
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Theme Switching Test</title>
            <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              :root {
                --background: 0 0% 99%;
                --foreground: 220 13% 20%;
                --primary: 171 19% 41%;
                --sage-quietude: 171 19% 41%;
                --sage-growth: 102 58% 32%;
                --muted-foreground: 220 8% 46%;
              }
              
              .dark {
                --background: 220 13% 9%;
                --foreground: 0 0% 95%;
                --primary: 171 19% 65%;
                --sage-quietude: 171 19% 65%;
                --sage-growth: 102 58% 50%;
                --muted-foreground: 220 8% 65%;
              }
              
              * {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                margin: 0;
                padding: 0;
                background: hsl(var(--background));
                color: hsl(var(--foreground));
              }
              
              .theme-controls {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                display: flex;
                gap: 12px;
                background: hsl(var(--background));
                border: 1px solid hsl(var(--primary));
                border-radius: 8px;
                padding: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              }
              
              .theme-button {
                padding: 8px 12px;
                border: 1px solid hsl(var(--primary));
                border-radius: 4px;
                background: transparent;
                color: hsl(var(--foreground));
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
              }
              
              .theme-button:hover {
                background: hsl(var(--primary));
                color: white;
              }
              
              .theme-button.active {
                background: hsl(var(--primary));
                color: white;
              }
              
              .theme-showcase {
                padding: 40px 20px;
                max-width: 1200px;
                margin: 0 auto;
              }
              
              .showcase-section {
                background: hsl(var(--background));
                border: 1px solid hsl(var(--primary) / 0.2);
                border-radius: 12px;
                padding: 30px;
                margin-bottom: 30px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
              }
              
              .dark .showcase-section {
                box-shadow: 0 2px 8px rgba(255,255,255,0.05);
              }
              
              .brand-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 2px solid hsl(var(--sage-quietude));
              }
              
              .logo-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 30px 0;
              }
              
              .logo-item {
                border: 1px solid hsl(var(--primary) / 0.2);
                border-radius: 8px;
                padding: 24px;
                text-align: center;
                background: hsl(var(--background));
              }
              
              .color-demo {
                padding: 20px;
                border-radius: 8px;
                margin: 16px 0;
                border: 1px solid hsl(var(--primary) / 0.2);
              }
            </style>
          </head>
          <body>
            <div class="theme-controls">
              <button class="theme-button active" data-testid="light-theme-btn" onclick="setTheme('light')">
                ☀️ Light
              </button>
              <button class="theme-button" data-testid="dark-theme-btn" onclick="setTheme('dark')">
                🌙 Dark
              </button>
              <button class="theme-button" data-testid="auto-theme-btn" onclick="setTheme('auto')">
                🔄 Auto
              </button>
            </div>

            <div class="theme-showcase">
              <div class="showcase-section">
                <div class="brand-header">
                  <div data-testid="main-logo"></div>
                  <div>
                    <h1 style="margin: 0; color: hsl(var(--sage-quietude));">Theme Switching Test</h1>
                    <p style="margin: 8px 0 0 0; color: hsl(var(--muted-foreground));">
                      Testing brand consistency across theme changes
                    </p>
                  </div>
                </div>

                <div class="logo-grid">
                  <div class="logo-item" data-testid="light-theme-demo">
                    <h3 style="color: hsl(var(--sage-quietude));">Light Theme</h3>
                    <div data-testid="logo-light-demo"></div>
                    <p style="color: hsl(var(--muted-foreground)); margin-top: 16px;">
                      Default color scheme optimized for light backgrounds
                    </p>
                  </div>

                  <div class="logo-item" data-testid="dark-theme-demo">
                    <h3 style="color: hsl(var(--sage-quietude));">Dark Theme</h3>
                    <div data-testid="logo-dark-demo"></div>
                    <p style="color: hsl(var(--muted-foreground)); margin-top: 16px;">
                      Reverse color scheme for dark backgrounds
                    </p>
                  </div>

                  <div class="logo-item" data-testid="adaptive-theme-demo">
                    <h3 style="color: hsl(var(--sage-quietude));">Adaptive</h3>
                    <div data-testid="logo-adaptive-demo"></div>
                    <p style="color: hsl(var(--muted-foreground)); margin-top: 16px;">
                      Automatically adapts to current theme
                    </p>
                  </div>
                </div>
              </div>

              <div class="showcase-section">
                <h2 style="color: hsl(var(--sage-quietude));">Brand Colors in Current Theme</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                  <div class="color-demo" style="background: hsl(var(--sage-quietude) / 0.1); border-color: hsl(var(--sage-quietude));">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                      <div data-testid="quietude-color-logo"></div>
                      <h4 style="margin: 0; color: hsl(var(--sage-quietude));" data-testid="quietude-heading">Sage Quietude</h4>
                    </div>
                    <div style="width: 100%; height: 40px; background: hsl(var(--sage-quietude)); border-radius: 4px; margin: 12px 0;"></div>
                    <p style="margin: 0; color: hsl(var(--foreground));" data-testid="quietude-description">
                      Primary brand color - adapts to theme while maintaining brand recognition
                    </p>
                  </div>

                  <div class="color-demo" style="background: hsl(var(--sage-growth) / 0.1); border-color: hsl(var(--sage-growth));">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                      <div data-testid="growth-color-logo"></div>
                      <h4 style="margin: 0; color: hsl(var(--sage-growth));" data-testid="growth-heading">Sage Growth</h4>
                    </div>
                    <div style="width: 100%; height: 40px; background: hsl(var(--sage-growth)); border-radius: 4px; margin: 12px 0;"></div>
                    <p style="margin: 0; color: hsl(var(--foreground));" data-testid="growth-description">
                      Accent brand color - maintains vibrancy across light and dark themes
                    </p>
                  </div>
                </div>
              </div>

              <div class="showcase-section">
                <h2 style="color: hsl(var(--sage-quietude));">Typography Theme Adaptation</h2>
                <div data-testid="typography-demo">
                  <h1 style="color: hsl(var(--sage-quietude)); font-size: 2.5rem; margin-bottom: 16px;">
                    Large Heading
                  </h1>
                  <h2 style="color: hsl(var(--sage-growth)); margin-bottom: 12px;">
                    Section Heading
                  </h2>
                  <p style="color: hsl(var(--foreground)); line-height: 1.6; margin-bottom: 16px;">
                    This is body text that demonstrates how typography adapts to theme changes while maintaining 
                    optimal readability and contrast ratios. The text should be clearly legible in both light and dark themes.
                  </p>
                  <small style="color: hsl(var(--muted-foreground));">
                    Small text and captions also adapt appropriately to ensure accessibility compliance.
                  </small>
                </div>
              </div>
            </div>

            <script>
              function setTheme(theme) {
                const html = document.documentElement;
                const buttons = document.querySelectorAll('.theme-button');
                
                // Remove active class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                document.querySelector(\`[data-testid="\${theme}-theme-btn"]\`).classList.add('active');
                
                if (theme === 'dark') {
                  html.classList.add('dark');
                  html.setAttribute('data-theme', 'dark');
                  updateLogos('dark');
                } else if (theme === 'light') {
                  html.classList.remove('dark');
                  html.setAttribute('data-theme', 'light');
                  updateLogos('light');
                } else {
                  // Auto theme - detect system preference
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    html.classList.add('dark');
                    html.setAttribute('data-theme', 'dark');
                    updateLogos('dark');
                  } else {
                    html.classList.remove('dark');
                    html.setAttribute('data-theme', 'light');
                    updateLogos('light');
                  }
                }
              }
              
              function updateLogos(theme) {
                // Update logos based on current theme
                updateMainLogos();
                updateColorLogos();
              }
              
              function updateMainLogos() {
                const isDark = document.documentElement.classList.contains('dark');
                
                // Main logo
                const mainLogo = document.querySelector('[data-testid="main-logo"]');
                if (mainLogo) {
                  mainLogo.innerHTML = createLogoHTML('lg', 'horizontal', isDark ? 'reverse' : 'default');
                }
                
                // Light demo logo (always light colors)
                const lightDemo = document.querySelector('[data-testid="logo-light-demo"]');
                if (lightDemo) {
                  lightDemo.innerHTML = createLogoHTML('default', 'horizontal', 'default');
                }
                
                // Dark demo logo (always reverse colors)
                const darkDemo = document.querySelector('[data-testid="logo-dark-demo"]');
                if (darkDemo) {
                  darkDemo.innerHTML = createLogoHTML('default', 'horizontal', 'reverse');
                }
                
                // Adaptive demo logo (changes with theme)
                const adaptiveDemo = document.querySelector('[data-testid="logo-adaptive-demo"]');
                if (adaptiveDemo) {
                  adaptiveDemo.innerHTML = createLogoHTML('default', 'horizontal', isDark ? 'reverse' : 'default');
                }
              }
              
              function updateColorLogos() {
                const isDark = document.documentElement.classList.contains('dark');
                
                // Quietude logo
                const quietudeLogo = document.querySelector('[data-testid="quietude-color-logo"]');
                if (quietudeLogo) {
                  quietudeLogo.innerHTML = createLogoHTML('sm', 'logomark', isDark ? 'reverse' : 'default');
                }
                
                // Growth logo  
                const growthLogo = document.querySelector('[data-testid="growth-color-logo"]');
                if (growthLogo) {
                  growthLogo.innerHTML = createLogoHTML('sm', 'logomark', isDark ? 'reverse' : 'default');
                }
              }
              
              function createLogoHTML(size, variant, colorScheme) {
                const sizeMap = {
                  'sm': { width: 32, height: 12, textClass: 'text-sm' },
                  'default': { width: 48, height: 18, textClass: 'text-base' },
                  'lg': { width: 64, height: 24, textClass: 'text-lg' },
                  'xl': { width: 80, height: 30, textClass: 'text-xl' },
                };
                
                const { width: svgWidth, height: svgHeight, textClass } = sizeMap[size] || sizeMap.default;
                
                // Color schemes
                let colors;
                if (colorScheme === 'reverse') {
                  colors = {
                    ask: 'transparent',
                    askStroke: '#ffffff',
                    think: '#ffffff',
                    apply: '#ffffff',
                    textColor: 'text-white'
                  };
                } else if (colorScheme === 'monochrome') {
                  colors = {
                    ask: 'currentColor',
                    askStroke: 'currentColor',
                    think: 'currentColor',
                    apply: 'currentColor',
                    textColor: 'text-current'
                  };
                } else {
                  colors = {
                    ask: 'transparent',
                    askStroke: 'hsl(171, 19%, 41%)',
                    think: 'hsl(171, 19%, 41%)',
                    apply: 'hsl(102, 58%, 32%)',
                    textColor: 'text-foreground'
                  };
                }
                
                if (variant === 'logomark') {
                  return \`
                    <svg width="\${svgWidth}" height="\${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" role="img" aria-label="Telesis">
                      <title>Telesis Logo</title>
                      <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                      <g id="three-olives-logomark">
                        <ellipse cx="8" cy="9" rx="6" ry="8" fill="\${colors.ask}" stroke="\${colors.askStroke}" stroke-width="1.5"/>
                        <ellipse cx="24" cy="9" rx="6" ry="8" fill="\${colors.think}" stroke="none"/>
                        <ellipse cx="40" cy="9" rx="6" ry="8" fill="\${colors.apply}" stroke="none"/>
                      </g>
                    </svg>
                  \`;
                } else {
                  return \`
                    <div class="inline-flex items-center gap-x-2 \${textClass}" role="img" aria-label="Telesis - Ask, Think, Apply">
                      <svg width="\${svgWidth}" height="\${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                        <title>Telesis Logo</title>
                        <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                        <g id="three-olives-logomark">
                          <ellipse cx="8" cy="9" rx="6" ry="8" fill="\${colors.ask}" stroke="\${colors.askStroke}" stroke-width="1.5"/>
                          <ellipse cx="24" cy="9" rx="6" ry="8" fill="\${colors.think}" stroke="none"/>
                          <ellipse cx="40" cy="9" rx="6" ry="8" fill="\${colors.apply}" stroke="none"/>
                        </g>
                      </svg>
                      <div class="select-none font-semibold tracking-tight \${colors.textColor}">Telesis</div>
                    </div>
                  \`;
                }
              }
              
              // Initialize logos
              document.addEventListener('DOMContentLoaded', function() {
                updateMainLogos();
                updateColorLogos();
              });
            </script>
          </body>
        </html>
      `);

      // Wait for logos to load
      await page.waitForTimeout(1000);

      // Verify initial light theme state
      await expect(page.locator('[data-testid="main-logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="logo-light-demo"]')).toBeVisible();
      await expect(page.locator('[data-testid="logo-dark-demo"]')).toBeVisible();
      await expect(page.locator('[data-testid="logo-adaptive-demo"]')).toBeVisible();

      // Take initial light theme screenshot
      await expect(page.locator('body')).toHaveScreenshot('theme-switching-light.png', {
        fullPage: true,
        threshold: 0.2
      });

      // Switch to dark theme
      await page.locator('[data-testid="dark-theme-btn"]').click();
      await page.waitForTimeout(500); // Allow for transition

      // Verify dark theme state
      await expect(page.locator('html')).toHaveClass(/dark/);

      // Take dark theme screenshot
      await expect(page.locator('body')).toHaveScreenshot('theme-switching-dark.png', {
        fullPage: true,
        threshold: 0.2
      });

      // Switch back to light theme
      await page.locator('[data-testid="light-theme-btn"]').click();
      await page.waitForTimeout(500); // Allow for transition

      // Verify light theme restoration
      await expect(page.locator('html')).not.toHaveClass(/dark/);

      // Test auto theme
      await page.locator('[data-testid="auto-theme-btn"]').click();
      await page.waitForTimeout(500);

      // Take auto theme screenshot (should match system preference)
      await expect(page.locator('body')).toHaveScreenshot('theme-switching-auto.png', {
        fullPage: true,
        threshold: 0.2
      });
    });

    test('should maintain brand consistency during theme transitions', async ({ page }) => {
      // Test rapid theme switching to ensure stability
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Brand Consistency Test</title>
            <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
            <style>
              :root {
                --background: 0 0% 99%;
                --foreground: 220 13% 20%;
                --primary: 171 19% 41%;
              }
              .dark {
                --background: 220 13% 9%;
                --foreground: 0 0% 95%;
                --primary: 171 19% 65%;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                margin: 0;
                padding: 20px;
                background: hsl(var(--background));
                color: hsl(var(--foreground));
                transition: all 0.3s ease;
              }
              .consistency-test {
                max-width: 800px;
                margin: 0 auto;
                padding: 30px;
                border: 1px solid hsl(var(--primary));
                border-radius: 12px;
              }
              .brand-elements {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 30px 0;
              }
              .element-card {
                padding: 20px;
                border: 1px solid hsl(var(--primary) / 0.3);
                border-radius: 8px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="consistency-test">
              <div style="text-align: center; margin-bottom: 30px;">
                <div data-testid="consistency-logo" style="margin-bottom: 20px;"></div>
                <h1 style="color: hsl(var(--primary)); margin-bottom: 10px;">Brand Consistency Test</h1>
                <button data-testid="rapid-switch-btn" 
                        style="padding: 10px 20px; border: 1px solid hsl(var(--primary)); background: transparent; color: hsl(var(--foreground)); border-radius: 4px; cursor: pointer;">
                  Rapid Theme Switch Test
                </button>
              </div>

              <div class="brand-elements">
                <div class="element-card">
                  <h3 style="color: hsl(var(--primary)); margin-bottom: 16px;">Navigation Logo</h3>
                  <div data-testid="nav-logo"></div>
                </div>
                <div class="element-card">
                  <h3 style="color: hsl(var(--primary)); margin-bottom: 16px;">Content Logo</h3>
                  <div data-testid="content-logo"></div>
                </div>
                <div class="element-card">
                  <h3 style="color: hsl(var(--primary)); margin-bottom: 16px;">Footer Logo</h3>
                  <div data-testid="footer-logo"></div>
                </div>
                <div class="element-card">
                  <h3 style="color: hsl(var(--primary)); margin-bottom: 16px;">Icon Logo</h3>
                  <div data-testid="icon-logo"></div>
                </div>
              </div>

              <div data-testid="brand-verification" style="margin-top: 30px; padding: 20px; border-radius: 8px; background: hsl(var(--primary) / 0.1);">
                <h3 style="color: hsl(var(--primary)); margin-bottom: 12px;">Brand Element Verification</h3>
                <div data-testid="svg-count">SVG Elements: <span id="svg-count-value">0</span></div>
                <div data-testid="ellipse-count">Olive Elements: <span id="ellipse-count-value">0</span></div>
                <div data-testid="logo-count">Logo Instances: <span id="logo-count-value">0</span></div>
              </div>
            </div>

            <script>
              let currentTheme = 'light';
              let switchCount = 0;
              
              function updateLogos() {
                const isDark = currentTheme === 'dark';
                
                const logos = [
                  { selector: '[data-testid="consistency-logo"]', size: 'xl', variant: 'stacked' },
                  { selector: '[data-testid="nav-logo"]', size: 'default', variant: 'horizontal' },
                  { selector: '[data-testid="content-logo"]', size: 'lg', variant: 'horizontal' },
                  { selector: '[data-testid="footer-logo"]', size: 'sm', variant: 'stacked' },
                  { selector: '[data-testid="icon-logo"]', size: 'default', variant: 'logomark' }
                ];
                
                const sizeMap = {
                  'sm': { width: 32, height: 12, textClass: 'text-sm' },
                  'default': { width: 48, height: 18, textClass: 'text-base' },
                  'lg': { width: 64, height: 24, textClass: 'text-lg' },
                  'xl': { width: 80, height: 30, textClass: 'text-xl' },
                };
                
                logos.forEach(({ selector, size, variant }) => {
                  const element = document.querySelector(selector);
                  const { width: svgWidth, height: svgHeight, textClass } = sizeMap[size];
                  
                  if (element) {
                    const colors = isDark ? {
                      ask: 'transparent',
                      askStroke: '#ffffff',
                      think: '#ffffff',
                      apply: '#ffffff',
                      textColor: 'text-white'
                    } : {
                      ask: 'transparent',
                      askStroke: 'hsl(171, 19%, 41%)',
                      think: 'hsl(171, 19%, 41%)',
                      apply: 'hsl(102, 58%, 32%)',
                      textColor: 'text-foreground'
                    };
                    
                    let html = '';
                    if (variant === 'logomark') {
                      html = \`
                        <svg width="\${svgWidth}" height="\${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" role="img" aria-label="Telesis">
                          <title>Telesis Logo</title>
                          <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                          <g id="three-olives-logomark">
                            <ellipse cx="8" cy="9" rx="6" ry="8" fill="\${colors.ask}" stroke="\${colors.askStroke}" stroke-width="1.5"/>
                            <ellipse cx="24" cy="9" rx="6" ry="8" fill="\${colors.think}" stroke="none"/>
                            <ellipse cx="40" cy="9" rx="6" ry="8" fill="\${colors.apply}" stroke="none"/>
                          </g>
                        </svg>
                      \`;
                    } else if (variant === 'stacked') {
                      html = \`
                        <div class="inline-flex flex-col gap-y-1 \${textClass} items-center" role="img" aria-label="Telesis - Ask, Think, Apply">
                          <svg width="\${svgWidth}" height="\${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200 mb-1">
                            <title>Telesis Logo</title>
                            <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                            <g id="three-olives-logomark">
                              <ellipse cx="8" cy="9" rx="6" ry="8" fill="\${colors.ask}" stroke="\${colors.askStroke}" stroke-width="1.5"/>
                              <ellipse cx="24" cy="9" rx="6" ry="8" fill="\${colors.think}" stroke="none"/>
                              <ellipse cx="40" cy="9" rx="6" ry="8" fill="\${colors.apply}" stroke="none"/>
                            </g>
                          </svg>
                          <div class="select-none font-semibold tracking-tight text-center \${colors.textColor}">
                            Telesis
                            <div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">Ask. Think. Apply.</div>
                          </div>
                        </div>
                      \`;
                    } else {
                      html = \`
                        <div class="inline-flex items-center gap-x-2 \${textClass}" role="img" aria-label="Telesis - Ask, Think, Apply">
                          <svg width="\${svgWidth}" height="\${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                            <title>Telesis Logo</title>
                            <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                            <g id="three-olives-logomark">
                              <ellipse cx="8" cy="9" rx="6" ry="8" fill="\${colors.ask}" stroke="\${colors.askStroke}" stroke-width="1.5"/>
                              <ellipse cx="24" cy="9" rx="6" ry="8" fill="\${colors.think}" stroke="none"/>
                              <ellipse cx="40" cy="9" rx="6" ry="8" fill="\${colors.apply}" stroke="none"/>
                            </g>
                          </svg>
                          <div class="select-none font-semibold tracking-tight \${colors.textColor}">Telesis</div>
                        </div>
                      \`;
                    }
                    element.innerHTML = html;
                  }
                });
                
                // Update verification counts
                updateVerificationCounts();
              }
              
              function updateVerificationCounts() {
                const svgCount = document.querySelectorAll('svg').length;
                const ellipseCount = document.querySelectorAll('ellipse').length;
                const logoCount = document.querySelectorAll('[role="img"][aria-label*="Telesis"]').length;
                
                document.getElementById('svg-count-value').textContent = svgCount;
                document.getElementById('ellipse-count-value').textContent = ellipseCount;
                document.getElementById('logo-count-value').textContent = logoCount;
              }
              
              function switchTheme() {
                const html = document.documentElement;
                
                if (currentTheme === 'light') {
                  html.classList.add('dark');
                  currentTheme = 'dark';
                } else {
                  html.classList.remove('dark');
                  currentTheme = 'light';
                }
                
                updateLogos();
                switchCount++;
              }
              
              document.querySelector('[data-testid="rapid-switch-btn"]').addEventListener('click', async function() {
                this.disabled = true;
                this.textContent = 'Switching themes...';
                
                // Rapid switch test - 10 switches with delays
                for (let i = 0; i < 10; i++) {
                  switchTheme();
                  await new Promise(resolve => setTimeout(resolve, 200));
                }
                
                this.disabled = false;
                this.textContent = \`Completed \${switchCount} switches\`;
              });
              
              // Initialize
              updateLogos();
            </script>
          </body>
        </html>
      `);

      await page.waitForTimeout(1000);

      // Verify initial state
      await expect(page.locator('[data-testid="consistency-logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="content-logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="footer-logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="icon-logo"]')).toBeVisible();

      // Verify initial brand element counts
      const initialSvgCount = await page.textContent('#svg-count-value');
      const initialEllipseCount = await page.textContent('#ellipse-count-value');
      const initialLogoCount = await page.textContent('#logo-count-value');

      expect(Number(initialSvgCount)).toBeGreaterThan(0);
      expect(Number(initialEllipseCount)).toBe(Number(initialSvgCount) * 3); // 3 ellipses per SVG
      expect(Number(initialLogoCount)).toBeGreaterThan(0);

      // Take before rapid switching screenshot
      await expect(page.locator('body')).toHaveScreenshot('theme-consistency-before.png', {
        fullPage: true,
        threshold: 0.2
      });

      // Perform rapid theme switching test
      await page.locator('[data-testid="rapid-switch-btn"]').click();

      // Wait for rapid switching to complete
      await page.waitForFunction(() => {
        const button = document.querySelector('[data-testid="rapid-switch-btn"]');
        return button && button.textContent.includes('Completed');
      }, { timeout: 10000 });

      // Verify brand elements are still intact after rapid switching
      const finalSvgCount = page;
      const finalEllipseCount = page;
      const finalLogoCount = page;

      await expect(finalSvgCount).toHaveText('#svg-count-value', initialSvgCount);
      await expect(finalEllipseCount).toHaveText('#ellipse-count-value', initialEllipseCount);
      await expect(finalLogoCount).toHaveText('#logo-count-value', initialLogoCount);

      // Verify all logos are still visible
      await expect(page.locator('[data-testid="consistency-logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="content-logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="footer-logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="icon-logo"]')).toBeVisible();

      // Take after rapid switching screenshot
      await expect(page.locator('body')).toHaveScreenshot('theme-consistency-after.png', {
        fullPage: true,
        threshold: 0.2
      });
    });
  });

  test.describe('System Theme Integration', () => {
    test('should respect system color scheme preference', async ({ page }) => {
      // Test system theme detection and auto-switching
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>System Theme Integration</title>
            <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
            <style>
              :root {
                --background: 0 0% 99%;
                --foreground: 220 13% 20%;
                --primary: 171 19% 41%;
              }
              .dark {
                --background: 220 13% 9%;
                --foreground: 0 0% 95%;
                --primary: 171 19% 65%;
              }
              @media (prefers-color-scheme: dark) {
                :root {
                  --background: 220 13% 9%;
                  --foreground: 0 0% 95%;
                  --primary: 171 19% 65%;
                }
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                margin: 0;
                padding: 20px;
                background: hsl(var(--background));
                color: hsl(var(--foreground));
                transition: background-color 0.3s ease, color 0.3s ease;
              }
              .system-test {
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                border: 1px solid hsl(var(--primary));
                border-radius: 12px;
                text-align: center;
              }
              .theme-info {
                background: hsl(var(--primary) / 0.1);
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="system-test">
              <div data-testid="system-logo" style="margin-bottom: 20px;"></div>
              <h1 style="color: hsl(var(--primary)); margin-bottom: 20px;">System Theme Integration</h1>
              
              <div class="theme-info">
                <h3 style="color: hsl(var(--primary)); margin-bottom: 12px;">System Preferences</h3>
                <div data-testid="system-preference">Detected: <span id="system-theme">Unknown</span></div>
                <div data-testid="current-theme">Current: <span id="current-theme">Light</span></div>
              </div>
              
              <button data-testid="detect-system-btn" 
                      style="padding: 12px 24px; border: 1px solid hsl(var(--primary)); background: hsl(var(--primary)); color: white; border-radius: 6px; cursor: pointer; margin: 10px;">
                Detect System Theme
              </button>
              
              <button data-testid="simulate-dark-btn" 
                      style="padding: 12px 24px; border: 1px solid hsl(var(--primary)); background: transparent; color: hsl(var(--foreground)); border-radius: 6px; cursor: pointer; margin: 10px;">
                Simulate Dark Mode
              </button>
            </div>

            <script>
              function updateSystemLogo() {
                const systemLogo = document.querySelector('[data-testid="system-logo"]');
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches || 
                               document.documentElement.classList.contains('dark');
                
                if (systemLogo) {
                  const colors = isDark ? {
                    ask: 'transparent',
                    askStroke: '#ffffff',
                    think: '#ffffff',
                    apply: '#ffffff'
                  } : {
                    ask: 'transparent',
                    askStroke: 'hsl(171, 19%, 41%)',
                    think: 'hsl(171, 19%, 41%)',
                    apply: 'hsl(102, 58%, 32%)'
                  };
                  
                  systemLogo.innerHTML = \`
                    <div class="inline-flex flex-col gap-y-1 text-lg items-center" role="img" aria-label="Telesis - Ask, Think, Apply">
                      <svg width="64" height="24" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200 mb-1">
                        <title>Telesis Logo</title>
                        <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                        <g id="three-olives-logomark">
                          <ellipse cx="8" cy="9" rx="6" ry="8" fill="\${colors.ask}" stroke="\${colors.askStroke}" stroke-width="1.5"/>
                          <ellipse cx="24" cy="9" rx="6" ry="8" fill="\${colors.think}" stroke="none"/>
                          <ellipse cx="40" cy="9" rx="6" ry="8" fill="\${colors.apply}" stroke="none"/>
                        </g>
                      </svg>
                      <div class="select-none font-semibold tracking-tight text-center" style="color: hsl(var(--foreground));">
                        Telesis
                        <div class="text-xs font-normal opacity-75 mt-0.5" style="color: hsl(var(--primary));">Ask. Think. Apply.</div>
                      </div>
                    </div>
                  \`;
                }
              }
              
              function detectSystemTheme() {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.getElementById('system-theme').textContent = isDark ? 'Dark' : 'Light';
                document.getElementById('current-theme').textContent = isDark ? 'Dark' : 'Light';
                updateSystemLogo();
              }
              
              function simulateDarkMode() {
                const html = document.documentElement;
                const isCurrentlyDark = html.classList.contains('dark');
                
                if (isCurrentlyDark) {
                  html.classList.remove('dark');
                  document.getElementById('current-theme').textContent = 'Light';
                } else {
                  html.classList.add('dark');
                  document.getElementById('current-theme').textContent = 'Dark';
                }
                
                updateSystemLogo();
              }
              
              // Event listeners
              document.querySelector('[data-testid="detect-system-btn"]').addEventListener('click', detectSystemTheme);
              document.querySelector('[data-testid="simulate-dark-btn"]').addEventListener('click', simulateDarkMode);
              
              // Listen for system theme changes
              window.matchMedia('(prefers-color-scheme: dark)').addListener(function(e) {
                detectSystemTheme();
              });
              
              // Initialize
              detectSystemTheme();
            </script>
          </body>
        </html>
      `);

      await page.waitForTimeout(1000);

      // Verify initial state
      await expect(page.locator('[data-testid="system-logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="system-preference"]')).toBeVisible();
      await expect(page.locator('[data-testid="current-theme"]')).toBeVisible();

      // Test system detection
      await page.locator('[data-testid="detect-system-btn"]').click();
      await page.waitForTimeout(500);

      // Take system detection screenshot
      await expect(page.locator('body')).toHaveScreenshot('system-theme-detection.png', {
        fullPage: true,
        threshold: 0.2
      });

      // Test dark mode simulation
      await page.locator('[data-testid="simulate-dark-btn"]').click();
      await page.waitForTimeout(500);

      // Verify logo adapts to simulated dark mode
      await expect(page.locator('[data-testid="system-logo"]')).toBeVisible();

      // Take simulated dark mode screenshot
      await expect(page.locator('body')).toHaveScreenshot('system-theme-simulated-dark.png', {
        fullPage: true,
        threshold: 0.2
      });

      // Switch back to light
      await page.locator('[data-testid="simulate-dark-btn"]').click();
      await page.waitForTimeout(500);

      // Take final light mode screenshot
      await expect(page.locator('body')).toHaveScreenshot('system-theme-light-restored.png', {
        fullPage: true,
        threshold: 0.2
      });
    });
  });
});
