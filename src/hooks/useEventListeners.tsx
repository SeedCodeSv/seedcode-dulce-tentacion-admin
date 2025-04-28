import { useEffect, useRef } from 'react';

export type TEventHandler = (event: Event) => void;

export default function useEventListener(
  eventName: string,
  handler: TEventHandler,
  element: HTMLElement | Window = window
): void {
  const savedHandler = useRef<TEventHandler>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;

    if (!isSupported) return;

    const eventListener = (event: Event) => savedHandler.current!(event);

    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}
