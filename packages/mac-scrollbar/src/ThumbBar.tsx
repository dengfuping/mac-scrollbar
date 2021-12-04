import React from 'react';
import { classNames, computeRatio, trackSize, updateScrollPosition } from './utils';
import type { ActionPosition, BoxSize } from './types';
import './ThumbBar.less';

export interface ThumbBarProps {
  visible: boolean;
  isWindow: boolean;
  minThumbSize?: number;
  /**
   * @default vertical
   */
  horizontal?: boolean;
  /**
   * @default white
   */
  theme?: 'dark';
  isPress: boolean | undefined;

  grooveRef: React.RefObject<HTMLDivElement>;
  boxSize: BoxSize;

  updateAction: React.Dispatch<React.SetStateAction<ActionPosition>>;
}

function ThumbBar({
  visible,
  isWindow,
  minThumbSize,
  horizontal,
  isPress,

  grooveRef,
  boxSize,

  updateAction,
}: ThumbBarProps) {
  const { clientWidth, clientHeight, paddingTop, paddingLeft, scrollWidth, scrollHeight } = boxSize;

  const [sizeKey, offsetSize, scrollSize] = horizontal
    ? ['width', clientWidth, scrollWidth]
    : ['height', clientHeight, scrollHeight];

  function getContainerBox() {
    const targetNode = grooveRef.current?.parentNode?.parentNode as
      | HTMLDivElement
      | HTMLBodyElement;
    return targetNode === document.body ? document.documentElement : targetNode;
  }

  function handleThumbBarClick(e: React.MouseEvent<HTMLDivElement>) {
    const containerBox = getContainerBox();
    const { scrollLeft, scrollTop } = containerBox;
    const scrollPosition = horizontal ? scrollLeft : scrollTop;
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const clickPosition = horizontal
      ? (e.clientX - rect.left) / rect.width
      : (e.clientY - rect.top) / rect.height;
    const scrollRatio = scrollPosition / scrollSize;

    const position =
      clickPosition > scrollRatio
        ? Math.min(scrollSize, scrollPosition + offsetSize)
        : Math.max(0, scrollPosition - offsetSize);

    updateScrollPosition(containerBox, position, horizontal);
  }

  function handleStart(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const { scrollLeft, scrollTop } = getContainerBox();
    updateAction({
      isPressX: horizontal,
      isPressY: !horizontal,
      lastScrollTop: scrollTop,
      lastScrollLeft: scrollLeft,
      pressStartX: e.clientX,
      pressStartY: e.clientY,
    });
  }

  const style = isWindow
    ? ({ position: 'fixed' } as React.CSSProperties)
    : ({
        [sizeKey]: offsetSize,
        top: (horizontal ? clientHeight - trackSize : 0) - paddingTop,
        left: (horizontal ? 0 : clientWidth - trackSize) - paddingLeft,
      } as React.CSSProperties);

  return (
    <div
      className={classNames('ms-track', horizontal ? 'ms-x' : 'ms-y', {
        'ms-active': isPress,
        'ms-track-show': visible,
      })}
      onClick={handleThumbBarClick}
      ref={grooveRef}
      style={style}
    >
      <div
        className="ms-thumb"
        onMouseDown={handleStart}
        onClick={(e) => e.stopPropagation()}
        style={{
          [sizeKey]: computeRatio(scrollSize, offsetSize, minThumbSize).thumbSize,
        }}
      />
    </div>
  );
}

export default React.memo(ThumbBar);
