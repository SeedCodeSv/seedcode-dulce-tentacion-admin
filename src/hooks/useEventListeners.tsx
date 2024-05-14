import { useEffect, useRef } from "react";

type EventHandler = (event: Event) => void;

export default function useEventListener(
  eventName: string,
  handler: EventHandler,
  element: HTMLElement | Window = window
): void {
  const savedHandler = useRef<EventHandler>();

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
