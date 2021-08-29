/* eslint-disable no-param-reassign */
import type React from 'react';

export const minThumbSize = 20;

export function handleExtractSize(target: HTMLDivElement) {
  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } = target;
  return {
    offsetWidth,
    scrollWidth,
    offsetHeight,
    scrollHeight,
  };
}

export function isDirectionEnable(
  direction: 'vertical' | 'horizontal' | 'auto',
  curr: 'vertical' | 'horizontal' | 'auto',
) {
  return direction === 'auto' || curr === 'horizontal' ? 'auto' : undefined;
}

export function classNames(...args: (string | undefined | Record<string, unknown>)[]) {
  return args
    .flatMap((item) =>
      typeof item === 'object' ? Object.keys(item).map((n) => (item[n] ? n : undefined)) : item,
    )
    .join(' ');
}

export function updateElementStyle(element: HTMLElement, obj: Record<string, number>) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const key in obj) {
    element.style[key] = `${obj[key]}px`;
  }
}

export function updateScrollPosition(
  element: HTMLElement | null | undefined,
  position: number,
  horizontal?: boolean,
) {
  if (!element) {
    return;
  }
  if (horizontal) {
    element.scrollLeft = position;
    return;
  }
  element.scrollTop = position;
}

export function updateScrollElementStyle(
  evt: React.UIEvent<HTMLDivElement, UIEvent>,
  horizontalElement: HTMLElement | null | undefined,
  verticalElement: HTMLElement | null | undefined,
) {
  const { scrollTop, scrollLeft, scrollWidth, scrollHeight, offsetWidth, offsetHeight } =
    evt.target as HTMLDivElement;

  if (horizontalElement) {
    updateElementStyle(horizontalElement, {
      bottom: -scrollTop,
      left: scrollLeft,
    });
    updateThumbStyle(
      horizontalElement.firstChild as HTMLDivElement,
      scrollWidth,
      offsetWidth,
      scrollLeft,
      true,
    );
  }

  if (verticalElement) {
    updateElementStyle(verticalElement, {
      top: scrollTop,
      right: -scrollLeft,
    });
    updateThumbStyle(
      verticalElement.firstChild as HTMLDivElement,
      scrollHeight,
      offsetHeight,
      scrollTop,
    );
  }
}

export function updateThumbStyle(
  thumbElement: HTMLDivElement,
  scrollSize: number,
  offsetSize: number,
  scrollPosition: number,
  horizontal?: boolean,
) {
  const positionKey = horizontal ? 'left' : 'top';

  const realThumbSize = (offsetSize / scrollSize) * offsetSize;
  const distance = Math.max(minThumbSize - realThumbSize, 0);

  updateElementStyle(thumbElement, {
    [positionKey]: Math.min(
      (scrollPosition / scrollSize) * (offsetSize - distance),
      offsetSize - minThumbSize,
    ),
  });
}
