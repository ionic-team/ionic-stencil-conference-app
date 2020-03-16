import { newE2EPage } from '@stencil/core/testing';

describe('page-tutorial', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<page-tutorial></page-tutorial>');

    const element = await page.find('page-tutorial');
    expect(element).toHaveClass('hydrated');
  });

  it('contains a skip button', async () => {
    const page = await newE2EPage();
    await page.setContent('<page-tutorial></page-tutorial>');

    const element = await page.find('page-tutorial ion-button');
    expect(element.textContent).toEqual('Skip');
  });
});
