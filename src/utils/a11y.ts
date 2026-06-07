import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

export const testA11y = async (container: Element) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

export const focusableSelectors = [
  'button',
  '[href]',
  'input',
  'select',
  'textarea',
  '[tabindex]:not([tabindex="-1"])',
];

export const getFocusableElements = (container: Element): Element[] => {
  return Array.from(container.querySelectorAll(focusableSelectors.join(',')));
};

export const ensureKeyboardNavigation = (container: Element) => {
  const focusableElements = getFocusableElements(container);
  focusableElements.forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
};