import React, { useRef } from 'react';
import { useSyncRef } from './hooks';
import type { ScrollbarBase } from './types';
import useScrollbar from './useScrollbar';
import './Scrollbar.less';

export interface ScrollbarProps extends ScrollbarBase {
  innerRef?: React.Ref<HTMLElement>;
  Wrapper: React.HTMLFactory<HTMLElement>;
}

export default function ScrollBar({
  className = '',
  onScroll,
  onMouseEnter,
  onMouseLeave,
  innerRef,
  children,
  suppressScrollX,
  suppressScrollY,
  suppressAutoHide,
  skin = 'white',
  trackGap,
  trackStyle,
  thumbStyle,
  minThumbSize,
  Wrapper,
  ...props
}: ScrollbarProps) {
  const scrollBoxRef = useRef<HTMLElement>(null);
  useSyncRef(innerRef, scrollBoxRef);

  const [horizontalBar, verticalBar, updateLayerNow, updateLayerThrottle, hideScrollbar] =
    useScrollbar(scrollBoxRef, {
      trackGap,
      trackStyle,
      thumbStyle,
      minThumbSize,
      suppressAutoHide,
    });

  function handleScroll(evt: React.UIEvent<HTMLElement, UIEvent>) {
    if (onScroll) {
      onScroll(evt);
    }
    updateLayerThrottle();
  }

  function handleMouseEnter(evt: React.MouseEvent<HTMLElement>) {
    if (onMouseEnter) {
      onMouseEnter(evt);
    }
    updateLayerNow();
  }

  function handleMouseLeave(evt: React.MouseEvent<HTMLElement>) {
    if (onMouseLeave) {
      onMouseLeave(evt);
    }
    hideScrollbar();
  }

  return (
    <Wrapper
      className={`ms-container${className && ` ${className}`}`}
      ref={scrollBoxRef}
      onScroll={handleScroll}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className={`ms-track-box ms-theme-${skin}`}>
        {!suppressScrollX && horizontalBar}
        {!suppressScrollY && verticalBar}
      </div>
      {children}
    </Wrapper>
  );
}
