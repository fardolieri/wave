import { expect } from '@playwright/test';
import { test } from './two-clients-test-setup';

test.describe('Test peer to peer interaction', () => {
  test.beforeEach(async ({ pageA, pageB, isMobile }) => {
    if (isMobile) {
      await pageA.getByRole('button', { name: 'Open drawer' }).click();
      await pageB.getByRole('button', { name: 'Open drawer' }).click();
    }
  });

  test('userA can send a friend request to userB', async ({
    pageA,
    pageB,
    publicIdB,
  }) => {
    const pending = pageA.getByText('Pending');
    const friendRequest = pageB.getByText('Friend Request');

    await expect(pending).not.toBeVisible();
    await expect(friendRequest).not.toBeVisible();

    await pageA.getByPlaceholder("Paste your friend's peer ID").fill(publicIdB);

    await expect(pending).toBeVisible();
    await expect(friendRequest).toBeVisible();

    await expect(pageB.getByText('userA')).toBeVisible();
    // User B must accept before user A finds out user B's username
    await expect(pageA.getByText('userB')).not.toBeVisible();
  });

  test('userB can accept userA', async ({ pageA, pageB, publicIdB }) => {
    await pageA.getByPlaceholder("Paste your friend's peer ID").fill(publicIdB);

    await expect(pageB.getByText('userA')).toBeVisible();

    await pageB.getByRole('button', { name: 'Accept' }).click();

    await expect(pageA.getByText('Connected')).toBeVisible();
    await expect(pageA.getByText('Connected')).toBeVisible();
  });

  test('userB can decline userA', async ({ pageA, pageB, publicIdB }) => {
    await pageA.getByPlaceholder("Paste your friend's peer ID").fill(publicIdB);

    await expect(pageB.getByText('userA')).toBeVisible();

    await pageB.getByRole('button', { name: 'Decline' }).click();

    await expect(pageA.getByText('Pending')).toBeVisible();
    await expect(pageB.getByText('userA')).not.toBeVisible();
  });
});
