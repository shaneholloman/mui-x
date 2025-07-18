import * as React from 'react';
import { spy } from 'sinon';
import { createRenderer, reactMajor } from '@mui/internal-test-utils';
import { sleep } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { useGridEvent, internal_registryContainer } from './useGridEvent';
import { FinalizationRegistryBasedCleanupTracking } from '../../utils/cleanupTracking/FinalizationRegistryBasedCleanupTracking';
import { TimerBasedCleanupTracking } from '../../utils/cleanupTracking/TimerBasedCleanupTracking';

const noop = spy();

describe('useGridEvent', () => {
  const { render } = createRenderer();

  describe('FinalizationRegistry-based implementation', () => {
    // Needs ability to trigger the garbage collector and support for FinalizationRegistry (added in node 14)
    it.skipIf(
      !isJSDOM || typeof FinalizationRegistry === 'undefined' || typeof global.gc === 'undefined',
    )('should unsubscribe event listeners registered by uncommitted components', async () => {
      internal_registryContainer.current = new FinalizationRegistryBasedCleanupTracking();

      const unsubscribe = spy();
      const apiRef = {
        current: { subscribeEvent: spy(() => unsubscribe) },
      };

      function Test() {
        useGridEvent(apiRef as any, 'cellClick', noop);
        return null;
      }

      const { unmount } = render(<Test />);

      // StrictMode calls the component twice. However, on the second time it trashes all refs,
      // which makes 2 event listeners to be registered. Since the second render is never
      // committed (to simulate a trashed render in React 18), the effects also don't run, so we're
      // unable to unsubscribe the last listener using the cleanup function.
      // Since React 19, StrictMode works differently
      // https://react.dev/blog/2024/04/25/react-19-upgrade-guide#strict-mode-improvements
      const expectedCallCount = reactMajor >= 19 ? 1 : 3;
      expect(apiRef.current.subscribeEvent.callCount).to.equal(expectedCallCount);

      unmount();
      global.gc?.(); // Triggers garbage collector
      await sleep(50);

      // Ensure that both event listeners were unsubscribed
      expect(unsubscribe.callCount).to.equal(expectedCallCount);
    });
  });

  describe('Timer-based implementation', () => {
    it('should unsubscribe event listeners registered by uncommitted components', async () => {
      internal_registryContainer.current = new TimerBasedCleanupTracking(50);

      const unsubscribe = spy();
      const apiRef = {
        current: { subscribeEvent: spy(() => unsubscribe) },
      };

      function Test() {
        useGridEvent(apiRef as any, 'cellClick', noop);
        return null;
      }

      const { unmount } = render(<Test />);

      // StrictMode calls the component twice. However, on the second time it trashes all refs,
      // which makes 2 event listeners to be registered. Since the second render is never
      // committed (to simulate a trashed render in React 18), the effects also don't run, so we're
      // unable to unsubscribe the last listener using the cleanup function.
      // Since React 19, StrictMode works differently
      // https://react.dev/blog/2024/04/25/react-19-upgrade-guide#strict-mode-improvements
      const expectedCallCount = reactMajor >= 19 ? 2 : 3;
      expect(apiRef.current.subscribeEvent.callCount).to.equal(expectedCallCount);

      unmount();
      await sleep(60);

      // Ensure that all event listeners were unsubscribed
      expect(unsubscribe.callCount).to.equal(expectedCallCount);
    });
  });
});
